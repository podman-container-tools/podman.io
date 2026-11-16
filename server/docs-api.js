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
let lastRefreshedAt = null;

function fetchUrl(targetUrl, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new url.URL(targetUrl);
    const req = https.get(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        headers: {
          'User-Agent': 'Podman-Docs-API/1.0',
          ...headers,
        },
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
  try {
    const raw = await fetchUrl(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits/${BRANCH}`);
    const data = JSON.parse(raw);
    return data.sha;
  } catch (err) {
    console.warn('[Docs-API] Could not check commit SHA:', err.message);
    return null;
  }
}

async function refreshCache() {
  console.log('[Docs-API] Refreshing documentation cache...');
  try {
    // 1. Fetch options directory
    const optionsRaw = await fetchUrl(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/docs/source/markdown/options?ref=${BRANCH}`,
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
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/docs/source/markdown?ref=${BRANCH}`,
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

      manifestItems.push({
        slug: cleanSlug,
        title: cleanSlug,
        section,
        filename: doc.name,
        downloadUrl: doc.download_url,
      });
    }

    cachedManifest = {
      revision: latestCommitSha || 'main',
      generatedAt: new Date().toISOString(),
      total: manifestItems.length,
      items: manifestItems,
    };
    lastRefreshedAt = new Date().toISOString();
    console.log(`[Docs-API] Successfully cached manifest with ${manifestItems.length} documents.`);
  } catch (err) {
    console.error('[Docs-API] Cache refresh failed:', err.message);
  }
}

function preprocessMarkdown(filename, rawContent) {
  let content = rawContent;
  let title = filename.replace(/\.(1|5|7)(\.md|\.md\.in)?$/, '');
  let section = '1';

  const headerMatch = content.match(/^%\s+([^\s]+)\s+(\d+)/m);
  if (headerMatch) {
    title = headerMatch[1].replace(/\\-/g, '-');
    section = headerMatch[2];
    content = content.replace(/^%[^\n]*\n+/m, '');
  }

  // Expand @@option
  content = content.replace(/^@@option\s+([^\s\n]+)/gm, (_, optName) => {
    const key = optName.endsWith('.md') ? optName : `${optName}.md`;
    const snippet = cachedOptions.get(key) || '';
    return snippet.replace(/^####>[^\n]*\n?/gm, '').trim();
  });

  // Resolve <<pod|container>>
  const isPod = filename.includes('-pod-') || filename.includes('-kube-');
  content = content.replace(/<<([^|>]*)\|([^|>]*)>>/g, (_, podPart, containerPart) => {
    return isPod ? podPart : containerPart;
  });

  // Rewrite links
  content = content.replace(
    /\[([^\]]+)\]\(([^)]*?)(podman-[a-zA-Z0-9_.-]+)\.(1|5|7)(?:\.md|\.md\.in)?(?:#([a-zA-Z0-9_-]+))?\)/g,
    (_, text, _p, target, _s, anchor) => {
      const a = anchor ? `#${anchor}` : '';
      return `[${text}](/docs/commands?cmd=${target}${a})`;
    },
  );

  return { title, section, markdown: content };
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
      const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/docs/source/markdown/${slug}.1.md`;
      let rawText;
      let usedFilename = `${slug}.1.md`;
      try {
        rawText = await fetchUrl(rawUrl);
      } catch {
        const inUrl = `${rawUrl}.in`;
        rawText = await fetchUrl(inUrl);
        usedFilename = `${slug}.1.md.in`;
      }

      const processed = preprocessMarkdown(usedFilename, rawText);
      const payload = {
        slug,
        title: processed.title,
        section: processed.section,
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
