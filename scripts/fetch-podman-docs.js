/**
 * Build-time Podman CLI Documentation Fetcher & Preprocessor
 *
 * Fetches canonical Markdown from `podman-container-tools/podman` (`docs/source/markdown`)
 * at a pinned commit SHA (`.podman-docs-revision` or `PODMAN_DOCS_REF`),
 * preprocesses all `.md` and `.md.in` man-page templates and `options/*.md`
 * snippets, and outputs static JSON assets into `static/data/cli-docs/`
 * so Docusaurus bundles them directly into the static site build.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { CATEGORY_ORDER, categorizeCommand } = require('../src/services/commandCategorizer');

// Fingerprint of this script and shared categorizer: any change to the fetch/categorize logic
// forces a regeneration, even when the upstream revision is unchanged.
const GENERATOR_VERSION = crypto
  .createHash('sha256')
  .update(fs.readFileSync(__filename))
  .update(fs.readFileSync(require.resolve('../src/services/commandCategorizer')))
  .digest('hex')
  .slice(0, 12);

const REPO_URL = 'https://github.com/podman-container-tools/podman.git';
const MARKDOWN_SUBPATH = 'docs/source/markdown';
const ROOT_DIR = path.resolve(__dirname, '..');
const REVISION_FILE = path.join(ROOT_DIR, '.podman-docs-revision');
const OUTPUT_DIR = path.join(ROOT_DIR, 'static', 'data', 'cli-docs');
const COMMANDS_DIR = path.join(OUTPUT_DIR, 'commands');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest.json');

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

function extractTOC(markdown) {
  const headings = [];
  const lines = markdown.split(/\r?\n/);
  const codeBlockRegex = /^```/;
  let inCodeBlock = false;

  for (const line of lines) {
    if (codeBlockRegex.test(line)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2].trim();
      const cleanText = rawText
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .trim();

      const id = cleanText
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      headings.push({
        id,
        text: cleanText,
        level,
      });
    }
  }

  return headings;
}

function preprocessMarkdown(filename, rawContent, optionsMap, revision) {
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

  // Convert setext headings to ATX
  content = content.replace(/^([A-Z0-9_ -]+)\r?\n([=-]{3,})\s*$/gm, (_, headingText) => {
    return `\n## ${headingText.trim()}\n\n`;
  });

  // Ensure tables have a blank line before and after them
  content = content.replace(/(^[^|\r\n][^\r\n]*)\r?\n(\|[^\r\n]+\|)/gm, '$1\n\n$2');
  content = content.replace(/(\|[^\r\n]+\|)\r?\n([^|\r\n])/gm, '$1\n\n$2');

  // Resolve conditional blocks
  content = renderConditionals(content, { is_quadlet: isQuadlet });

  // Expand @@option includes from options/
  content = content.replace(/^@@option\s+([^\s\n]+)/gm, (_, optName) => {
    const optKey = optName.endsWith('.md') ? optName : `${optName}.md`;
    const optSnippet = optionsMap.get(optKey) || '';
    if (!optSnippet) {
      return `<!-- Option [${optName}] included at build time -->`;
    }
    return optSnippet.replace(/^####>[^\n]*\n?/gm, '').trim();
  });

  // Resolve <<pod|container>> alternates
  content = content.replace(/<<([^|>]*)\|([^|>]*)>>/g, (_, podPart, containerPart) => {
    return isPod ? podPart : containerPart;
  });

  // Resolve <<subcommand>> and <<fullsubcommand>> macros
  content = content.replace(/<<subcommand>>/g, deriveSubcommand(filename, false));
  content = content.replace(/<<fullsubcommand>>/g, deriveSubcommand(filename, true));

  // Rewrite cross-reference links
  content = content.replace(
    /\[([^\]]+)\]\(([^)]*?)(podman-[a-zA-Z0-9_.-]+)\.(1|5|7)(?:\.md|\.md\.in)?(?:#([a-zA-Z0-9_-]+))?\)/g,
    (_, linkText, _path, targetCmd, _sec, anchor) => {
      const anchorPart = anchor ? `#${anchor}` : '';
      return `[${linkText}](/docs/commands/${targetCmd}${anchorPart})`;
    },
  );
  content = content.replace(
    /\[([^\]]+)\]\(([^)]*?)podman\.(1|5|7)(?:\.md|\.md\.in)?(?:#([a-zA-Z0-9_-]+))?\)/g,
    (_, linkText, _path, _sec, anchor) => {
      const anchorPart = anchor ? `#${anchor}` : '';
      return `[${linkText}](/docs/commands/podman${anchorPart})`;
    },
  );

  const toc = extractTOC(content);
  const metadata = {
    slug: title,
    title,
    section,
    description: description || `Podman CLI reference documentation for ${title}`,
    filename,
    category: categorizeCommand(title, section),
    isTemplate: filename.endsWith('.md.in'),
  };

  return {
    metadata,
    markdown: content,
    toc,
    revision,
    fetchedAt: new Date().toISOString(),
  };
}

function buildManifest(items, revision) {
  const categoryOrder = CATEGORY_ORDER;

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

  return {
    revision,
    generatorVersion: GENERATOR_VERSION,
    generatedAt: new Date().toISOString(),
    categories,
    aliases: {},
    totalCount: items.length,
  };
}

function main() {
  const force = process.argv.includes('--force');
  const strict = process.argv.includes('--strict') || Boolean(process.env.CI);
  const revision = resolveTargetRevision();

  if (!force && fs.existsSync(MANIFEST_PATH)) {
    try {
      const existing = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
      if (
        existing &&
        existing.revision === revision &&
        existing.generatorVersion === GENERATOR_VERSION &&
        existing.totalCount > 50
      ) {
        console.log(
          `[fetch-podman-docs] Static CLI docs already up-to-date for revision ${revision} (${existing.totalCount} commands).`,
        );
        return;
      }
    } catch {
      // Proceed to rebuild
    }
  }

  console.log(`[fetch-podman-docs] Fetching upstream Podman markdown at revision: ${revision}...`);
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'podman-docs-'));

  try {
    execFileSync('git', ['init'], { cwd: tmpDir, stdio: 'ignore' });
    execFileSync('git', ['remote', 'add', 'origin', REPO_URL], { cwd: tmpDir, stdio: 'ignore' });
    execFileSync('git', ['config', 'core.sparseCheckout', 'true'], { cwd: tmpDir, stdio: 'ignore' });
    fs.writeFileSync(path.join(tmpDir, '.git', 'info', 'sparse-checkout'), `${MARKDOWN_SUBPATH}/\n`);
    execFileSync('git', ['fetch', '--depth', '1', '--filter=blob:none', 'origin', revision], {
      cwd: tmpDir,
      stdio: 'inherit',
    });
    execFileSync('git', ['checkout', 'FETCH_HEAD'], { cwd: tmpDir, stdio: 'ignore' });

    const resolvedSha = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: tmpDir,
      encoding: 'utf8',
    }).trim();

    const mdRoot = path.join(tmpDir, MARKDOWN_SUBPATH);
    const optionsDir = path.join(mdRoot, 'options');

    const optionsMap = new Map();
    if (fs.existsSync(optionsDir)) {
      const optFiles = fs.readdirSync(optionsDir).filter(f => f.endsWith('.md'));
      for (const optFile of optFiles) {
        optionsMap.set(optFile, fs.readFileSync(path.join(optionsDir, optFile), 'utf8'));
      }
    }
    console.log(`[fetch-podman-docs] Loaded ${optionsMap.size} option snippets.`);

    // Write into a staging folder first, then swap it in. This removes docs that were
    // deleted/renamed upstream and never leaves a half-written folder behind on failure.
    const stagingDir = path.join(OUTPUT_DIR, '.commands-staging');
    fs.rmSync(stagingDir, { recursive: true, force: true });
    fs.mkdirSync(stagingDir, { recursive: true });

    const entries = fs.readdirSync(mdRoot, { withFileTypes: true });
    const docFiles = entries
      .filter(e => e.isFile() && (e.name.endsWith('.md') || e.name.endsWith('.md.in')))
      .map(e => e.name)
      .filter(name => name !== 'README.md' && name !== '.gitignore');

    const metadataList = [];
    for (const filename of docFiles) {
      const rawContent = fs.readFileSync(path.join(mdRoot, filename), 'utf8');
      const docContent = preprocessMarkdown(filename, rawContent, optionsMap, resolvedSha);
      metadataList.push(docContent.metadata);

      const safeSlug = path.basename(docContent.metadata.slug.toLowerCase()).replace(/[^a-z0-9._-]/g, '-');
      const outPath = path.join(stagingDir, `${safeSlug}.json`);
      fs.writeFileSync(outPath, JSON.stringify(docContent));
    }

    if (metadataList.length === 0) {
      throw new Error(`No markdown docs found under ${MARKDOWN_SUBPATH} at ${resolvedSha}`);
    }

    fs.rmSync(COMMANDS_DIR, { recursive: true, force: true });
    fs.renameSync(stagingDir, COMMANDS_DIR);

    const manifest = buildManifest(metadataList, resolvedSha);
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

    console.log(
      `[fetch-podman-docs] Preprocessed and wrote ${metadataList.length} static CLI docs (revision ${resolvedSha}) to static/data/cli-docs/.`,
    );
  } catch (err) {
    if (strict) {
      console.error('[fetch-podman-docs] Failed to fetch upstream Podman docs during build:', err.message);
      process.exit(1);
    } else {
      console.warn('[fetch-podman-docs] Warning: Could not fetch upstream docs (offline?). Proceeding with fallback.');
    }
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { categorizeCommand, CATEGORY_ORDER };
