/**
 * Podman Runtime Documentation API Service
 *
 * Standalone Node.js service (zero third-party dependencies, built with node:http).
 * - Periodically detects commit SHA changes from podman-container-tools/podman:main.
 * - Ingests and caches `docs/source/markdown/` and `options/`.
 * - Pre-processes .md.in templates and serves normalized Web Markdown.
 *
 * Run with: node server/docs-api.js
 * Default Port: 3001
 */

const http = require('http');
const https = require('https');
const url = require('url');

const PORT = process.env.PORT || 3001;
const REPO_OWNER = 'podman-container-tools';
const REPO_NAME = 'podman';
const BRANCH = 'main';
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

let cachedManifest = null;
let cachedDocs = new Map();
let cachedOptions = new Map();
let latestCommitSha = '';
let latestCommitEtag = '';
let lastRefreshedAt = null;

function getAuthHeaders(extraHeaders = {}) {
  const base = {
    'User-Agent': 'Podman-Docs-API/1.0',
    ...extraHeaders,
  };
  if (process.env.GITHUB_TOKEN) {
    base['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return base;
}

function fetchUrl(targetUrl, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new url.URL(targetUrl);
    const req = https.get(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        headers: getAuthHeaders(headers),
      },
      res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetchUrl(res.headers.location, headers));
        }
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      },
    );
    req.on('error', reject);
  });
}

async function checkLatestCommitSha() {
  return new Promise(resolve => {
    const targetUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?path=docs/source/markdown&sha=${BRANCH}&per_page=1`;
    const parsed = new url.URL(targetUrl);
    const headers = getAuthHeaders({ Accept: 'application/vnd.github.v3+json' });
    if (latestCommitEtag) {
      headers['If-None-Match'] = latestCommitEtag;
    }

    const req = https.get(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        headers,
      },
      res => {
        if (res.statusCode === 304) {
          res.resume();
          return resolve(latestCommitSha);
        }
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              if (res.headers.etag) {
                latestCommitEtag = res.headers.etag;
              }
              const parsedData = JSON.parse(data);
              if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0].sha) {
                return resolve(parsedData[0].sha);
              }
            } catch {
              // Ignore parse error
            }
          }
          resolve(null);
        });
      },
    );
    req.on('error', err => {
      console.warn('[Docs-API] Could not check commit SHA:', err.message);
      resolve(null);
    });
  });
}

function categorizeCommand(title, section) {
  if (section === '5') return 'Quadlet & Systemd (Section 5)';
  if (section === '7') return 'Guides & Troubleshooting (Section 7)';

  const lower = title.toLowerCase();
  if (lower === 'podman' || lower === 'podman-remote' || lower === 'podman-help' || lower === 'podman-version') {
    return 'Core CLI';
  }
  if (lower.startsWith('podman-pod') || lower.startsWith('podman-kube') || lower === 'podman-play-kube') {
    return 'Pods & Kubernetes';
  }
  if (
    lower.startsWith('podman-image') ||
    lower.startsWith('podman-manifest') ||
    [
      'podman-build',
      'podman-pull',
      'podman-push',
      'podman-images',
      'podman-rmi',
      'podman-tag',
      'podman-untag',
      'podman-save',
      'podman-load',
      'podman-import',
      'podman-history',
      'podman-search',
    ].includes(lower)
  ) {
    return 'Images';
  }
  if (lower.startsWith('podman-network') || lower.startsWith('podman-volume')) {
    return 'Networks & Volumes';
  }
  if (
    lower.startsWith('podman-system') ||
    lower.startsWith('podman-machine') ||
    lower.startsWith('podman-secret') ||
    lower.startsWith('podman-farm') ||
    lower.startsWith('podman-artifact') ||
    [
      'podman-info',
      'podman-events',
      'podman-login',
      'podman-logout',
      'podman-completion',
      'podman-auto-update',
      'podman-generate',
      'podman-healthcheck',
    ].includes(lower)
  ) {
    return 'System & Machine';
  }
  if (
    lower.startsWith('podman-container') ||
    [
      'podman-run',
      'podman-exec',
      'podman-ps',
      'podman-start',
      'podman-stop',
      'podman-restart',
      'podman-rm',
      'podman-kill',
      'podman-logs',
      'podman-inspect',
      'podman-top',
      'podman-stats',
      'podman-cp',
      'podman-attach',
      'podman-commit',
      'podman-create',
      'podman-diff',
      'podman-export',
      'podman-init',
      'podman-mount',
      'podman-unmount',
      'podman-pause',
      'podman-unpause',
      'podman-port',
      'podman-rename',
      'podman-update',
      'podman-wait',
    ].includes(lower)
  ) {
    return 'Containers';
  }
  return 'Other Commands';
}

function buildCategories(items) {
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
  const categoryMap = new Map();
  for (const cat of categoryOrder) {
    categoryMap.set(cat, []);
  }
  for (const item of items) {
    const list = categoryMap.get(item.category) || [];
    list.push(item);
    categoryMap.set(item.category, list);
  }
  const categories = [];
  for (const name of categoryOrder) {
    const list = categoryMap.get(name) || [];
    if (list.length > 0) {
      list.sort((a, b) => a.title.localeCompare(b.title));
      categories.push({
        id: name.toLowerCase().replace(/[^\w]/g, '-'),
        name,
        items: list,
      });
    }
  }
  return categories;
}

async function refreshCache() {
  console.log('[Docs-API] Refreshing documentation cache...');
  try {
    const sha = await checkLatestCommitSha();
    if (sha) latestCommitSha = sha;
    const ref = latestCommitSha || BRANCH;

    // 1. Fetch options directory
    const optionsRaw = await fetchUrl(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/docs/source/markdown/options?ref=${ref}`,
    );
    const optionItems = JSON.parse(optionsRaw);
    for (const item of optionItems) {
      if (item.type === 'file' && item.name.endsWith('.md')) {
        try {
          const optContent = await fetchUrl(item.download_url);
          cachedOptions.set(item.name, optContent);
        } catch {
          // Continue
        }
      }
    }
    console.log(`[Docs-API] Cached ${cachedOptions.size} option snippets.`);

    // 2. Fetch markdown files listing
    const mdRaw = await fetchUrl(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/docs/source/markdown?ref=${ref}`,
    );
    const items = JSON.parse(mdRaw);
    const docs = items.filter(i => i.type === 'file' && (i.name.endsWith('.md') || i.name.endsWith('.md.in')));

    const manifestItems = [];
    for (const doc of docs) {
      if (doc.name === 'README.md' || doc.name === '.gitignore') continue;
      const cleanSlug = doc.name.replace(/\.(1|5|7)(\.md|\.md\.in)?$/, '');
      let section = '1';
      const secMatch = doc.name.match(/\.(1|5|7)(?:\.md|\.md\.in)?$/);
      if (secMatch) section = secMatch[1];

      const category = categorizeCommand(cleanSlug, section);
      manifestItems.push({
        slug: cleanSlug,
        title: cleanSlug,
        section,
        description: `Podman CLI reference documentation for ${cleanSlug}`,
        filename: doc.name,
        category,
        isTemplate: doc.name.endsWith('.md.in'),
        downloadUrl: doc.download_url,
      });
    }

    cachedManifest = {
      revision: latestCommitSha || 'main',
      generatedAt: new Date().toISOString(),
      categories: buildCategories(manifestItems),
      aliases: {},
      totalCount: manifestItems.length,
      total: manifestItems.length,
      items: manifestItems,
    };
    lastRefreshedAt = new Date().toISOString();
    console.log(`[Docs-API] Successfully cached manifest with ${manifestItems.length} documents.`);
  } catch (err) {
    console.error('[Docs-API] Cache refresh failed:', err.message);
  }
}

function deriveSubcommand(filename, full = false) {
  let name = filename.replace(/\.(1|5|7)(\.md|\.md\.in)?$/, '');
  if (!full && name.startsWith('podman-pod-')) {
    name = name.slice('podman-pod-'.length);
  } else if (name.startsWith('podman-')) {
    name = name.slice('podman-'.length);
  }
  return name.replace(/-/g, ' ');
}

function renderConditionals(text, context) {
  const ifRegex = /<<\s*if\s+(not\s+)?([a-zA-Z0-9_]+)\s*>>([\s\S]*?)<<\s*endif\s*>>/g;
  return text.replace(ifRegex, (_, notToken, varName, body) => {
    const isNot = Boolean(notToken);
    const val = Boolean(context[varName]);
    const condition = isNot ? !val : val;
    const elseParts = body.split(/<<\s*else\s*>>/);
    return condition ? elseParts[0] || '' : elseParts[1] || '';
  });
}

function preprocessMarkdown(filename, rawContent) {
  const isPod = filename.includes('-pod-') || filename.includes('-kube-');
  const isQuadlet = filename.endsWith('.unit.5.md.in') || filename.endsWith('.unit.5.md');

  let content = rawContent;
  let title = filename.replace(/\.(1|5|7)(\.md|\.md\.in)?$/, '');
  let section = '1';

  const headerMatch = content.match(/^%\s+([^\s]+)\s+(\d+)/m);
  if (headerMatch) {
    title = headerMatch[1].replace(/\\-/g, '-');
    section = headerMatch[2];
    content = content.replace(/^%[^\n]*\n+/m, '');
  }

  let description = '';
  const nameMatch = content.match(/(?:##\s*NAME|(?:\r?\n|^)NAME\r?\n[=-]+)\s*\r?\n+([^\r\n]+)/i);
  if (nameMatch) {
    const rawNameLine = nameMatch[1].replace(/\\-/g, '-').trim();
    const parts = rawNameLine.split(/\s+-\s+/);
    description = parts.length > 1 ? parts.slice(1).join(' - ').trim() : rawNameLine;
    content = content.replace(/(?:##\s*NAME|(?:\r?\n|^)NAME\r?\n[=-]+)\s*\r?\n+[^\r\n]+\r?\n*/i, '');
  }

  // Convert setext headings to ATX
  content = content.replace(/^([A-Z0-9_ -]+)\r?\n([=-]{3,})\s*$/gm, (_, headingText) => {
    return `\n## ${headingText.trim()}\n\n`;
  });

  // Ensure tables have blank lines before and after
  content = content.replace(/(^[^|\r\n][^\r\n]*)\r?\n(\|[^\r\n]+\|)/gm, '$1\n\n$2');
  content = content.replace(/(\|[^\r\n]+\|)\r?\n([^|\r\n])/gm, '$1\n\n$2');

  // Resolve conditional blocks
  content = renderConditionals(content, { is_quadlet: isQuadlet });

  // Expand @@option
  content = content.replace(/^@@option\s+([^\s\n]+)/gm, (_, optName) => {
    const key = optName.endsWith('.md') ? optName : `${optName}.md`;
    const snippet = cachedOptions.get(key) || '';
    if (!snippet) return `<!-- Option [${optName}] included at build time -->`;
    return snippet.replace(/^####>[^\n]*\n?/gm, '').trim();
  });

  // Resolve <<pod|container>>
  content = content.replace(/<<([^|>]*)\|([^|>]*)>>/g, (_, podPart, containerPart) => {
    return isPod ? podPart : containerPart;
  });

  // Resolve <<subcommand>> and <<fullsubcommand>>
  content = content.replace(/<<subcommand>>/g, deriveSubcommand(filename, false));
  content = content.replace(/<<fullsubcommand>>/g, deriveSubcommand(filename, true));

  // Rewrite links
  content = content.replace(
    /\[([^\]]+)\]\(([^)]*?)(podman-[a-zA-Z0-9_.-]+)\.(1|5|7)(?:\.md|\.md\.in)?(?:#([a-zA-Z0-9_-]+))?\)/g,
    (_, text, _p, target, _s, anchor) => {
      const a = anchor ? `#${anchor}` : '';
      return `[${text}](/docs/commands?cmd=${target}${a})`;
    },
  );
  content = content.replace(
    /\[([^\]]+)\]\(([^)]*?)podman\.(1|5|7)(?:\.md|\.md\.in)?(?:#([a-zA-Z0-9_-]+))?\)/g,
    (_, text, _p, _s, anchor) => {
      const a = anchor ? `#${anchor}` : '';
      return `[${text}](/docs/commands?cmd=podman${a})`;
    },
  );

  return {
    title,
    section,
    description: description || `Podman CLI reference documentation for ${title}`,
    filename,
    markdown: content,
  };
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health
  if (pathname === '/api/docs/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'ok',
        commitSha: latestCommitSha,
        lastRefreshedAt,
        cachedDocsCount: cachedDocs.size,
      }),
    );
    return;
  }

  // Manifest
  if (pathname === '/api/docs/manifest') {
    if (!cachedManifest) {
      await refreshCache();
    }
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    });
    res.end(JSON.stringify(cachedManifest));
    return;
  }

  // Content
  if (pathname === '/api/docs/content') {
    const slug = (parsedUrl.query.slug || '').toLowerCase();
    if (!slug) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing slug parameter' }));
      return;
    }

    if (cachedDocs.has(slug)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(cachedDocs.get(slug)));
      return;
    }

    try {
      if (!cachedManifest) {
        await refreshCache();
      }

      // Look up slug in cachedManifest to find the exact recorded filename and section
      let targetDoc = null;
      if (cachedManifest && cachedManifest.items) {
        targetDoc = cachedManifest.items.find(i => i.slug.toLowerCase() === slug);
      }

      let rawText = '';
      let usedFilename = targetDoc ? targetDoc.filename : null;
      const ref = latestCommitSha || BRANCH;

      if (targetDoc && targetDoc.downloadUrl) {
        rawText = await fetchUrl(targetDoc.downloadUrl);
      } else if (usedFilename) {
        rawText = await fetchUrl(
          `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${ref}/docs/source/markdown/${usedFilename}`,
        );
      } else {
        // Fallback across all possible section extensions (1, 5, 7) and .in templates
        const candidateFiles = [
          `${slug}.1.md`,
          `${slug}.1.md.in`,
          `${slug}.5.md`,
          `${slug}.5.md.in`,
          `${slug}.7.md`,
          `${slug}.7.md.in`,
        ];
        let found = false;
        for (const candidate of candidateFiles) {
          try {
            rawText = await fetchUrl(
              `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${ref}/docs/source/markdown/${candidate}`,
            );
            usedFilename = candidate;
            found = true;
            break;
          } catch {
            // try next candidate
          }
        }
        if (!found) {
          throw new Error(`Document ${slug} not found`);
        }
      }

      const processed = preprocessMarkdown(usedFilename, rawText);
      const payload = {
        slug,
        title: processed.title,
        section: processed.section,
        description: processed.description,
        filename: processed.filename || usedFilename,
        markdown: processed.markdown,
        cachedAt: new Date().toISOString(),
      };
      cachedDocs.set(slug, payload);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(payload));
    } catch (err) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Document ${slug} not found` }));
    }
    return;
  }

  // Search
  if (pathname === '/api/docs/search') {
    const q = (parsedUrl.query.q || '').toLowerCase().trim();
    if (!cachedManifest) {
      await refreshCache();
    }
    const matches = (cachedManifest?.items || []).filter(i => i.slug.includes(q));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(matches));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

// Periodic background sync
setInterval(async () => {
  const sha = await checkLatestCommitSha();
  if (sha && sha !== latestCommitSha) {
    console.log(`[Docs-API] Detected new commit ${sha} (was ${latestCommitSha}). Refreshing...`);
    latestCommitSha = sha;
    cachedDocs.clear();
    await refreshCache();
  }
}, REFRESH_INTERVAL_MS);

server.listen(PORT, () => {
  console.log(`[Docs-API] Podman Documentation API running on http://localhost:${PORT}`);
  refreshCache();
});
