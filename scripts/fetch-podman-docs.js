/**
 * Build-time Podman CLI Documentation Fetcher & Docusaurus Markdown Generator
 *
 * Fetches canonical Markdown from `podman-container-tools/podman` (`docs/source/markdown`)
 * at a pinned commit SHA (`.podman-docs-revision` or `PODMAN_DOCS_REF`) — or consumes a
 * pre-processed markdown directory via `PODMAN_DOCS_DIR` / `PODMAN_DOCS_ARTIFACT_DIR` —
 * and outputs Docusaurus-ready `.md` files into `docs/commands/` along with the command
 * tree manifest in `static/data/cli-docs/manifest.json`.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const GENERATOR_VERSION = crypto.createHash('sha256').update(fs.readFileSync(__filename)).digest('hex').slice(0, 12);

const REPO_URL = 'https://github.com/podman-container-tools/podman.git';
const MARKDOWN_SUBPATH = 'docs/source/markdown';
const ROOT_DIR = path.resolve(__dirname, '..');
const REVISION_FILE = path.join(ROOT_DIR, '.podman-docs-revision');
const OUTPUT_DIR = path.join(ROOT_DIR, 'static', 'data', 'cli-docs');
const DOCS_COMMANDS_DIR = path.join(ROOT_DIR, 'docs', 'commands');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest.json');

const ALLOWED_HTML_TAGS = new Set([
  'a',
  'sup',
  'sub',
  'br',
  'hr',
  'kbd',
  'code',
  'pre',
  'em',
  'strong',
  'b',
  'i',
  'u',
  's',
  'span',
  'div',
  'p',
  'ul',
  'ol',
  'li',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'details',
  'summary',
]);

const TOP_LEVEL_COMMAND_CATEGORIES = [
  'podman',
  'podmansh',
  'podman-artifact',
  'podman-container',
  'podman-farm',
  'podman-generate',
  'podman-healthcheck',
  'podman-image',
  'podman-kube',
  'podman-machine',
  'podman-machine-os',
  'podman-manifest',
  'podman-network',
  'podman-pod',
  'podman-quadlet',
  'podman-secret',
  'podman-system',
  'podman-volume',
];

const LOGICAL_PARENT_SUBCOMMANDS = {
  'podman-container': [
    { slug: 'podman-attach', label: 'attach' },
    { slug: 'podman-commit', label: 'commit' },
    { slug: 'podman-cp', label: 'cp' },
    { slug: 'podman-create', label: 'create' },
    { slug: 'podman-exec', label: 'exec' },
    { slug: 'podman-export', label: 'export' },
    { slug: 'podman-init', label: 'init' },
    { slug: 'podman-kill', label: 'kill' },
    { slug: 'podman-logs', label: 'logs' },
    { slug: 'podman-mount', label: 'mount' },
    { slug: 'podman-pause', label: 'pause' },
    { slug: 'podman-port', label: 'port' },
    { slug: 'podman-ps', label: 'ps' },
    { slug: 'podman-rename', label: 'rename' },
    { slug: 'podman-restart', label: 'restart' },
    { slug: 'podman-rm', label: 'rm' },
    { slug: 'podman-run', label: 'run' },
    { slug: 'podman-start', label: 'start' },
    { slug: 'podman-stats', label: 'stats' },
    { slug: 'podman-stop', label: 'stop' },
    { slug: 'podman-top', label: 'top' },
    { slug: 'podman-unmount', label: 'unmount' },
    { slug: 'podman-unpause', label: 'unpause' },
    { slug: 'podman-update', label: 'update' },
    { slug: 'podman-wait', label: 'wait' },
  ],
  'podman-generate': [{ slug: 'podman-kube-generate', label: 'kube' }],
  'podman-image': [
    { slug: 'podman-build', label: 'build' },
    { slug: 'podman-history', label: 'history' },
    { slug: 'podman-images', label: 'images' },
    { slug: 'podman-import', label: 'import' },
    { slug: 'podman-load', label: 'load' },
    { slug: 'podman-login', label: 'login' },
    { slug: 'podman-logout', label: 'logout' },
    { slug: 'podman-pull', label: 'pull' },
    { slug: 'podman-push', label: 'push' },
    { slug: 'podman-rmi', label: 'rmi' },
    { slug: 'podman-save', label: 'save' },
    { slug: 'podman-search', label: 'search' },
    { slug: 'podman-tag', label: 'tag' },
    { slug: 'podman-untag', label: 'untag' },
  ],
  'podman-kube': [{ slug: 'podman-compose', label: 'compose' }],
  'podman-system': [
    { slug: 'podman-auto-update', label: 'auto update' },
    { slug: 'podman-completion', label: 'completion' },
    { slug: 'podman-diff', label: 'diff' },
    { slug: 'podman-events', label: 'events' },
    { slug: 'podman-info', label: 'info' },
    { slug: 'podman-inspect', label: 'inspect' },
    { slug: 'podman-remote', label: 'remote' },
    { slug: 'podman-rootless', label: 'rootless' },
    { slug: 'podman-troubleshooting', label: 'troubleshooting' },
    { slug: 'podman-unshare', label: 'unshare' },
    { slug: 'podman-version', label: 'version' },
  ],
};

function formatCommandLabel(slug, parentSlug = '') {
  const rawSlug = String(slug || '');
  if (rawSlug.toLowerCase() === 'podman') {
    return 'Podman';
  }
  const rawParent = String(parentSlug || '');
  if (rawParent && rawSlug.toLowerCase().startsWith(`${rawParent.toLowerCase()}-`)) {
    return rawSlug.slice(rawParent.length + 1).replace(/-/g, ' ');
  }
  return rawSlug.replace(/^podman-/i, '').replace(/-/g, ' ');
}

function buildCommandHierarchy(items) {
  const bySlug = new Map();
  for (const item of items) {
    bySlug.set(item.slug.toLowerCase(), item);
  }

  const topLevelSet = new Set(TOP_LEVEL_COMMAND_CATEGORIES);
  for (const item of items) {
    const slug = item.slug.toLowerCase();
    if (slug.startsWith('podman-') && slug.split('-').length === 2) {
      const hasPrefixChildren = items.some(other => {
        const otherSlug = other.slug.toLowerCase();
        return otherSlug !== slug && otherSlug.startsWith(`${slug}-`);
      });
      if (hasPrefixChildren) {
        topLevelSet.add(slug);
      }
    }
  }

  const childrenByParent = new Map();
  const claimedSlugs = new Set();

  const addChild = (parentSlug, item, customLabel) => {
    const list = childrenByParent.get(parentSlug) || [];
    const itemKey = item.slug.toLowerCase();
    if (!list.some(entry => entry.item.slug.toLowerCase() === itemKey)) {
      list.push({
        item,
        label: customLabel || formatCommandLabel(item.slug, parentSlug),
      });
      childrenByParent.set(parentSlug, list);
    }
    claimedSlugs.add(itemKey);
  };

  for (const item of items) {
    const slug = item.slug.toLowerCase();
    if (topLevelSet.has(slug)) {
      continue;
    }

    if (slug.startsWith('podman-machine-os-') && bySlug.has('podman-machine-os')) {
      addChild('podman-machine-os', item);
      continue;
    }

    if ((slug.endsWith('.unit') || slug.startsWith('podman-quadlet-')) && bySlug.has('podman-quadlet')) {
      const label =
        slug === 'podman-quadlet-basic-usage'
          ? 'basic usage'
          : slug.endsWith('.unit')
            ? formatCommandLabel(item.slug)
            : formatCommandLabel(item.slug, 'podman-quadlet');
      addChild('podman-quadlet', item, label);
      continue;
    }

    if (slug.startsWith('podman-')) {
      const parts = slug.split('-');
      if (parts.length >= 3) {
        const candidateParent = `${parts[0]}-${parts[1]}`;
        if (candidateParent !== slug && topLevelSet.has(candidateParent) && bySlug.has(candidateParent)) {
          addChild(candidateParent, item);
          continue;
        }
      }
    }

    if (String(item.section) === '7' && bySlug.has('podman-system')) {
      addChild('podman-system', item, formatCommandLabel(item.slug));
    }
  }

  for (const [parentSlug, extras] of Object.entries(LOGICAL_PARENT_SUBCOMMANDS)) {
    if (!bySlug.has(parentSlug)) continue;
    for (const extra of extras) {
      const target = bySlug.get(extra.slug.toLowerCase());
      if (target) {
        addChild(parentSlug, target, extra.label);
      }
    }
  }

  for (const item of items) {
    const slug = item.slug.toLowerCase();
    if (!topLevelSet.has(slug) && !claimedSlugs.has(slug)) {
      topLevelSet.add(slug);
    }
  }

  const topLevelSlugs = Array.from(topLevelSet).filter(slug => bySlug.has(slug));
  topLevelSlugs.sort((a, b) => {
    if (a === 'podman') return -1;
    if (b === 'podman') return 1;
    if (a === 'podmansh') return -1;
    if (b === 'podmansh') return 1;
    return a.localeCompare(b);
  });

  return topLevelSlugs.map(slug => {
    const parent = bySlug.get(slug);
    const parentKey = parent.slug.toLowerCase();
    const rawChildren = childrenByParent.get(parentKey) || [];
    rawChildren.sort((a, b) => a.label.localeCompare(b.label));

    const subcommands = rawChildren.map(({ item: child, label }) => ({
      slug: child.slug,
      title: child.title,
      label,
      section: child.section,
      description: child.description,
      filename: child.filename,
      subcommands: [],
    }));

    return {
      slug: parent.slug,
      title: parent.title,
      label: formatCommandLabel(parent.slug),
      section: parent.section,
      description: parent.description,
      filename: parent.filename,
      subcommands,
    };
  });
}

function assertSafeGitRef(ref) {
  if (!ref || ref.startsWith('-') || ref.includes('..') || !/^[A-Za-z0-9._/-]+$/.test(ref)) {
    throw new Error(`Invalid or unsafe git revision: "${ref}"`);
  }
  return ref;
}

function resolveTargetRevision() {
  if (process.env.PODMAN_DOCS_REF && process.env.PODMAN_DOCS_REF.trim()) {
    return assertSafeGitRef(process.env.PODMAN_DOCS_REF.trim());
  }
  if (fs.existsSync(REVISION_FILE)) {
    const rev = fs.readFileSync(REVISION_FILE, 'utf8').trim();
    if (rev) return assertSafeGitRef(rev);
  }
  try {
    const out = execFileSync('git', ['ls-remote', REPO_URL, 'refs/heads/main'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const sha = out.split(/\s+/)[0];
    if (sha) return assertSafeGitRef(sha);
  } catch {
    // Fallback to branch name
  }
  return 'main';
}

function deriveSlug(filename) {
  return filename
    .replace(/\.(1|5|7)\.md\.in$/, '')
    .replace(/\.(1|5|7)\.md$/, '')
    .replace(/\.md\.in$/, '')
    .replace(/\.md$/, '');
}

function resolveSubcommandName(filename) {
  let base = filename
    .replace(/\.(1|5|7)\.md\.in$/, '')
    .replace(/\.(1|5|7)\.md$/, '')
    .replace(/\.md\.in$/, '')
    .replace(/\.md$/, '');
  base = base.replace(/^podman-/, '');
  const parts = base.split('-');
  return parts[parts.length - 1] || base;
}

function evaluateCondition(expr, isQuadlet) {
  const clean = expr.trim();
  if (clean === 'is_quadlet') return isQuadlet;
  if (clean === 'not is_quadlet' || clean === '!is_quadlet') return !isQuadlet;
  return !isQuadlet;
}

function processConditionals(text, isQuadlet) {
  let prev = '';
  let current = text;
  const blockRegex = /<<\s*if\s+([^>]+?)>>([\s\S]*?)(?:<<\s*else\s*>>([\s\S]*?))?<<\s*endif\s*>>/g;

  while (current !== prev) {
    prev = current;
    current = current.replace(blockRegex, (_, conditionExpr, ifBody, elseBody) => {
      const cond = evaluateCondition(conditionExpr, isQuadlet);
      return cond ? ifBody : elseBody !== undefined ? elseBody : '';
    });
  }

  const inlineTernaryRegex = /<<\s*(['"])([\s\S]*?)\1\s+if\s+([^>]+?)\s+else\s+(['"])([\s\S]*?)\4\s*>>/g;
  current = current.replace(inlineTernaryRegex, (_, _q1, trueVal, condExpr, _q2, falseVal) => {
    return evaluateCondition(condExpr, isQuadlet) ? trueVal : falseVal;
  });

  return current;
}

function sanitizeForDocusaurusMDX(markdown) {
  const lines = markdown.split(/\r?\n/);
  let inFence = false;

  return lines
    .map(line => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence || /^(\t| {4})/.test(line)) {
        return line;
      }

      return line
        .split(/(`+[^`]*`+)/g)
        .map(part => {
          if (part.startsWith('`')) return part;
          return part.replace(/\\?<(\/?[a-zA-Z][^>\n]*)\\?>/g, (match, inner) => {
            const tagName = inner
              .replace(/^\//, '')
              .split(/[\s/>]/)[0]
              .toLowerCase();
            if (!match.startsWith('\\') && ALLOWED_HTML_TAGS.has(tagName) && !inner.includes('|')) {
              return match;
            }
            const cleanInner = inner.replace(/\\$/, '');
            return `\`<${cleanInner}>\``;
          });
        })
        .join('');
    })
    .join('\n');
}

function cleanSynopsisLine(raw) {
  return raw
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\\\[/g, '[')
    .replace(/\\\]/g, ']')
    .replace(/\s+/g, ' ')
    .trim();
}

function wrapSynopsisCard(markdown, metadata) {
  return markdown.replace(/(##\s+SYNOPSIS\r?\n+)([\s\S]*?)(\r?\n+##\s+)/, (match, _heading, body, nextHeading) => {
    const trimmed = body.trim();
    if (!trimmed || trimmed.includes('### ') || trimmed.includes('doc-synopsis-table')) {
      return match;
    }

    const lines = trimmed
      .split(/\r?\n+/)
      .map(s => cleanSynopsisLine(s))
      .filter(Boolean);

    if (lines.length === 0) {
      return match;
    }

    const primarySynopsis = lines[0];
    const aliasItems = lines.slice(1);
    const descriptionText = (metadata && metadata.description) || '';

    const rows = [];
    if (descriptionText) {
      rows.push(
        `    <tr>\n      <th className="doc-synopsis-label">Description</th>\n      <td className="doc-synopsis-value">${descriptionText}</td>\n    </tr>`,
      );
    }

    rows.push(
      `    <tr>\n      <th className="doc-synopsis-label">Synopsis</th>\n      <td className="doc-synopsis-value"><code className="doc-synopsis-pill">${primarySynopsis}</code></td>\n    </tr>`,
    );

    if (aliasItems.length > 0) {
      const aliasPills = aliasItems.map(a => `<code className="doc-synopsis-pill">${a}</code>`).join(' ');
      rows.push(
        `    <tr>\n      <th className="doc-synopsis-label">Aliases</th>\n      <td className="doc-synopsis-value"><div className="doc-synopsis-aliases">${aliasPills}</div></td>\n    </tr>`,
      );
    }

    return `<table className="doc-synopsis-table">\n  <tbody>\n${rows.join('\n')}\n  </tbody>\n</table>\n${nextHeading}`;
  });
}

function buildDocusaurusMarkdownFile(docContent) {
  const { metadata, markdown } = docContent;
  const sanitizedBody = wrapSynopsisCard(sanitizeForDocusaurusMDX(markdown), metadata);
  const frontmatter = [
    '---',
    `id: ${JSON.stringify(metadata.slug)}`,
    `title: ${JSON.stringify(metadata.title)}`,
    `description: ${JSON.stringify(metadata.description)}`,
    `slug: ${JSON.stringify(`/commands/${metadata.slug}`)}`,
    'displayed_sidebar: "docsSidebar"',
    'custom_edit_url: null',
    '---',
    '',
  ].join('\n');

  return `${frontmatter}${sanitizedBody}\n`;
}

function preprocessMarkdown(filename, rawContent, optionsMap, revision, knownSlugs) {
  const isPod = filename.includes('-pod-') || filename.includes('-kube-');
  const isQuadlet = filename.endsWith('.unit.5.md.in') || filename.endsWith('.unit.5.md');

  let content = rawContent;
  let title = filename.replace(/\.(1|5|7)(\.md|\.md\.in)?$/, '');
  let section = '1';
  const secMatch = filename.match(/\.(1|5|7)(?:\.md|\.md\.in)?$/);
  if (secMatch) section = secMatch[1];

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

  content = content.replace(/^([A-Z0-9_ -]+)\r?\n([=-]{3,})\s*$/gm, (_, headingText) => {
    return `\n## ${headingText.trim()}\n\n`;
  });

  content = content.replace(/^@@option\s+([^\s\r\n]+)\s*$/gm, (_, optKey) => {
    const cleanKey = optKey.trim();
    const candidates = [
      cleanKey,
      isPod ? `${cleanKey}.pod` : `${cleanKey}.container`,
      `${cleanKey}.container`,
      `${cleanKey}.pod`,
      cleanKey.replace(/\.(container|pod)$/, ''),
    ];

    for (const key of candidates) {
      if (optionsMap.has(key)) {
        return optionsMap.get(key);
      }
    }

    const baseName = cleanKey.split('.')[0];
    return `#### **--${baseName}**\n\n*(Option details inherited from common Podman options)*\n`;
  });

  const subcommandName = resolveSubcommandName(filename);
  content = content.replace(/<<\s*subcommand\s*>>/gi, subcommandName);

  content = processConditionals(content, isQuadlet);

  content = content.replace(/<<\s*([^|>]*?)\s*\|\s*([^>]*?)\s*>>/g, (_, left, right) => {
    const lLower = left.toLowerCase();
    const rLower = right.toLowerCase();
    const leftHasPod = lLower.includes('pod');
    const rightHasPod = rLower.includes('pod');

    if (leftHasPod && !rightHasPod) {
      return isPod ? left : right;
    }
    if (rightHasPod && !leftHasPod) {
      return isPod ? right : left;
    }
    return isPod ? right : left;
  });

  content = content.replace(/\\-/g, '-');
  content = content.replace(/(^[^|\r\n][^\r\n]*)\r?\n(\|[^\r\n]+\|)/gm, '$1\n\n$2');
  content = content.replace(/(\|[^\r\n]+\|)\r?\n([^|\r\n])/gm, '$1\n\n$2');

  content = content.replace(
    /\[([^\]]+)\]\(([^)]*?)(podman-[a-zA-Z0-9_.-]+)\.(1|5|7)(?:\.md|\.md\.in)?(?:#([a-zA-Z0-9_-]+))?\)/g,
    (_, text, _prefix, targetSlug, _sec, hash) => {
      let resolvedSlug = targetSlug;
      if (knownSlugs && !knownSlugs.has(resolvedSlug)) {
        if (resolvedSlug === 'podman-image-pull' && knownSlugs.has('podman-pull')) {
          resolvedSlug = 'podman-pull';
        } else {
          return text;
        }
      }
      const hashPart = hash ? `#${hash}` : '';
      return `[${text}](/docs/commands/${resolvedSlug}${hashPart})`;
    },
  );
  content = content.replace(
    /\[([^\]]+)\]\(([^)]*?)podman\.(1|5|7)(?:\.md|\.md\.in)?(?:#([a-zA-Z0-9_-]+))?\)/g,
    (_, text, _prefix, _sec, hash) => {
      const hashPart = hash ? `#${hash}` : '';
      return `[${text}](/docs/commands/podman${hashPart})`;
    },
  );
  content = content.replace(
    /\[([^\]]+)\]\((?:[^)]*?)containers\.conf\.5(?:\.md|\.md\.in)?\)/g,
    '[$1](https://github.com/containers/container-libs/blob/main/common/docs/containers.conf.5.md)',
  );

  const slug = deriveSlug(filename);

  return {
    metadata: {
      slug,
      title,
      section,
      description: description || `Podman CLI reference documentation for ${title}`,
      filename,
    },
    markdown: content,
    revision,
    fetchedAt: new Date().toISOString(),
  };
}

function processMarkdownDirectory(markdownDir, resolvedRevision) {
  const optionsDir = path.join(markdownDir, 'options');
  const optionsMap = new Map();
  if (fs.existsSync(optionsDir)) {
    const optFiles = fs.readdirSync(optionsDir).filter(f => f.endsWith('.md') || f.endsWith('.md.in'));
    for (const optFile of optFiles) {
      const key = optFile.replace(/\.md(\.in)?$/, '');
      optionsMap.set(key, fs.readFileSync(path.join(optionsDir, optFile), 'utf8'));
    }
  }

  const allFiles = fs
    .readdirSync(markdownDir)
    .filter(f => (f.endsWith('.md') || f.endsWith('.md.in')) && fs.statSync(path.join(markdownDir, f)).isFile());

  const fileBySlug = new Map();
  for (const file of allFiles) {
    const slug = deriveSlug(file);
    const existing = fileBySlug.get(slug);
    if (!existing || (existing.endsWith('.md.in') && file.endsWith('.md'))) {
      fileBySlug.set(slug, file);
    }
  }

  const docFiles = Array.from(fileBySlug.values()).sort();
  if (docFiles.length === 0) {
    throw new Error(`No markdown files found in ${markdownDir}`);
  }

  const knownSlugs = new Set(docFiles.map(f => deriveSlug(f)));

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.rmSync(DOCS_COMMANDS_DIR, { recursive: true, force: true });
  fs.mkdirSync(DOCS_COMMANDS_DIR, { recursive: true });

  const allMetadata = [];

  for (const file of docFiles) {
    const rawContent = fs.readFileSync(path.join(markdownDir, file), 'utf8');
    const docContent = preprocessMarkdown(file, rawContent, optionsMap, resolvedRevision, knownSlugs);
    const safeSlug = docContent.metadata.slug.toLowerCase().replace(/[^a-z0-9._-]/g, '-');

    const mdFileContent = buildDocusaurusMarkdownFile(docContent);
    fs.writeFileSync(path.join(DOCS_COMMANDS_DIR, `${safeSlug}.md`), mdFileContent, 'utf8');

    allMetadata.push(docContent.metadata);
  }

  const commandsHierarchy = buildCommandHierarchy(allMetadata);

  const manifest = {
    revision: resolvedRevision,
    generatorVersion: GENERATOR_VERSION,
    generatedAt: new Date().toISOString(),
    commands: commandsHierarchy,
    totalCount: docFiles.length,
  };

  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(
    `[fetch-podman-docs] Generated ${docFiles.length} Docusaurus .md files in docs/commands/ and manifest in static/data/cli-docs/ (revision ${resolvedRevision}).`,
  );
}

function main() {
  const isStrict = process.argv.includes('--strict') || Boolean(process.env.CI);
  const isForce = process.argv.includes('--force');
  const revision = resolveTargetRevision();
  const customDocsDir = process.env.PODMAN_DOCS_DIR || process.env.PODMAN_DOCS_ARTIFACT_DIR;

  if (!isForce && !customDocsDir && fs.existsSync(MANIFEST_PATH) && fs.existsSync(DOCS_COMMANDS_DIR)) {
    try {
      const existing = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
      const mdCount = fs.readdirSync(DOCS_COMMANDS_DIR).filter(f => f.endsWith('.md')).length;
      if (
        existing &&
        existing.revision === revision &&
        existing.generatorVersion === GENERATOR_VERSION &&
        existing.totalCount > 50 &&
        mdCount >= existing.totalCount &&
        Array.isArray(existing.commands) &&
        existing.commands.length > 0
      ) {
        console.log(`[fetch-podman-docs] CLI docs already up to date for revision ${revision} (${mdCount} .md pages).`);
        return;
      }
    } catch {
      // Proceed to fetch
    }
  }

  if (customDocsDir) {
    const resolvedDir = path.resolve(customDocsDir);
    if (!fs.existsSync(resolvedDir)) {
      throw new Error(`PODMAN_DOCS_DIR does not exist: ${resolvedDir}`);
    }
    console.log(`[fetch-podman-docs] Generating Docusaurus docs from local directory: ${resolvedDir}...`);
    processMarkdownDirectory(resolvedDir, revision);
    return;
  }

  console.log(`[fetch-podman-docs] Fetching upstream Podman markdown at revision: ${revision}...`);
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'podman-docs-'));

  try {
    execFileSync('git', ['init'], { cwd: tmpDir, stdio: 'ignore' });
    execFileSync('git', ['remote', 'add', 'origin', REPO_URL], { cwd: tmpDir, stdio: 'ignore' });
    execFileSync('git', ['config', 'core.sparseCheckout', 'true'], { cwd: tmpDir, stdio: 'ignore' });
    fs.writeFileSync(path.join(tmpDir, '.git', 'info', 'sparse-checkout'), `${MARKDOWN_SUBPATH}/\n`, 'utf8');

    execFileSync('git', ['fetch', '--depth', '1', '--filter=blob:none', 'origin', revision], {
      cwd: tmpDir,
      stdio: 'inherit',
    });
    execFileSync('git', ['checkout', 'FETCH_HEAD'], { cwd: tmpDir, stdio: 'ignore' });

    const resolvedRevision = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: tmpDir,
      encoding: 'utf8',
    }).trim();

    const markdownDir = path.join(tmpDir, MARKDOWN_SUBPATH);
    processMarkdownDirectory(markdownDir, resolvedRevision);
  } catch (err) {
    if (fs.existsSync(MANIFEST_PATH) && fs.existsSync(DOCS_COMMANDS_DIR)) {
      console.warn(`[fetch-podman-docs] Fetch failed (${err.message}), using existing generated docs.`);
      return;
    }
    if (isStrict) {
      console.error('[fetch-podman-docs] Error fetching Podman CLI docs in strict/CI mode:', err.message);
      process.exit(1);
    }
    console.warn(`[fetch-podman-docs] Warning: Could not fetch upstream docs (${err.message}).`);
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }
}

main();
