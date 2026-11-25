import type { DocManifest } from './docsTypes';

const STATIC_DOCS_BASE = '/data/cli-docs';
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  commitSha?: string;
}

const EMPTY_MANIFEST: DocManifest = {
  revision: 'unknown',
  generatedAt: new Date(0).toISOString(),
  commands: [],
  totalCount: 0,
};

export class DocsService {
  private manifestCache: CacheEntry<DocManifest> | null = null;
  private manifestPromise: Promise<DocManifest> | null = null;
  private latestCommitSha: string | null = null;
  private lastCommitCheckTime = 0;
  private commitCheckPromise: Promise<boolean> | null = null;

  constructor() {
    this.cleanLegacyCaches();
  }

  private isEntryFresh(entry: CacheEntry<DocManifest>, now: number): boolean {
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
            (k.startsWith('podman_doc_') ||
              k.startsWith('podman_docs_') ||
              k.startsWith('podman_v5_') ||
              k.startsWith('podman_v6_'))
          ) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => store.removeItem(k));
      }
      const savedSha = this.getStorage()?.getItem('podman_v8_latest_sha');
      if (savedSha) {
        this.latestCommitSha = savedSha;
      }
    } catch {
      // Storage access blocked
    }
  }

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
        if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
          const staticRes = await fetch(`${STATIC_DOCS_BASE}/manifest.json`, { cache: 'no-cache' });
          if (staticRes.ok) {
            const staticManifest: DocManifest = await staticRes.json();
            if (staticManifest && staticManifest.revision) {
              detectedSha = staticManifest.generatorVersion
                ? `${staticManifest.revision}:${staticManifest.generatorVersion}`
                : staticManifest.revision;
            }
          }
        }
      } catch {
        // Keep cached data
      }

      if (detectedSha && this.latestCommitSha && detectedSha !== this.latestCommitSha) {
        this.invalidateAllCaches(detectedSha);
        return true;
      }

      if (detectedSha && !this.latestCommitSha) {
        this.latestCommitSha = detectedSha;
        try {
          this.getStorage()?.setItem('podman_v8_latest_sha', detectedSha);
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

  public invalidateAllCaches(newSha?: string): void {
    this.manifestCache = null;
    if (newSha) this.latestCommitSha = newSha;

    if (typeof window !== 'undefined') {
      try {
        const storage = this.getStorage();
        if (storage) {
          const keysToRemove: string[] = [];
          for (let i = 0; i < storage.length; i++) {
            const k = storage.key(i);
            if (k && (k.startsWith('podman_v7_') || k.startsWith('podman_v8_')) && k !== 'podman_v8_latest_sha') {
              keysToRemove.push(k);
            }
          }
          keysToRemove.forEach(k => storage.removeItem(k));
          if (newSha) {
            storage.setItem('podman_v8_latest_sha', newSha);
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
        this.getStorage()?.setItem('podman_v8_manifest', JSON.stringify(this.manifestCache));
      } catch {
        // Ignore
      }
    }
  }

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
        const stored = storage.getItem('podman_v8_manifest');
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
        // Continue
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
    if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
      try {
        const staticRes = await fetch(`${STATIC_DOCS_BASE}/manifest.json`, { cache: 'no-cache' });
        if (staticRes.ok) {
          const staticManifest: DocManifest = await staticRes.json();
          if (staticManifest && Array.isArray(staticManifest.commands)) {
            if (staticManifest.revision) {
              const fingerprint = staticManifest.generatorVersion
                ? `${staticManifest.revision}:${staticManifest.generatorVersion}`
                : staticManifest.revision;
              this.latestCommitSha = fingerprint;
              try {
                this.getStorage()?.setItem('podman_v8_latest_sha', fingerprint);
              } catch {
                // Ignore
              }
            }
            this.saveManifestCache(staticManifest);
            return staticManifest;
          }
        }
      } catch {
        // Fall through
      }
    }

    if (this.manifestCache) {
      return this.manifestCache.data;
    }

    this.saveManifestCache(EMPTY_MANIFEST);
    return EMPTY_MANIFEST;
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
        this.getStorage()?.setItem('podman_v8_manifest', JSON.stringify(entry));
        window.dispatchEvent(new CustomEvent('podman-docs-manifest-updated', { detail: manifest }));
      } catch {
        // Storage limit
      }
    }
  }
}

export const docsService = new DocsService();
