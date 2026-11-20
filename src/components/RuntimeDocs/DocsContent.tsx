import React, { useState, lazy, Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import type { DocContent } from '@site/src/services/docsTypes';

const MarkdownRenderer = lazy(async () => {
  const [reactMarkdownMod, remarkGfmMod] = await Promise.all([import('react-markdown'), import('remark-gfm')]);
  const ReactMarkdown = reactMarkdownMod.default;
  const remarkGfm = remarkGfmMod.default;

  return {
    default: (props: React.ComponentProps<typeof ReactMarkdown>) => (
      <ReactMarkdown {...props} remarkPlugins={[remarkGfm, ...(props.remarkPlugins || [])]} />
    ),
  };
});

interface DocsContentProps {
  content: DocContent | null;
  loading: boolean;
  onNavigateInternal: (slug: string) => void;
}

function CodeBlock({ children }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const rawString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    // If lines start with "$ ", copy the executable command without the prompt
    const cleanToCopy = rawString
      .split('\n')
      .map(line => (line.startsWith('$ ') ? line.slice(2) : line))
      .join('\n');
    navigator.clipboard.writeText(cleanToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = rawString.split('\n');

  return (
    <div className="shadow-2xs group relative my-4 overflow-hidden rounded-lg border border-[#e2e8f0] bg-[#f8fafc] font-mono text-xs text-slate-800 transition-colors hover:border-[#cbd5e1] dark:border-[#27272a] dark:bg-[#18181b] dark:text-zinc-100 dark:hover:border-[#3f3f46] sm:rounded-xl sm:text-[13px]">
      {/* Docker-Style Copy Button in Top-Right with Solid Filled Icon */}
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy to clipboard'}
        aria-label="Copy code"
        className="absolute right-2.5 top-2.5 z-10 flex cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-transparent px-2 py-1.5 text-slate-400 transition-all hover:bg-black/5 hover:text-slate-700 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-100 sm:right-3 sm:top-3">
        {copied ? (
          <>
            <svg className="h-4 w-4 text-emerald-500 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-sans text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Copied!</span>
          </>
        ) : (
          <svg
            className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-600 dark:text-zinc-400 dark:group-hover:text-zinc-200"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M15 1H4c-1.1 0-2 .9-2 2v13c0 .55.45 1 1 1s1-.45 1-1V3h11c.55 0 1-.45 1-1s-.45-1-1-1zm4 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z" />
          </svg>
        )}
      </button>

      {/* Code Content with prompt highlighting */}
      <div className="sm:p-4.5 overflow-x-auto p-4 pr-14 leading-relaxed">
        <pre className="!m-0 !border-0 !bg-transparent !p-0 font-mono text-xs leading-relaxed text-slate-800 dark:text-zinc-100 sm:text-[13px]">
          <code>
            {lines.map((line, idx) => {
              const isPrompt = line.startsWith('$ ');
              const isComment = line.trim().startsWith('#');

              if (isPrompt) {
                return (
                  <div key={idx} className="leading-relaxed">
                    <span className="mr-1.5 select-none font-semibold text-emerald-500 dark:text-emerald-400">$</span>
                    <span>{line.slice(2)}</span>
                  </div>
                );
              }

              if (isComment) {
                return (
                  <div key={idx} className="text-gray-400 italic leading-relaxed dark:text-zinc-500">
                    {line}
                  </div>
                );
              }

              return (
                <div key={idx} className="leading-relaxed">
                  {line || '\u00A0'}
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function DocsContent({ content, loading, onNavigateInternal }: DocsContentProps): JSX.Element {
  const [copiedLink, setCopiedLink] = useState(false);

  if (loading || !content) {
    return (
      <div className="w-full flex-1 animate-pulse space-y-6 py-8">
        <div className="bg-gray-200 h-10 w-2/3 rounded-lg dark:bg-zinc-800" />
        <div className="h-5 w-1/3 rounded bg-gray-100 dark:bg-zinc-800/60" />
        <div className="space-y-3 pt-6">
          <div className="h-4 w-full rounded bg-gray-100 dark:bg-zinc-800/40" />
          <div className="h-4 w-5/6 rounded bg-gray-100 dark:bg-zinc-800/40" />
          <div className="h-4 w-4/6 rounded bg-gray-100 dark:bg-zinc-800/40" />
        </div>
      </div>
    );
  }

  const { metadata, markdown } = content;
  const upstreamUrl = `https://github.com/containers/podman/blob/main/docs/source/markdown/${metadata.filename}`;

  const copyPageLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <article className="w-full min-w-0 flex-1 text-gray-900 dark:text-zinc-100">
      {/* Document Header */}
      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#0284c7]/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-[#0284c7] dark:bg-[#1ECCFF]/[0.18] dark:text-[#1ECCFF]">
              Section {metadata.section}
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-blue-500/80">{metadata.category}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Share / Copy Link Button */}
            <button
              type="button"
              onClick={copyPageLink}
              title="Copy link to this page"
              className="shadow-2xs group inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200/90 bg-slate-50 px-2.5 text-xs font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:border-zinc-700/80 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-white sm:h-8 sm:px-3">
              {copiedLink ? (
                <>
                  <svg
                    className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <svg
                    className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-slate-600 dark:text-zinc-400 dark:group-hover:text-zinc-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  <span>Share</span>
                </>
              )}
            </button>

            {/* View Source on GitHub Button */}
            <a
              href={upstreamUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View source markdown on GitHub"
              className="shadow-2xs group inline-flex h-7 items-center gap-1.5 rounded-lg border border-slate-200/90 bg-slate-50 px-2.5 text-xs font-medium !text-slate-600 !no-underline transition-all hover:border-slate-300 hover:bg-slate-100 hover:!text-slate-900 dark:border-zinc-700/80 dark:bg-zinc-800/80 dark:!text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:!text-white sm:h-8 sm:px-3">
              {/* GitHub Mark */}
              <svg
                className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-slate-600 dark:text-zinc-400 dark:group-hover:text-zinc-200"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>View Source</span>
              {/* External Arrow */}
              <svg
                className="h-3 w-3 text-slate-400 transition-colors group-hover:text-slate-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>

        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-4xl">
          {metadata.title}
        </h1>
        <p className="text-gray-600 m-0 !text-[15px] font-normal leading-relaxed dark:text-zinc-400 sm:!text-base">
          {metadata.description.split(/(`[^`]+`)/g).map((part, idx) =>
            part.startsWith('`') && part.endsWith('`') ? (
              <code key={idx} className="inline-code-var">
                {part.slice(1, -1)}
              </code>
            ) : (
              part
            ),
          )}
        </p>
      </header>

      {/* Markdown Content */}
      <div className="text-gray-800 space-y-4 !text-[15px] leading-relaxed dark:text-zinc-200 sm:!text-base">
        <BrowserOnly fallback={<div className="h-40 animate-pulse rounded-xl bg-gray-100 dark:bg-zinc-800" />}>
          {() => (
            <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-gray-100 dark:bg-zinc-800" />}>
              <MarkdownRenderer
                children={markdown}
                components={{
                  h1({ children }) {
                    const text = String(children);
                    const id = slugify(text);
                    return (
                      <h1
                        id={id}
                        className="group mb-4 mt-10 scroll-mt-20 !border-b-0 !border-none !pb-0 !text-2xl font-bold text-gray-900 dark:text-white sm:!text-3xl">
                        <a
                          href={`#${id}`}
                          className="text-gray-900 no-underline hover:text-sky-600 dark:text-white dark:hover:text-blue-500">
                          {children}
                          <span className="text-gray-400 dark:text-blue-400 ml-2 text-sm opacity-0 group-hover:opacity-100">
                            #
                          </span>
                        </a>
                      </h1>
                    );
                  },
                  h2({ children }) {
                    const text = String(children);
                    const id = slugify(text);
                    return (
                      <h2
                        id={id}
                        className="group mb-3 mt-10 scroll-mt-20 !border-b-0 !border-none !pb-0 !text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:!text-2xl">
                        <a
                          href={`#${id}`}
                          className="text-gray-900 no-underline hover:text-sky-600 dark:text-white dark:hover:text-blue-500">
                          {children}
                          <span className="text-gray-400 dark:text-blue-400 ml-2 text-sm opacity-0 group-hover:opacity-100">
                            #
                          </span>
                        </a>
                      </h2>
                    );
                  },
                  h3({ children }) {
                    const text = String(children);
                    const id = slugify(text);
                    return (
                      <h3
                        id={id}
                        className="group mb-2 mt-8 scroll-mt-20 !border-b-0 !border-none !pb-0 !text-lg font-semibold text-gray-900 dark:text-white sm:!text-xl">
                        <a
                          href={`#${id}`}
                          className="text-gray-900 no-underline hover:text-sky-600 dark:text-white dark:hover:text-blue-500">
                          {children}
                          <span className="text-gray-400 dark:text-blue-400 ml-2 text-sm opacity-0 group-hover:opacity-100">
                            #
                          </span>
                        </a>
                      </h3>
                    );
                  },
                  h4({ children }) {
                    const id = slugify(String(children));
                    return (
                      <h4
                        id={id}
                        className="mb-1 mt-6 scroll-mt-20 font-mono !text-sm font-semibold text-sky-700 dark:text-blue-300 sm:!text-base">
                        {children}
                      </h4>
                    );
                  },
                  p({ children }) {
                    return (
                      <p className="my-3 !text-[15px] leading-relaxed text-gray-700 dark:text-zinc-300 sm:!text-base">
                        {children}
                      </p>
                    );
                  },
                  pre({ children }) {
                    return <>{children}</>;
                  },
                  code({ inline, className, children }) {
                    if (inline) {
                      return <code className="inline-code-var">{children}</code>;
                    }
                    return <CodeBlock className={className}>{children}</CodeBlock>;
                  },
                  a({ href, children }) {
                    if (href && (href.startsWith('/commands?cmd=') || href.startsWith('/docs/commands?cmd='))) {
                      const targetCmd = href
                        .replace(/^.*[?&]cmd=/, '')
                        .split('&')[0]
                        .split('#')[0];
                      return (
                        <a
                          href={href}
                          onClick={e => {
                            e.preventDefault();
                            onNavigateInternal(targetCmd);
                          }}
                          className="dark:hover:text-blue-200 cursor-pointer font-medium text-sky-600 hover:text-sky-700 hover:underline dark:text-blue-300">
                          {children}
                        </a>
                      );
                    }
                    return (
                      <a
                        href={href}
                        target={href?.startsWith('http') ? '_blank' : undefined}
                        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="dark:hover:text-blue-200 font-medium text-sky-600 hover:text-sky-700 hover:underline dark:text-blue-300">
                        {children}
                      </a>
                    );
                  },
                  table({ children }) {
                    return (
                      <div className="my-6 overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs sm:text-[13px]">{children}</table>
                      </div>
                    );
                  },
                  thead({ children }) {
                    return <thead className="border-b border-slate-200 dark:border-zinc-800">{children}</thead>;
                  },
                  tbody({ children }) {
                    return <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">{children}</tbody>;
                  },
                  tr({ children }) {
                    return (
                      <tr className="transition-colors hover:bg-slate-50/60 dark:hover:bg-zinc-800/30">{children}</tr>
                    );
                  },
                  th({ children }) {
                    return (
                      <th className="whitespace-nowrap py-2.5 pr-6 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                        {children}
                      </th>
                    );
                  },
                  td({ children }) {
                    return (
                      <td className="py-3 pr-6 align-top leading-relaxed text-slate-600 dark:text-zinc-300">
                        {children}
                      </td>
                    );
                  },
                }}
              />
            </Suspense>
          )}
        </BrowserOnly>
      </div>

      {/* Footer Info */}
      <footer className="text-gray-400 mt-16 flex flex-wrap items-center justify-between gap-2 pt-8 text-xs dark:text-zinc-500">
        <div>
          Branch: <span className="text-gray-600 font-mono dark:text-zinc-400">upstream/main</span>
        </div>
        <div>Synced: {new Date(content.fetchedAt).toLocaleTimeString()}</div>
      </footer>
    </article>
  );
}
