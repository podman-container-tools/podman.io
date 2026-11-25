import React from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { useSidebarBreadcrumbs } from '@docusaurus/theme-common/internal';
import TopDocsSearch from '@site/src/components/RuntimeDocs/TopDocsSearch';
import MobileDocsMenu from '@site/src/components/docs/MobileDocsMenu';
import { docsService } from '@site/src/services/docsService';
import type { DocCommandNode } from '@site/src/services/docsTypes';

const GUIDE_NAMES: Record<string, string> = {
  '/docs': 'Getting Started',
  '/docs/': 'Getting Started',
  '/docs/podman': 'Getting Started',
  '/docs/installation': 'Installation',
  '/docs/checkpoint': 'Checkpoint & Restore',
};

export default function DocBreadcrumbs(): JSX.Element | null {
  const sidebarBreadcrumbs = useSidebarBreadcrumbs();
  const location = useLocation();
  const [commands, setCommands] = React.useState<DocCommandNode[]>([]);
  const path = location.pathname.replace(/\/$/, '');

  const commandMatch = path.match(/^\/docs\/commands\/([^/]+)$/);
  const commandSlug = commandMatch ? decodeURIComponent(commandMatch[1]) : null;

  React.useEffect(() => {
    if (!commandSlug) return;
    let active = true;
    docsService
      .getManifest()
      .then(manifest => {
        if (active && Array.isArray(manifest.commands)) {
          setCommands(manifest.commands);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [commandSlug]);

  const parentCommand = React.useMemo(() => {
    if (!commandSlug || commands.length === 0) return null;
    const lower = commandSlug.toLowerCase();
    for (const parent of commands) {
      if (!parent?.slug || !Array.isArray(parent.subcommands)) continue;
      if (parent.subcommands.some(child => child.slug.toLowerCase() === lower)) {
        return { slug: parent.slug, label: parent.label || parent.slug };
      }
    }
    return null;
  }, [commandSlug, commands]);

  const activeTitle = React.useMemo(() => {
    if (commandSlug) return commandSlug;
    if (sidebarBreadcrumbs && sidebarBreadcrumbs.length > 0) {
      const last = sidebarBreadcrumbs[sidebarBreadcrumbs.length - 1];
      return last.label;
    }
    return GUIDE_NAMES[path] || GUIDE_NAMES[location.pathname] || 'Getting Started';
  }, [commandSlug, sidebarBreadcrumbs, path, location.pathname]);

  return (
    <>
      <MobileDocsMenu
        currentPath={location.pathname}
        currentCommandSlug={commandSlug || undefined}
        activeLabel={activeTitle}
      />
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 md:flex-row md:items-center md:justify-between md:gap-4">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-slate-500 dark:text-zinc-400 sm:text-sm">
          <Link
            to="/"
            className="flex shrink-0 items-center rounded p-1 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
            title="Home">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </Link>
          <span className="text-slate-400 dark:text-zinc-500">›</span>
          <Link
            to="/docs/commands"
            className="text-slate-500 no-underline transition-colors hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Docs
          </Link>
          <span className="text-slate-400 dark:text-zinc-500">›</span>
          {commandSlug ? (
            <>
              <Link
                to="/docs/commands"
                className="text-slate-500 no-underline transition-colors hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                CLI Commands
              </Link>
              {parentCommand && (
                <>
                  <span className="text-slate-400 dark:text-zinc-500">›</span>
                  <Link
                    to={`/docs/commands/${encodeURIComponent(parentCommand.slug)}`}
                    className="break-words font-mono text-slate-500 no-underline transition-colors hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                    {parentCommand.slug}
                  </Link>
                </>
              )}
              <span className="text-slate-400 dark:text-zinc-500">›</span>
              <span className="break-words font-mono font-semibold text-slate-900 dark:text-zinc-100">
                {activeTitle}
              </span>
            </>
          ) : (
            <>
              <span className="text-slate-500 dark:text-zinc-400">Guides</span>
              <span className="text-slate-400 dark:text-zinc-500">›</span>
              <span className="break-words font-semibold text-slate-900 dark:text-zinc-100">{activeTitle}</span>
            </>
          )}
        </nav>

        {/* Top Search */}
        <div className="w-full shrink-0 md:w-auto">
          <TopDocsSearch />
        </div>
      </div>
    </>
  );
}
