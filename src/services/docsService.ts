import { PodmanMarkdownPreprocessor } from './podmanMarkdownPreprocessor';
import type { DocManifest, DocContent, DocCategory, DocMetadata } from './docsTypes';

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

  // In-flight request deduplication so simultaneous mounts share a single fetch
  private manifestPromise: Promise<DocManifest> | null = null;
  private docPromises: Map<string, Promise<DocContent>> = new Map();

  // Revision tracking & revalidation
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

  private cleanLegacyCaches(): void {
    if (typeof window === 'undefined') return;
    try {
      for (const store of [window.sessionStorage, window.localStorage]) {
        if (!store) continue;
        const keysToRemove: string[] = [];
        for (let i = 0; i < store.length; i++) {
          const k = store.key(i);
          if (
            k &&
            (k.startsWith('podman_doc_') || k.startsWith('podman_docs_') || k.startsWith('podman_v5_')) &&
            !k.startsWith('podman_v6_')
          ) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => store.removeItem(k));
      }
      const savedSha = this.getStorage()?.getItem('podman_v6_latest_sha');
      if (savedSha) {
        this.latestCommitSha = savedSha;
      }
    } catch {
      // Storage access blocked or restricted
    }
  }

  /**
   * Checks whether a newer static build or upstream commit revision is available.
   * If the revision changed, invalidates all cached entries immediately.
   */
  public async checkUpstreamChanges(bypassThrottle = false): Promise<boolean> {
    const now = Date.now();
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
            // Static manifest unavailable, fall back to GitHub commit check
          }
        }

        // 2. Fallback: GitHub commit check with conditional ETag (304 costs 0 rate limit)
        if (!detectedSha) {
          const headers: Record<string, string> = {
            Accept: 'application/vnd.github.v3+json',
          };
          const storage = this.getStorage();
          const storedEtag = storage ? storage.getItem('podman_v6_commit_etag') : null;
          if (storedEtag) {
            headers['If-None-Match'] = storedEtag;
          }

          const res = await fetch(GITHUB_COMMITS_URL, { headers });
          if (res.status === 304) {
            detectedSha = this.latestCommitSha;
          } else if (res.ok) {
            const etag = res.headers.get('ETag');
            if (etag && storage) {
              try {
                storage.setItem('podman_v6_commit_etag', etag);
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
      } catch {
        // Ignore network failure; keep existing cached data
      }

      if (detectedSha && this.latestCommitSha && detectedSha !== this.latestCommitSha) {
        this.invalidateAllCaches(detectedSha);
        return true;
      }

      if (detectedSha && !this.latestCommitSha) {
        this.latestCommitSha = detectedSha;
        try {
          this.getStorage()?.setItem('podman_v6_latest_sha', detectedSha);
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
   * Immediately clears memory and storage caches when a newer revision is detected.
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
            if (k && k.startsWith('podman_v6_') && k !== 'podman_v6_commit_etag') {
              keysToRemove.push(k);
            }
          }
          keysToRemove.forEach(k => storage.removeItem(k));
          if (newSha) {
            storage.setItem('podman_v6_latest_sha', newSha);
          }
        }
        window.dispatchEvent(new CustomEvent('podman-docs-invalidated'));
      } catch {
        // Ignore
      }
    }
  }

  private async revalidateManifestInBackground(): Promise<void> {
    const changed = await this.checkUpstreamChanges(true);
    if (changed) {
      await this.fetchFreshManifest();
    } else if (this.manifestCache) {
      this.manifestCache.cachedAt = Date.now();
      try {
        this.getStorage()?.setItem('podman_v6_manifest', JSON.stringify(this.manifestCache));
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Fetches the complete CLI docs manifest with Stale-While-Revalidate (SWR) and request deduplication.
   */
  public async getManifest(forceRefresh = false): Promise<DocManifest> {
    const now = Date.now();

    if (this.manifestCache && !forceRefresh) {
      if (this.isEntryFresh(this.manifestCache, now)) {
        if (typeof window !== 'undefined') {
          this.checkUpstreamChanges().catch(() => undefined);
        }
        return this.manifestCache.data;
      }
      this.revalidateManifestInBackground().catch(() => undefined);
      return this.manifestCache.data;
    }

    const storage = this.getStorage();
    if (storage && !forceRefresh) {
      try {
        const stored = storage.getItem('podman_v6_manifest');
        if (stored) {
          const entry: CacheEntry<DocManifest> = JSON.parse(stored);
          this.manifestCache = entry;
          if (this.isEntryFresh(entry, now)) {
            if (typeof window !== 'undefined') {
              this.checkUpstreamChanges().catch(() => undefined);
            }
            return entry.data;
          }
          this.revalidateManifestInBackground().catch(() => undefined);
          return entry.data;
        }
      } catch {
        // Continue to fresh fetch
      }
    }

    if (!forceRefresh && this.manifestPromise) {
      return this.manifestPromise;
    }

    this.manifestPromise = this.fetchFreshManifest().finally(() => {
      this.manifestPromise = null;
    });
    return this.manifestPromise;
  }

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
                this.getStorage()?.setItem('podman_v6_latest_sha', staticManifest.revision);
              } catch {
                // Ignore
              }
            }
            this.saveManifestCache(staticManifest);
            return staticManifest;
          }
        }
      } catch {
        // Static manifest unavailable, proceed to GitHub fallback
      }
    }

    if (typeof window !== 'undefined' && !this.latestCommitSha) {
      this.checkUpstreamChanges().catch(() => undefined);
    }

    // Strategy B: Direct GitHub API fallback with conditional ETag support
    try {
      const storage = this.getStorage();
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
      };
      const storedManifestEtag = storage ? storage.getItem('podman_v6_manifest_etag') : null;
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
          storage.setItem('podman_v6_manifest_etag', etag);
        } catch {
          // Ignore
        }
      }

      const items: Array<{ name: string; type: string }> = await response.json();
      const files = items.filter(i => i.type === 'file' && (i.name.endsWith('.md') || i.name.endsWith('.md.in')));

      const metadataList: DocMetadata[] = [];
      for (const file of files) {
        if (file.name === 'README.md' || file.name === '.gitignore') continue;

        const isTemplate = file.name.endsWith('.md.in');
        const cleanName = file.name.replace(/\.(1|5|7)(\.md|\.md\.in)?$/, '');
        let section = '1';
        const secMatch = file.name.match(/\.(1|5|7)(?:\.md|\.md\.in)?$/);
        if (secMatch) section = secMatch[1];

        metadataList.push({
          slug: cleanName,
          title: cleanName,
          section,
          description: `Podman CLI reference documentation for ${cleanName}`,
          filename: file.name,
          category: this.preprocessor.categorizeCommand(cleanName, section),
          isTemplate,
        });
      }

      const manifest = this.buildManifestStructure(metadataList, {});
      this.saveManifestCache(manifest);
      return manifest;
    } catch {
      if (this.manifestCache) {
        return this.manifestCache.data;
      }
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
        this.getStorage()?.setItem('podman_v6_manifest', JSON.stringify(entry));
        window.dispatchEvent(new CustomEvent('podman-docs-manifest-updated', { detail: manifest }));
      } catch {
        // Storage limit reached
      }
    }
  }

  private buildManifestStructure(items: DocMetadata[], aliases: Record<string, string>): DocManifest {
    const categoryOrder = [
      'Core CLI (Man Pages)',
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
          this.getStorage()?.setItem(`podman_v6_doc_${cacheKey}`, JSON.stringify(entry));
        } catch {
          // Ignore
        }
      }
    }
  }

  /**
   * Fetches a specific CLI documentation page by slug with SWR and request deduplication.
   */
  public async getDocument(slug: string, forceRefresh = false): Promise<DocContent> {
    const cacheKey = slug.toLowerCase();
    const now = Date.now();

    const cachedEntry = this.memoryDocCache.get(cacheKey);
    if (!forceRefresh && cachedEntry) {
      if (this.isEntryFresh(cachedEntry, now)) {
        if (typeof window !== 'undefined') {
          this.checkUpstreamChanges().catch(() => undefined);
        }
        return cachedEntry.data;
      }
      this.revalidateDocumentInBackground(slug).catch(() => undefined);
      return cachedEntry.data;
    }

    const storage = this.getStorage();
    if (!forceRefresh && storage) {
      try {
        const stored = storage.getItem(`podman_v6_doc_${cacheKey}`);
        if (stored) {
          const entry: CacheEntry<DocContent> = JSON.parse(stored);
          this.memoryDocCache.set(cacheKey, entry);
          if (this.isEntryFresh(entry, now)) {
            if (typeof window !== 'undefined') {
              this.checkUpstreamChanges().catch(() => undefined);
            }
            return entry.data;
          }
          this.revalidateDocumentInBackground(slug).catch(() => undefined);
          return entry.data;
        }
      } catch {
        // Continue to fresh fetch
      }
    }

    const inFlight = this.docPromises.get(cacheKey);
    if (!forceRefresh && inFlight) {
      return inFlight;
    }

    const promise = this.fetchFreshDocument(slug).finally(() => {
      this.docPromises.delete(cacheKey);
    });
    this.docPromises.set(cacheKey, promise);
    return promise;
  }

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
        // Static command JSON unavailable, proceed to GitHub raw fallback
      }
    }

    // Strategy B: Direct GitHub Raw Fetch with Preprocessing fallback
    const manifest = await this.getManifest();
    let targetMeta: DocMetadata | undefined;

    for (const cat of manifest.categories) {
      const found = cat.items.find(i => i.slug.toLowerCase() === cacheKey);
      if (found) {
        targetMeta = found;
        break;
      }
    }

    const filename = targetMeta?.filename || `${slug}.1.md`;
    let rawMarkdown = '';
    let usedFilename = filename;
    const rawBaseUrl = this.getRawBaseUrl();

    try {
      const rawRes = await fetch(`${rawBaseUrl}/${filename}`);
      if (!rawRes.ok && filename.endsWith('.md')) {
        const inRes = await fetch(`${rawBaseUrl}/${filename}.in`);
        if (inRes.ok) {
          rawMarkdown = await inRes.text();
          usedFilename = `${filename}.in`;
        } else {
          throw new Error(`Document ${slug} not found`);
        }
      } else if (!rawRes.ok && filename.endsWith('.md.in')) {
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
        this.getStorage()?.setItem(`podman_v6_doc_${cacheKey}`, JSON.stringify(entry));
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
}

export const docsService = new DocsService();
