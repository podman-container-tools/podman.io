import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/theme-common/internal';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import type { Props } from '@theme/DocItem/Content';
import { useDocSubmenu, type TOCHeading } from '@site/src/context/DocSubmenuContext';

function useSyntheticTitle() {
  const { metadata, frontMatter, contentTitle } = useDoc();
  const shouldRender = !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

function inferManSection(slug: string): string {
  if (slug.endsWith('.unit')) return '5';
  if (slug === 'podman-troubleshooting' || slug === 'podman-rootless' || slug === 'podman-quadlet-basic-usage') {
    return '7';
  }
  return '1';
}

export default function DocItemContent({ children }: Props): JSX.Element {
  const syntheticTitle = useSyntheticTitle();
  const { metadata, toc } = useDoc();
  const { setDocTOC } = useDocSubmenu();
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (toc) {
      setDocTOC(toc as unknown as TOCHeading[]);
    }
  }, [toc, setDocTOC]);

  const isCommandDoc = Boolean(metadata.permalink && metadata.permalink.startsWith('/docs/commands/'));
  const commandSlug = isCommandDoc ? metadata.title || metadata.id.replace(/^commands\//, '') : '';
  const section = isCommandDoc ? inferManSection(commandSlug) : '1';
  const upstreamUrl = 'https://github.com/podman-container-tools/podman/tree/main/docs/source/markdown';

  const copyPageLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href).catch(() => undefined);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {isCommandDoc ? (
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#0284c7]/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-[#0284c7] dark:bg-[#1ECCFF]/[0.18] dark:text-[#1ECCFF]">
                Section {section}
              </span>
              <span className="text-xs font-medium text-gray-500 dark:text-blue-500/80">CLI Reference</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyPageLink}
                title="Copy link to this page"
                className="shadow-2xs group inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-white sm:h-8 sm:px-3">
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
                      className="h-3.5 w-3.5 text-slate-500 transition-colors group-hover:text-slate-700 dark:text-zinc-400 dark:group-hover:text-white"
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

              <a
                href={upstreamUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View source markdown on GitHub"
                className="shadow-2xs group inline-flex h-7 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium !text-slate-700 !no-underline transition-all hover:border-slate-300 hover:bg-slate-50 hover:!text-slate-900 dark:border-zinc-700 dark:bg-zinc-800/80 dark:!text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:!text-white sm:h-8 sm:px-3">
                <svg
                  className="h-3.5 w-3.5 text-slate-500 transition-colors group-hover:text-slate-700 dark:text-zinc-400 dark:group-hover:text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>View Source</span>
              </a>
            </div>
          </div>

          {syntheticTitle && (
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-4xl">
              {syntheticTitle}
            </h1>
          )}
        </header>
      ) : (
        syntheticTitle && (
          <header>
            <Heading as="h1">{syntheticTitle}</Heading>
          </header>
        )
      )}
      <MDXContent>{children}</MDXContent>
      {isCommandDoc && (
        <div className="mt-10 flex flex-col items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm text-slate-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 sm:flex-row sm:items-center sm:px-5">
          <span>Showing the latest CLI reference. Looking for older Podman versions or the REST API docs?</span>
          <a
            href="https://docs.podman.io/en/latest/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold !text-slate-800 !no-underline transition-colors hover:border-slate-300 hover:bg-slate-100 hover:!text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 dark:!text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-700">
            <span>docs.podman.io</span>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      )}
      {isCommandDoc && (
        <div className="mt-10 flex flex-col items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm text-slate-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 sm:flex-row sm:items-center sm:px-5">
          <span>Showing the latest CLI reference. Looking for older Podman versions or the REST API docs?</span>
          <a
            href="https://docs.podman.io/en/latest/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold !text-slate-800 !no-underline transition-colors hover:border-slate-300 hover:bg-slate-100 hover:!text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 dark:!text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-700">
            <span>docs.podman.io</span>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
