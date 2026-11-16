import { PodmanMarkdownPreprocessor } from './podmanMarkdownPreprocessor';
import type { DocManifest, DocContent, DocCategory, DocMetadata, SearchResult } from './docsTypes';

const REPO_OWNER = 'podman-container-tools';
const REPO_NAME = 'podman';
const BRANCH = 'main';
const BASE_MARKDOWN_PATH = 'docs/source/markdown';

const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${BASE_MARKDOWN_PATH}?ref=${BRANCH}`;
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${BASE_MARKDOWN_PATH}`;

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
  private memoryDocCache: Map<string, DocContent> = new Map();
  private manifestCache: DocManifest | null = null;
  private optionsCache: Map<string, string> = new Map();

  constructor() {
    this.preprocessor = new PodmanMarkdownPreprocessor(this.optionsCache);
  }

  /**
   * Fetches the complete manifest of available Podman CLI documentation.
   */
  public async getManifest(forceRefresh = false): Promise<DocManifest> {
    if (this.manifestCache && !forceRefresh) {
      return this.manifestCache;
    }

    // Try reading from sessionStorage
    if (typeof window !== 'undefined' && !forceRefresh) {
      try {
        const cached = window.sessionStorage.getItem('podman_docs_manifest');
        if (cached) {
          const parsed: DocManifest = JSON.parse(cached);
          this.manifestCache = parsed;
          return parsed;
        }
      } catch {
        // Ignore storage errors
      }
    }

    try {
      const response = await fetch(GITHUB_API_URL, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
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

      // Group into categories
      const manifest = this.buildManifestStructure(metadataList, aliases);

      this.manifestCache = manifest;
      if (typeof window !== 'undefined') {
        try {
          window.sessionStorage.setItem('podman_docs_manifest', JSON.stringify(manifest));
        } catch {
          // Ignore storage overflow
        }
      }

      return manifest;
    } catch {
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
      this.manifestCache = manifest;
      return manifest;
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
      revision: 'main',
      generatedAt: new Date().toISOString(),
      categories,
      aliases,
      totalCount: items.length,
    };
  }

  /**
   * Fetches and pre-processes a specific documentation file by slug.
   */
  public async getDocument(slug: string): Promise<DocContent> {
    const cacheKey = slug.toLowerCase();
    if (this.memoryDocCache.has(cacheKey)) {
      return this.memoryDocCache.get(cacheKey)!;
    }

    // Try reading from sessionStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = window.sessionStorage.getItem(`podman_doc_${cacheKey}`);
        if (stored) {
          const parsed: DocContent = JSON.parse(stored);
          this.memoryDocCache.set(cacheKey, parsed);
          return parsed;
        }
      } catch {
        // Continue to fetch
      }
    }

    // Ensure manifest is loaded to find the filename
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
      // Default to trying .1.md or .1.md.in
      filename = `${slug}.1.md`;
    }

    let rawMarkdown = '';
    let usedFilename = filename;

    try {
      const rawRes = await fetch(`${GITHUB_RAW_BASE}/${filename}`);
      if (!rawRes.ok && filename.endsWith('.md')) {
        // Try .md.in
        const inRes = await fetch(`${GITHUB_RAW_BASE}/${filename}.in`);
        if (inRes.ok) {
          rawMarkdown = await inRes.text();
          usedFilename = `${filename}.in`;
        } else {
          throw new Error(`Document ${slug} not found`);
        }
      } else if (!rawRes.ok && filename.endsWith('.md.in')) {
        // Try removing .in
        const mdRes = await fetch(`${GITHUB_RAW_BASE}/${filename.replace(/\.in$/, '')}`);
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
      // Fallback dummy content
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
              const res = await fetch(`${GITHUB_RAW_BASE}/options/${optKey}`);
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

    this.memoryDocCache.set(cacheKey, processed);
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem(`podman_doc_${cacheKey}`, JSON.stringify(processed));
      } catch {
        // Ignore storage limit
      }
    }

    return processed;
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
