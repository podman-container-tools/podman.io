import { PodmanMarkdownPreprocessor } from './podmanMarkdownPreprocessor';
import type { DocManifest, DocContent, DocCategory, DocMetadata, SearchResult } from './docsTypes';

const REPO_OWNER = 'containers';
const REPO_NAME = 'podman';
const BRANCH = 'main';
const BASE_MARKDOWN_PATH = 'docs/source/markdown';
const STATIC_DOCS_BASE = '/data/cli-docs';

const GITHUB_COMMITS_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?path=${BASE_MARKDOWN_PATH}&sha=${BRANCH}&per_page=1`;

// Bounded Cache TTL: 5 minutes. After 5 minutes, SWR triggers background revalidation.
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  commitSha?: string;
}

// Fallback top core commands in case GitHub API rate limits in client browser
const CORE_COMMANDS_FALLBACK: { slug: string; filename: string; title: string; section: string; desc: string }[] = [
  {
    slug: 'podman',
    filename: 'podman.1.md',
    title: 'podman',
    section: '1',
    desc: 'Simple management tool for pods, containers and images',
  },
  {
    slug: 'podman-run',
    filename: 'podman-run.1.md.in',
    title: 'podman-run',
    section: '1',
    desc: 'Run a command in a new container',
  },
  {
    slug: 'podman-build',
    filename: 'podman-build.1.md.in',
    title: 'podman-build',
    section: '1',
    desc: 'Build container images using Buildah',
  },
  {
    slug: 'podman-exec',
    filename: 'podman-exec.1.md.in',
    title: 'podman-exec',
    section: '1',
    desc: 'Execute a command in a running container',
  },
  { slug: 'podman-ps', filename: 'podman-ps.1.md.in', title: 'podman-ps', section: '1', desc: 'List containers' },
  {
    slug: 'podman-images',
    filename: 'podman-images.1.md.in',
    title: 'podman-images',
    section: '1',
    desc: 'List images in local storage',
  },
  {
    slug: 'podman-pull',
    filename: 'podman-pull.1.md.in',
    title: 'podman-pull',
    section: '1',
    desc: 'Pull an image from a registry',
  },
  {
    slug: 'podman-push',
    filename: 'podman-push.1.md.in',
    title: 'podman-push',
    section: '1',
    desc: 'Push an image to a registry',
  },
  {
    slug: 'podman-stop',
    filename: 'podman-stop.1.md.in',
    title: 'podman-stop',
    section: '1',
    desc: 'Stop one or more containers',
  },
  {
    slug: 'podman-rm',
    filename: 'podman-rm.1.md.in',
    title: 'podman-rm',
    section: '1',
    desc: 'Remove one or more containers',
  },
  {
    slug: 'podman-pod-create',
    filename: 'podman-pod-create.1.md.in',
    title: 'podman-pod-create',
    section: '1',
    desc: 'Create a new empty pod',
  },
  { slug: 'podman-pod-ps', filename: 'podman-pod-ps.1.md.in', title: 'podman-pod-ps', section: '1', desc: 'List pods' },
  {
    slug: 'podman-kube-play',
    filename: 'podman-kube-play.1.md.in',
    title: 'podman-kube-play',
    section: '1',
    desc: 'Create containers and pods from a Kubernetes YAML file',
  },
  {
    slug: 'podman-kube-generate',
    filename: 'podman-kube-generate.1.md.in',
    title: 'podman-kube-generate',
    section: '1',
    desc: 'Generate Kubernetes YAML based on containers or pods',
  },
  {
    slug: 'podman-network-create',
    filename: 'podman-network-create.1.md.in',
    title: 'podman-network-create',
    section: '1',
    desc: 'Create a Podman network',
  },
  {
    slug: 'podman-volume-create',
    filename: 'podman-volume-create.1.md.in',
    title: 'podman-volume-create',
    section: '1',
    desc: 'Create a new volume',
  },
  {
    slug: 'podman-machine-init',
    filename: 'podman-machine-init.1.md.in',
    title: 'podman-machine-init',
    section: '1',
    desc: 'Initialize a new virtual machine',
  },
  {
    slug: 'podman-machine-start',
    filename: 'podman-machine-start.1.md.in',
    title: 'podman-machine-start',
    section: '1',
    desc: 'Start a virtual machine',
  },
  {
    slug: 'podman-system-prune',
    filename: 'podman-system-prune.1.md.in',
    title: 'podman-system-prune',
    section: '1',
    desc: 'Remove unused data',
  },
  {
    slug: 'podman-systemd.unit',
    filename: 'podman-systemd.unit.5.md.in',
    title: 'podman-systemd.unit',
    section: '5',
    desc: 'Execution of containers under systemd via Quadlet',
  },
  {
    slug: 'podman-troubleshooting',
    filename: 'podman-troubleshooting.7.md',
    title: 'podman-troubleshooting',
    section: '7',
    desc: 'Podman troubleshooting guide',
  },
  {
    slug: 'podman-rootless',
    filename: 'podman-rootless.7.md',
    title: 'podman-rootless',
    section: '7',
    desc: 'Podman rootless mode guide',
  },
];

export class DocsService {
  private preprocessor: PodmanMarkdownPreprocessor;
  private memoryDocCache: Map<string, CacheEntry<DocContent>> = new Map();
  private manifestCache: CacheEntry<DocManifest> | null = null;
  private optionsCache: Map<string, string> = new Map();

  // API backend connection (if deployed or configured)
  private apiBaseUrl: string | null = null;
  private apiChecked = false;

  // Change detection state
  private latestCommitSha: string | null = null;
  private lastCommitCheckTime = 0;
  private commitCheckPromise: Promise<boolean> | null = null;

  constructor() {
    this.preprocessor = new PodmanMarkdownPreprocessor(this.optionsCache);
    this.cleanLegacyCaches();
  }

  private getRawBaseUrl(): string {
    const ref = this.latestCommitSha || BRANCH;
    return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${ref}/${BASE_MARKDOWN_PATH}`;
  }

  private getManifestApiUrl(): string {
    const ref = this.latestCommitSha || BRANCH;
    return `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${BASE_MARKDOWN_PATH}?ref=${ref}`;
  }

  private isEntryFresh<T>(entry: CacheEntry<T>, now: number): boolean {
    if (now - entry.cachedAt >= CACHE_TTL_MS) return false;
    if (this.latestCommitSha && entry.commitSha && entry.commitSha !== this.latestCommitSha) return false;
    return true;
  }

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage || window.sessionStorage;
    } catch {
      return null;
    }
  }

  /**
   * Remove old non-versioned or stale session/local storage keys
   */
  private cleanLegacyCaches(): void {
    if (typeof window === 'undefined') return;
    try {
      for (const store of [window.sessionStorage, window.localStorage]) {
        if (!store) continue;
        const keysToRemove: string[] = [];
        for (let i = 0; i < store.length; i++) {
          const k = store.key(i);
          if (k && (k.startsWith('podman_doc_') || k.startsWith('podman_docs_')) && !k.startsWith('podman_v5_')) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => store.removeItem(k));
      }
      const savedSha = this.getStorage()?.getItem('podman_v5_latest_sha');
      if (savedSha) {
        this.latestCommitSha = savedSha;
      }
    } catch {
      // Storage access blocked or restricted
    }
  }

  /**
   * Determine if a dedicated docs API service is deployed and available
   */
  public async getApiBaseUrl(): Promise<string | null> {
    if (this.apiChecked) return this.apiBaseUrl;
    this.apiChecked = true;

    // 1. Explicit window global injection (e.g. from environment or script tag)
    if (typeof window !== 'undefined') {
      const win = window as unknown as { __DOCS_API_URL__?: string };
      if (win.__DOCS_API_URL__) {
        this.apiBaseUrl = String(win.__DOCS_API_URL__).replace(/\/+$/, '');
        return this.apiBaseUrl;
      }
    }

    // 2. Build-time environment variable
    if (typeof process !== 'undefined' && process.env) {
      const envUrl = process.env.DOCS_API_URL || process.env.REACT_APP_DOCS_API_URL;
      if (envUrl) {
        this.apiBaseUrl = String(envUrl).replace(/\/+$/, '');
        return this.apiBaseUrl;
      }
    }

    // 3. Auto-detect relative endpoint (e.g. if reverse-proxied /api/docs/health)
    if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        const res = await fetch('/api/docs/health', { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data && data.status === 'ok') {
            this.apiBaseUrl = ''; // Use current origin
            return this.apiBaseUrl;
          }
        }
      } catch {
        // No local/reverse-proxied API found; fallback to client GitHub change detection
      }
    }

    this.apiBaseUrl = null;
    return null;
  }

  /**
   * Checks whether GitHub's upstream branch has new commits for markdown docs.
   * If a new commit SHA is detected, all stale caches are invalidated.
   */
  public async checkUpstreamChanges(bypassThrottle = false): Promise<boolean> {
    const now = Date.now();
    // Throttle commit check to once every 60 seconds unless explicitly bypassed on TTL expiry
    if (!bypassThrottle && now - this.lastCommitCheckTime < 60000 && this.latestCommitSha) {
      return false;
    }

    if (this.commitCheckPromise) {
      return this.commitCheckPromise;
    }

    this.commitCheckPromise = (async () => {
      this.lastCommitCheckTime = Date.now();
      let detectedSha: string | null = null;
      try {
        // 1. Check static site manifest first (fast, zero GitHub API calls)
        if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
          try {
            const staticRes = await fetch(`${STATIC_DOCS_BASE}/manifest.json`, { cache: 'no-cache' });
            if (staticRes.ok) {
              const staticManifest: DocManifest = await staticRes.json();
              if (staticManifest && staticManifest.revision) {
                detectedSha = staticManifest.revision;
              }
            }
          } catch {
            // Static manifest not found, continue to API/GitHub check
          }
        }

        // 2. Check API service if available and static manifest did not resolve
        if (!detectedSha) {
          const apiUrl = await this.getApiBaseUrl();
          if (apiUrl !== null) {
            const res = await fetch(`${apiUrl}/api/docs/health`);
            if (res.ok) {
              const info = await res.json();
              detectedSha = info.commitSha || null;
            }
          } else {
            // 3. Direct GitHub commit check with conditional ETag headers (304 responses cost 0 GitHub rate limit quota)
            const headers: Record<string, string> = {
              Accept: 'application/vnd.github.v3+json',
            };
            const storage = this.getStorage();
            const storedEtag = storage ? storage.getItem('podman_v5_commit_etag') : null;
            if (storedEtag) {
              headers['If-None-Match'] = storedEtag;
            }

            const res = await fetch(GITHUB_COMMITS_URL, { headers });
            if (res.status === 304) {
              // 304 Not Modified: Nothing has changed upstream
              detectedSha = this.latestCommitSha;
            } else if (res.ok) {
              const etag = res.headers.get('ETag');
              if (etag && storage) {
                try {
                  storage.setItem('podman_v5_commit_etag', etag);
                } catch {
                  // Ignore
                }
              }
              const commits = await res.json();
              if (Array.isArray(commits) && commits.length > 0 && commits[0].sha) {
                detectedSha = commits[0].sha;
              }
            }
          }
        }
      } catch {
        // Ignore network failure; fallback to cached data
      }

      if (detectedSha && this.latestCommitSha && detectedSha !== this.latestCommitSha) {
        // UPSTREAM COMMIT CHANGED! Clear all cached documents and manifest immediately!
        this.invalidateAllCaches(detectedSha);
        return true;
      }

      if (detectedSha && !this.latestCommitSha) {
        this.latestCommitSha = detectedSha;
        try {
          this.getStorage()?.setItem('podman_v5_latest_sha', detectedSha);
        } catch {
          // Ignore
        }
      }

      return false;
    })();

    const result = await this.commitCheckPromise;
    this.commitCheckPromise = null;
    return result;
  }

  /**
   * Immediately clears memory and storage caches when upstream changes are detected
   */
  public invalidateAllCaches(newSha?: string): void {
    this.manifestCache = null;
    this.memoryDocCache.clear();
    this.optionsCache.clear();
    if (newSha) this.latestCommitSha = newSha;

    if (typeof window !== 'undefined') {
      try {
        const storage = this.getStorage();
        if (storage) {
          const keysToRemove: string[] = [];
          for (let i = 0; i < storage.length; i++) {
            const k = storage.key(i);
            if (k && k.startsWith('podman_v5_') && k !== 'podman_v5_commit_etag') {
              keysToRemove.push(k);
            }
          }
          keysToRemove.forEach(k => storage.removeItem(k));
          if (newSha) {
            storage.setItem('podman_v5_latest_sha', newSha);
          }
        }
        // Notify components to update
        window.dispatchEvent(new CustomEvent('podman-docs-invalidated'));
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Revalidates the manifest in background only if upstream commits changed
   */
  private async revalidateManifestInBackground(): Promise<void> {
    const changed = await this.checkUpstreamChanges(true);
    if (changed) {
      await this.fetchFreshManifest();
    } else if (this.manifestCache) {
      // Nothing changed upstream — extend cache TTL without consuming API quota
      this.manifestCache.cachedAt = Date.now();
      try {
        this.getStorage()?.setItem('podman_v5_manifest', JSON.stringify(this.manifestCache));
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Fetches the complete manifest with Stale-While-Revalidate (SWR).
   */
  public async getManifest(forceRefresh = false): Promise<DocManifest> {
    const now = Date.now();

    // 1. Check in-memory cache
    if (this.manifestCache && !forceRefresh) {
      if (this.isEntryFresh(this.manifestCache, now)) {
        if (typeof window !== 'undefined') {
          this.checkUpstreamChanges().catch(() => undefined);
        }
        return this.manifestCache.data;
      }
      // SWR: return stale data immediately, revalidate via commit check in background
      this.revalidateManifestInBackground().catch(() => undefined);
      return this.manifestCache.data;
    }

    // 2. Check persistent storage
    const storage = this.getStorage();
    if (storage && !forceRefresh) {
      try {
        const stored = storage.getItem('podman_v5_manifest');
        if (stored) {
          const entry: CacheEntry<DocManifest> = JSON.parse(stored);
          this.manifestCache = entry;
          if (this.isEntryFresh(entry, now)) {
            if (typeof window !== 'undefined') {
              this.checkUpstreamChanges().catch(() => undefined);
            }
            return entry.data;
          }
          // SWR: return stale data immediately, revalidate via commit check in background
          this.revalidateManifestInBackground().catch(() => undefined);
          return entry.data;
        }
      } catch {
        // Continue to fresh fetch
      }
    }

    return this.fetchFreshManifest();
  }

  /**
   * Fetches fresh manifest from static build bundle, deployed API, or GitHub fallback
   */
  private async fetchFreshManifest(): Promise<DocManifest> {
    // Strategy A: Load static build-time generated manifest (zero GitHub API dependency)
    if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
      try {
        const staticRes = await fetch(`${STATIC_DOCS_BASE}/manifest.json`, { cache: 'no-cache' });
        if (staticRes.ok) {
          const staticManifest: DocManifest = await staticRes.json();
          if (staticManifest && Array.isArray(staticManifest.categories)) {
            if (staticManifest.revision) {
              this.latestCommitSha = staticManifest.revision;
              try {
                this.getStorage()?.setItem('podman_v5_latest_sha', staticManifest.revision);
              } catch {
                // Ignore
              }
            }
            this.saveManifestCache(staticManifest);
            return staticManifest;
          }
        }
      } catch {
        // Static manifest unavailable, proceed to fallback
      }
    }

    if (typeof window !== 'undefined' && !this.latestCommitSha) {
      this.checkUpstreamChanges().catch(() => undefined);
    }

    const apiUrl = await this.getApiBaseUrl();

    // Strategy B: Call deployed documentation service if configured
    if (apiUrl !== null) {
      try {
        const res = await fetch(`${apiUrl}/api/docs/manifest`);
        if (res.ok) {
          const rawData = await res.json();
          let manifest: DocManifest;
          if (rawData && Array.isArray(rawData.categories)) {
            manifest = rawData;
          } else if (rawData && Array.isArray(rawData.items)) {
            const mappedItems: DocMetadata[] = rawData.items.map((item: Partial<DocMetadata> & { slug: string }) => ({
              slug: item.slug,
              title: item.title || item.slug,
              section: item.section || '1',
              description: item.description || `Podman CLI reference documentation for ${item.slug}`,
              filename: item.filename || `${item.slug}.${item.section || '1'}.md`,
              category: item.category || this.preprocessor.categorizeCommand(item.slug, item.section || '1'),
              isTemplate: Boolean(item.isTemplate || (item.filename && item.filename.endsWith('.md.in'))),
            }));
            manifest = this.buildManifestStructure(mappedItems, rawData.aliases || {});
          } else {
            throw new Error('Malformed API manifest');
          }
          this.saveManifestCache(manifest);
          return manifest;
        }
      } catch (err) {
        console.warn('[DocsService] Deployed API manifest fetch failed, falling back to GitHub API:', err);
      }
    }

    // Strategy C: Direct GitHub API with conditional ETag support (304 costs 0 rate limit)
    try {
      const storage = this.getStorage();
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
      };
      const storedManifestEtag = storage ? storage.getItem('podman_v5_manifest_etag') : null;
      if (storedManifestEtag && this.manifestCache) {
        headers['If-None-Match'] = storedManifestEtag;
      }

      const response = await fetch(this.getManifestApiUrl(), { headers });

      if (response.status === 304 && this.manifestCache) {
        this.manifestCache.cachedAt = Date.now();
        return this.manifestCache.data;
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const etag = response.headers.get('ETag');
      if (etag && storage) {
        try {
          storage.setItem('podman_v5_manifest_etag', etag);
        } catch {
          // Ignore
        }
      }

      const items: Array<{ name: string; type: string }> = await response.json();
      const files = items.filter(i => i.type === 'file' && (i.name.endsWith('.md') || i.name.endsWith('.md.in')));

      const metadataList: DocMetadata[] = [];
      const aliases: Record<string, string> = {};

      for (const file of files) {
        if (file.name === 'README.md' || file.name === '.gitignore') continue;

        const isTemplate = file.name.endsWith('.md.in');
        const cleanName = file.name.replace(/\.(1|5|7)(\.md|\.md\.in)?$/, '');
        let section = '1';
        const secMatch = file.name.match(/\.(1|5|7)(?:\.md|\.md\.in)?$/);
        if (secMatch) section = secMatch[1];

        const title = cleanName;
        const category = this.preprocessor.categorizeCommand(title, section);

        metadataList.push({
          slug: title,
          title,
          section,
          description: `Podman CLI reference documentation for ${title}`,
          filename: file.name,
          category,
          isTemplate,
        });
      }

      const manifest = this.buildManifestStructure(metadataList, aliases);
      this.saveManifestCache(manifest);
      return manifest;
    } catch {
      if (this.manifestCache) {
        return this.manifestCache.data;
      }
      // Fallback manifest if offline or rate-limited
      const fallbackList: DocMetadata[] = CORE_COMMANDS_FALLBACK.map(item => ({
        slug: item.slug,
        title: item.title,
        section: item.section,
        description: item.desc,
        filename: item.filename,
        category: this.preprocessor.categorizeCommand(item.slug, item.section),
        isTemplate: item.filename.endsWith('.md.in'),
      }));

      const manifest = this.buildManifestStructure(fallbackList, {});
      this.saveManifestCache(manifest);
      return manifest;
    }
  }

  private saveManifestCache(manifest: DocManifest): void {
    const entry: CacheEntry<DocManifest> = {
      data: manifest,
      cachedAt: Date.now(),
      commitSha: this.latestCommitSha || undefined,
    };
    this.manifestCache = entry;

    if (typeof window !== 'undefined') {
      try {
        this.getStorage()?.setItem('podman_v5_manifest', JSON.stringify(entry));
        window.dispatchEvent(new CustomEvent('podman-docs-manifest-updated', { detail: manifest }));
      } catch {
        // Storage limit reached
      }
    }
  }

  private buildManifestStructure(items: DocMetadata[], aliases: Record<string, string>): DocManifest {
    const categoryOrder = [
      'Core CLI',
      'Containers',
      'Pods & Kubernetes',
      'Images',
      'Networks & Volumes',
      'System & Machine',
      'Quadlet & Systemd (Section 5)',
      'Guides & Troubleshooting (Section 7)',
      'Other Commands',
    ];

    const categoryMap = new Map<string, DocMetadata[]>();
    for (const cat of categoryOrder) {
      categoryMap.set(cat, []);
    }

    for (const item of items) {
      const list = categoryMap.get(item.category) || [];
      list.push(item);
      categoryMap.set(item.category, list);
    }

    const categories: DocCategory[] = [];
    categoryOrder.forEach(name => {
      const list = categoryMap.get(name) || [];
      if (list.length > 0) {
        list.sort((a, b) => a.title.localeCompare(b.title));
        categories.push({
          id: name.toLowerCase().replace(/[^\w]/g, '-'),
          name,
          items: list,
        });
      }
    });

    return {
      revision: this.latestCommitSha || 'main',
      generatedAt: new Date().toISOString(),
      categories,
      aliases,
      totalCount: items.length,
    };
  }

  /**
   * Revalidates a document in background only if upstream commits changed
   */
  private async revalidateDocumentInBackground(slug: string): Promise<void> {
    const cacheKey = slug.toLowerCase();
    const changed = await this.checkUpstreamChanges(true);
    if (changed) {
      await this.fetchFreshDocument(slug);
    } else {
      const entry = this.memoryDocCache.get(cacheKey);
      if (entry) {
        entry.cachedAt = Date.now();
        try {
          this.getStorage()?.setItem(`podman_v5_doc_${cacheKey}`, JSON.stringify(entry));
        } catch {
          // Ignore
        }
      }
    }
  }

  /**
   * Fetches and pre-processes a specific documentation file by slug with Stale-While-Revalidate (SWR).
   */
  public async getDocument(slug: string, forceRefresh = false): Promise<DocContent> {
    const cacheKey = slug.toLowerCase();
    const now = Date.now();

    // 1. Check in-memory cache
    const cachedEntry = this.memoryDocCache.get(cacheKey);
    if (!forceRefresh && cachedEntry) {
      if (this.isEntryFresh(cachedEntry, now)) {
        if (typeof window !== 'undefined') {
          this.checkUpstreamChanges().catch(() => undefined);
        }
        return cachedEntry.data;
      }
      // SWR: return stale data immediately, revalidate via commit check in background
      this.revalidateDocumentInBackground(slug).catch(() => undefined);
      return cachedEntry.data;
    }

    // 2. Check persistent storage
    const storage = this.getStorage();
    if (!forceRefresh && storage) {
      try {
        const stored = storage.getItem(`podman_v5_doc_${cacheKey}`);
        if (stored) {
          const entry: CacheEntry<DocContent> = JSON.parse(stored);
          this.memoryDocCache.set(cacheKey, entry);
          if (this.isEntryFresh(entry, now)) {
            if (typeof window !== 'undefined') {
              this.checkUpstreamChanges().catch(() => undefined);
            }
            return entry.data;
          }
          // SWR: return stale data immediately, revalidate via commit check in background
          this.revalidateDocumentInBackground(slug).catch(() => undefined);
          return entry.data;
        }
      } catch {
        // Continue to fresh fetch
      }
    }

    return this.fetchFreshDocument(slug);
  }

  /**
   * Fetches fresh document from static build bundle, deployed API, or GitHub fallback
   */
  private async fetchFreshDocument(slug: string): Promise<DocContent> {
    const cacheKey = slug.toLowerCase();

    // Strategy A: Load static build-time preprocessed JSON (zero GitHub API dependency)
    if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
      try {
        const staticRes = await fetch(`${STATIC_DOCS_BASE}/commands/${encodeURIComponent(cacheKey)}.json`, {
          cache: 'no-cache',
        });
        if (staticRes.ok) {
          const staticDoc: DocContent = await staticRes.json();
          if (staticDoc && staticDoc.markdown) {
            this.saveDocCache(cacheKey, staticDoc);
            return staticDoc;
          }
        }
      } catch {
        // Static command JSON unavailable, proceed to fallback
      }
    }

    const apiUrl = await this.getApiBaseUrl();

    // Strategy B: Call deployed documentation service if configured
    if (apiUrl !== null) {
      try {
        const res = await fetch(`${apiUrl}/api/docs/content?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const apiDoc = await res.json();
          const sec = apiDoc.section || '1';
          const fname = apiDoc.filename || `${slug}.${sec}.md`;
          // Convert to DocContent structure
          const docContent: DocContent = {
            metadata: {
              slug,
              title: apiDoc.title || slug,
              section: sec,
              description: apiDoc.description || `Podman CLI reference documentation for ${slug}`,
              filename: fname,
              category: this.preprocessor.categorizeCommand(slug, sec),
              isTemplate: fname.endsWith('.md.in'),
            },
            markdown: apiDoc.markdown,
            toc: this.preprocessor.extractTOC(apiDoc.markdown),
            revision: this.latestCommitSha || 'main',
            fetchedAt: new Date().toISOString(),
          };

          this.saveDocCache(cacheKey, docContent);
          return docContent;
        }
      } catch (err) {
        console.warn(`[DocsService] Deployed API fetch failed for ${slug}, falling back to GitHub raw:`, err);
      }
    }

    // Strategy C: Direct GitHub Raw Fetch with Preprocessing
    const manifest = await this.getManifest();
    let targetMeta: DocMetadata | undefined;

    for (const cat of manifest.categories) {
      const found = cat.items.find(i => i.slug.toLowerCase() === cacheKey);
      if (found) {
        targetMeta = found;
        break;
      }
    }

    let filename = targetMeta?.filename;
    if (!filename) {
      filename = `${slug}.1.md`;
    }

    let rawMarkdown = '';
    let usedFilename = filename;
    const rawBaseUrl = this.getRawBaseUrl();

    try {
      const rawRes = await fetch(`${rawBaseUrl}/${filename}`);
      if (!rawRes.ok && filename.endsWith('.md')) {
        // Try .md.in
        const inRes = await fetch(`${rawBaseUrl}/${filename}.in`);
        if (inRes.ok) {
          rawMarkdown = await inRes.text();
          usedFilename = `${filename}.in`;
        } else {
          throw new Error(`Document ${slug} not found`);
        }
      } else if (!rawRes.ok && filename.endsWith('.md.in')) {
        // Try removing .in
        const mdRes = await fetch(`${rawBaseUrl}/${filename.replace(/\.in$/, '')}`);
        if (mdRes.ok) {
          rawMarkdown = await mdRes.text();
          usedFilename = filename.replace(/\.in$/, '');
        } else {
          throw new Error(`Document ${slug} not found`);
        }
      } else {
        rawMarkdown = await rawRes.text();
      }
    } catch {
      rawMarkdown = `# ${slug}\n\nUnable to fetch latest documentation for \`${slug}\` from GitHub. Please check your network connection or view the source on GitHub.\n\n[View ${slug} on GitHub](https://github.com/${REPO_OWNER}/${REPO_NAME}/tree/${BRANCH}/${BASE_MARKDOWN_PATH})`;
    }

    // If file has @@option directives, fetch option snippets
    const optionMatches = rawMarkdown.match(/^@@option\s+([^\s\n]+)/gm);
    if (optionMatches && optionMatches.length > 0) {
      const optionNames = Array.from(new Set(optionMatches.map(m => m.replace(/^@@option\s+/, '').trim())));

      await Promise.all(
        optionNames.map(async optName => {
          const optKey = optName.endsWith('.md') ? optName : `${optName}.md`;
          if (!this.optionsCache.has(optKey)) {
            try {
              const res = await fetch(`${rawBaseUrl}/options/${optKey}`);
              if (res.ok) {
                const text = await res.text();
                this.optionsCache.set(optKey, text);
                this.preprocessor.setOptionSnippet(optKey, text);
              }
            } catch {
              // Ignore option fetch error
            }
          }
        }),
      );
    }

    const processed = this.preprocessor.process(usedFilename, rawMarkdown, manifest.revision);
    this.saveDocCache(cacheKey, processed);
    return processed;
  }

  private saveDocCache(cacheKey: string, processed: DocContent): void {
    const entry: CacheEntry<DocContent> = {
      data: processed,
      cachedAt: Date.now(),
      commitSha: this.latestCommitSha || undefined,
    };

    this.memoryDocCache.set(cacheKey, entry);
    if (typeof window !== 'undefined') {
      try {
        this.getStorage()?.setItem(`podman_v5_doc_${cacheKey}`, JSON.stringify(entry));
        window.dispatchEvent(
          new CustomEvent('podman-doc-updated', {
            detail: { slug: cacheKey, content: processed },
          }),
        );
      } catch {
        // Ignore storage limit
      }
    }
  }

  /**
   * Search across commands and options
   */
  public async search(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) return [];
    const q = query.toLowerCase().trim();

    const manifest = await this.getManifest();
    const results: SearchResult[] = [];

    for (const cat of manifest.categories) {
      for (const item of cat.items) {
        const titleMatch = item.title.toLowerCase().includes(q);
        const descMatch = item.description.toLowerCase().includes(q);

        if (titleMatch || descMatch) {
          results.push({
            title: item.title,
            slug: item.slug,
            category: item.category,
            section: item.section,
            description: item.description,
            matchedText: titleMatch ? item.title : item.description,
            matchType: titleMatch ? 'title' : 'description',
          });
        }
      }
    }

    return results;
  }
}

export const docsService = new DocsService();
