import type { DocMetadata, DocContent, TOCHeading } from './docsTypes';

export class PodmanMarkdownPreprocessor {
  private optionsCache: Map<string, string>;

  constructor(optionsCache: Map<string, string> = new Map()) {
    this.optionsCache = optionsCache;
  }

  public setOptionSnippet(name: string, content: string): void {
    const key = name.endsWith('.md') ? name : `${name}.md`;
    this.optionsCache.set(key, content);
  }

  public setOptionsMap(map: Record<string, string> | Map<string, string>): void {
    if (map instanceof Map) {
      this.optionsCache = new Map(map);
    } else {
      this.optionsCache = new Map(Object.entries(map));
    }
  }

  public process(filename: string, rawContent: string, revision = 'main'): DocContent {
    const isPod = filename.includes('-pod-') || filename.includes('-kube-');
    const isQuadlet = filename.endsWith('.unit.5.md.in') || filename.endsWith('.unit.5.md');

    let content = rawContent;

    // 1. Parse and extract troff header: % podman-run 1
    let title = filename.replace(/\.(1|5|7)(\.md|\.md\.in)?$/, '');
    let section = '1';

    const headerMatch = content.match(/^%\s+([^\s]+)\s+(\d+)/m);
    if (headerMatch) {
      title = headerMatch[1].replace(/\\-/g, '-');
      section = headerMatch[2];
      content = content.replace(/^%[^\n]*\n+/m, '');
    }

    // 2. Extract description from NAME section if present, and remove redundant NAME block
    // Supports both ATX '## NAME' and Setext 'NAME\n====' or 'NAME\n----'
    let description = '';
    const nameMatch = content.match(/(?:##\s*NAME|(?:\r?\n|^)NAME\r?\n[=-]+)\s*\r?\n+([^\r\n]+)/i);
    if (nameMatch) {
      const rawNameLine = nameMatch[1].replace(/\\-/g, '-').trim();
      const parts = rawNameLine.split(/\s+-\s+/);
      if (parts.length > 1) {
        description = parts.slice(1).join(' - ').trim();
      } else {
        description = rawNameLine;
      }
      // Remove NAME section completely from body markdown to prevent duplicate title/description
      content = content.replace(/(?:##\s*NAME|(?:\r?\n|^)NAME\r?\n[=-]+)\s*\r?\n+[^\r\n]+\r?\n*/i, '');
    }

    // 2b. Convert any remaining setext headings (e.g. SYNOPSIS\n--------) to ATX (## SYNOPSIS)
    content = content.replace(/^([A-Z0-9_ -]+)\r?\n([=-]{3,})\s*$/gm, (_, headingText) => {
      return `\n## ${headingText.trim()}\n\n`;
    });

    // Ensure tables have a blank line before them so GFM/CommonMark parsers recognize them as separate table blocks
    content = content.replace(/([^\n])\r?\n(\|[^\n]+\|)\r?\n/g, '$1\n\n$2\n');

    // 3. Resolve conditional blocks << if variable >> ... << endif >>
    content = this.renderConditionals(content, { is_quadlet: isQuadlet });

    // 4. Expand @@option <name> includes from options/
    content = content.replace(/^@@option\s+([^\s\n]+)/gm, (_, optName) => {
      const optKey = optName.endsWith('.md') ? optName : `${optName}.md`;
      const optSnippet = this.optionsCache.get(optKey) || '';
      if (!optSnippet) {
        return `<!-- Option [${optName}] included at build time -->`;
      }
      // Strip comments like ####> podman ...
      const cleaned = optSnippet.replace(/^####>[^\n]*\n?/gm, '').trim();
      return cleaned;
    });

    // 5. Resolve <<pod|container>> alternates
    content = content.replace(/<<([^|>]*)\|([^|>]*)>>/g, (_, podPart, containerPart) => {
      return isPod ? podPart : containerPart;
    });

    // 6. Resolve <<subcommand>> and <<fullsubcommand>> macros
    const subcommand = this.deriveSubcommand(filename, false);
    const fullSubcommand = this.deriveSubcommand(filename, true);
    content = content.replace(/<<subcommand>>/g, subcommand);
    content = content.replace(/<<fullsubcommand>>/g, fullSubcommand);

    // 7. Rewrite cross-reference links
    // e.g. [podman-build(1)](podman-build.1.md) -> [podman-build(1)](/docs/commands?cmd=podman-build)
    content = content.replace(
      /\[([^\]]+)\]\(([^)]*?)(podman-[a-zA-Z0-9_.-]+)\.(1|5|7)(?:\.md|\.md\.in)?(?:#([a-zA-Z0-9_-]+))?\)/g,
      (_, linkText, _path, targetCmd, _sec, anchor) => {
        const anchorPart = anchor ? `#${anchor}` : '';
        return `[${linkText}](/docs/commands?cmd=${targetCmd}${anchorPart})`;
      },
    );

    // Also handle direct [podman(1)](podman.1.md)
    content = content.replace(
      /\[([^\]]+)\]\(([^)]*?)podman\.(1|5|7)(?:\.md|\.md\.in)?(?:#([a-zA-Z0-9_-]+))?\)/g,
      (_, linkText, _path, _sec, anchor) => {
        const anchorPart = anchor ? `#${anchor}` : '';
        return `[${linkText}](/docs/commands?cmd=podman${anchorPart})`;
      },
    );

    // 8. Extract Table of Contents headings
    const toc = this.extractTOC(content);

    const metadata: DocMetadata = {
      slug: title,
      title,
      section,
      description: description || `Podman CLI reference documentation for ${title}`,
      filename,
      category: this.categorizeCommand(title, section),
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

  private deriveSubcommand(filename: string, full = false): string {
    let name = filename.replace(/\.(1|5|7)(\.md|\.md\.in)?$/, '');
    if (!full && name.startsWith('podman-pod-')) {
      name = name.slice('podman-pod-'.length);
    } else if (name.startsWith('podman-')) {
      name = name.slice('podman-'.length);
    }
    return name.replace(/-/g, ' ');
  }

  private renderConditionals(text: string, context: Record<string, boolean>): string {
    const ifRegex = /<<\s*if\s+(not\s+)?([a-zA-Z0-9_]+)\s*>>([\s\S]*?)<<\s*endif\s*>>/g;
    return text.replace(ifRegex, (_, notToken, varName, body) => {
      const isNot = Boolean(notToken);
      const val = Boolean(context[varName]);
      const condition = isNot ? !val : val;
      if (condition) {
        // If there's an << else >> block
        const elseParts = body.split(/<<\s*else\s*>>/);
        return elseParts[0] || '';
      } else {
        const elseParts = body.split(/<<\s*else\s*>>/);
        return elseParts[1] || '';
      }
    });
  }

  private extractTOC(markdown: string): TOCHeading[] {
    const headings: TOCHeading[] = [];
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
        // Clean markdown formatting from title
        const cleanText = rawText
          .replace(/\*\*([^*]+)\*\*/g, '$1')
          .replace(/\*([^*]+)\*/g, '$1')
          .replace(/`([^`]+)`/g, '$1')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/<[^>]+>/g, '')
          .trim();

        const id = cleanText
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');

        if (id && cleanText) {
          headings.push({ id, text: cleanText, level });
        }
      }
    }

    return headings;
  }

  public categorizeCommand(slug: string, section: string): string {
    if (section === '5' || slug.includes('unit') || slug.includes('quadlet')) {
      return 'Quadlet & Systemd (Section 5)';
    }
    if (section === '7') {
      return 'Guides & Troubleshooting (Section 7)';
    }
    if (slug === 'podman' || slug === 'podmansh') {
      return 'Core CLI';
    }
    if (
      slug.startsWith('podman-container') ||
      slug === 'podman-run' ||
      slug === 'podman-exec' ||
      slug === 'podman-ps' ||
      slug === 'podman-start' ||
      slug === 'podman-stop' ||
      slug === 'podman-rm' ||
      slug === 'podman-wait' ||
      slug === 'podman-attach' ||
      slug === 'podman-commit' ||
      slug === 'podman-cp' ||
      slug === 'podman-logs' ||
      slug === 'podman-top'
    ) {
      return 'Containers';
    }
    if (slug.startsWith('podman-pod') || slug.startsWith('podman-kube')) {
      return 'Pods & Kubernetes';
    }
    if (
      slug.startsWith('podman-image') ||
      slug === 'podman-build' ||
      slug === 'podman-images' ||
      slug === 'podman-pull' ||
      slug === 'podman-push' ||
      slug === 'podman-rmi' ||
      slug === 'podman-tag' ||
      slug === 'podman-save' ||
      slug === 'podman-load'
    ) {
      return 'Images';
    }
    if (slug.startsWith('podman-network') || slug.startsWith('podman-volume')) {
      return 'Networks & Volumes';
    }
    if (
      slug.startsWith('podman-machine') ||
      slug.startsWith('podman-system') ||
      slug.startsWith('podman-secret') ||
      slug.startsWith('podman-artifact')
    ) {
      return 'System & Machine';
    }
    return 'Other Commands';
  }
}
