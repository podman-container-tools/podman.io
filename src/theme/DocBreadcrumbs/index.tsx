import React from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { useSidebarBreadcrumbs } from '@docusaurus/theme-common/internal';
import TopDocsSearch from '@site/src/components/RuntimeDocs/TopDocsSearch';

const GUIDE_NAMES: Record<string, string> = {
  '/docs': 'Getting Started',
  '/docs/': 'Getting Started',
  '/docs/podman': 'Getting Started',
  '/docs/installation': 'Installation',
  '/docs/checkpoint': 'Checkpoint & Restore',
};

function resolveParentCommand(slug: string): string | null {
  const lower = slug.toLowerCase();
  if ((lower.endsWith('.unit') && lower !== 'podman-systemd.unit') || lower === 'podman-quadlet-basic-usage') {
    return 'podman-systemd.unit';
  }
  if (lower === 'podman-machine-os') {
    return null;
  }
  if (lower.startsWith('podman-machine-os-')) {
    return 'podman-machine-os';
  }
  if (lower.startsWith('podman-')) {
    const parts = lower.split('-');
    if (parts.length >= 3) {
      return `${parts[0]}-${parts[1]}`;
    }
  }
  return null;
}

export default function DocBreadcrumbs(): JSX.Element | null {
  const sidebarBreadcrumbs = useSidebarBreadcrumbs();
  const location = useLocation();
  const path = location.pathname.replace(/\/$/, '');

  const commandMatch = path.match(/^\/docs\/commands\/([^/]+)$/);
  const commandSlug = commandMatch ? decodeURIComponent(commandMatch[1]) : null;
  const parentCommandSlug = commandSlug ? resolveParentCommand(commandSlug) : null;

  const activeTitle = React.useMemo(() => {
    if (commandSlug) return commandSlug;
    if (sidebarBreadcrumbs && sidebarBreadcrumbs.length > 0) {
      const last = sidebarBreadcrumbs[sidebarBreadcrumbs.length - 1];
      return last.label;
    }
    return GUIDE_NAMES[path] || GUIDE_NAMES[location.pathname] || 'Getting Started';
  }, [commandSlug, sidebarBreadcrumbs, path, location.pathname]);

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 dark:text-[#1ECCFF]">
        <Link
          to="/"
          className="flex items-center rounded p-1 text-slate-700 transition-opacity hover:bg-slate-100 hover:opacity-80 dark:text-[#1ECCFF] dark:hover:bg-blue-500/[0.1]"
          title="Home">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </Link>
        <span className="text-gray-400 dark:text-[#1ECCFF]/60">›</span>
        <Link
          to="/docs/commands"
          className="text-gray-500 no-underline transition-colors hover:text-slate-900 dark:text-[#1ECCFF] dark:hover:text-white">
          Docs
        </Link>
        <span className="text-gray-400 dark:text-[#1ECCFF]/60">›</span>
        {commandSlug ? (
          <>
            <Link
              to="/docs/commands"
              className="text-gray-500 no-underline transition-colors hover:text-slate-900 dark:text-[#1ECCFF] dark:hover:text-white">
              CLI Commands
            </Link>
            {parentCommandSlug && (
              <>
                <span className="text-gray-400 dark:text-[#1ECCFF]/60">›</span>
                <Link
                  to={`/docs/commands/${encodeURIComponent(parentCommandSlug)}`}
                  className="font-mono text-gray-500 no-underline transition-colors hover:text-slate-900 dark:text-[#1ECCFF] dark:hover:text-white">
                  {parentCommandSlug}
                </Link>
              </>
            )}
            <span className="text-gray-400 dark:text-[#1ECCFF]/60">›</span>
            <span className="rounded-full bg-[#0284c7]/10 px-2.5 py-0.5 font-mono font-medium text-[#0284c7] dark:bg-[#1ECCFF]/[0.18] dark:text-[#1ECCFF]">
              {activeTitle}
            </span>
          </>
        ) : (
          <>
            <span className="text-gray-500 dark:text-[#1ECCFF]">Guides</span>
            <span className="text-gray-400 dark:text-[#1ECCFF]/60">›</span>
            <span className="rounded-full bg-[#0284c7]/10 px-2.5 py-0.5 font-medium text-[#0284c7] dark:bg-[#1ECCFF]/[0.18] dark:text-[#1ECCFF]">
              {activeTitle}
            </span>
          </>
        )}
      </nav>

      {/* Top Search */}
      <div className="shrink-0">
        <TopDocsSearch />
      </div>
    </div>
  );
}
