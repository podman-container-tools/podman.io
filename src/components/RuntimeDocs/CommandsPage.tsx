import React, { useEffect, useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import { useLocation, useHistory, matchPath } from '@docusaurus/router';
import ModernDocSidebar from '@site/src/components/docs/ModernDocSidebar';
import MobileDocsMenu from '@site/src/components/docs/MobileDocsMenu';
import OverviewContent from '@site/src/components/RuntimeDocs/OverviewContent';
import TopDocsSearch from '@site/src/components/RuntimeDocs/TopDocsSearch';
import { docsService } from '@site/src/services/docsService';
import type { DocManifest } from '@site/src/services/docsTypes';

export default function DocsCommandsPage(): JSX.Element {
  const location = useLocation();
  const history = useHistory();

  // Prefer /docs/commands/<slug>; fall back to legacy ?cmd= during redirect.
  const getSlugFromLocation = useCallback(() => {
    const matched = matchPath<{ slug?: string }>(location.pathname, {
      path: '/docs/commands/:slug',
      exact: true,
    });
    if (matched?.params?.slug) {
      return decodeURIComponent(matched.params.slug);
    }
    const pathMatch = location.pathname.match(/^\/docs\/commands\/([^/]+)\/?$/);
    if (pathMatch) {
      return decodeURIComponent(pathMatch[1]);
    }
    return new URLSearchParams(location.search).get('cmd') || '';
  }, [location.pathname, location.search]);

  const [currentSlug, setCurrentSlug] = useState<string>(() => getSlugFromLocation());
  const [manifest, setManifest] = useState<DocManifest | null>(null);

  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Dynamic navbar visibility for responsive sidebar top & height on scroll
  const [navbarVisible, setNavbarVisible] = useState<boolean>(true);

  useEffect(() => {
    const navbarEl = document.querySelector('nav.navbar');
    const checkNavbar = () => {
      if (!navbarEl) return;
      const isHidden =
        navbarEl.classList.toString().includes('navbarHidden') ||
        navbarEl.classList.contains('navbar--hidden') ||
        navbarEl.getAttribute('aria-hidden') === 'true';
      setNavbarVisible(!isHidden);
    };

    let observer: MutationObserver | null = null;
    if (navbarEl) {
      observer = new MutationObserver(checkNavbar);
      observer.observe(navbarEl, {
        attributes: true,
        attributeFilter: ['class', 'style', 'aria-hidden'],
      });
      checkNavbar();
    }

    const handleScroll = () => {
      if (window.pageYOffset <= 10) {
        setNavbarVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Redirect legacy ?cmd=<slug> bookmarks to /docs/commands/<slug>
  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const legacy = search.get('cmd');
    if (!legacy) {
      return;
    }
    search.delete('cmd');
    const qs = search.toString();
    history.replace(`/docs/commands/${encodeURIComponent(legacy)}${qs ? `?${qs}` : ''}${location.hash || ''}`);
  }, [location.search, location.hash, history]);

  // Sync currentSlug from path (or legacy query while redirecting)
  useEffect(() => {
    setCurrentSlug(getSlugFromLocation());
  }, [location.pathname, location.search, getSlugFromLocation]);

  // Load manifest and listen for upstream updates
  useEffect(() => {
    let mounted = true;
    docsService.getManifest().then(m => {
      if (mounted) setManifest(m);
    });

    const handleManifestUpdate = (e: CustomEvent<DocManifest>) => {
      if (mounted && e.detail) setManifest(e.detail);
    };

    const handleInvalidation = () => {
      if (mounted) {
        docsService.getManifest(true).then(m => {
          if (mounted) setManifest(m);
        });
      }
    };

    window.addEventListener('podman-docs-manifest-updated', handleManifestUpdate as EventListener);
    window.addEventListener('podman-docs-invalidated', handleInvalidation as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener('podman-docs-manifest-updated', handleManifestUpdate as EventListener);
      window.removeEventListener('podman-docs-invalidated', handleInvalidation as EventListener);
    };
  }, []);

  const handleSelectCommand = (slug: string, hash?: string) => {
    const cleanHash = hash ? (hash.startsWith('#') ? hash : `#${hash}`) : '';
    if (!slug || slug === 'overview') {
      setCurrentSlug('');
      history.push('/docs/commands');
    } else {
      setCurrentSlug(slug);
      history.push(`/docs/commands/${encodeURIComponent(slug)}${cleanHash}`);
    }
  };

  const isOverview = !currentSlug || currentSlug === 'overview';

  const pageTitle = 'CLI Commands | Podman Documentation';
  const pageDescription = 'Podman daemonless container engine and CLI reference documentation';

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <div className="flex min-h-[calc(100vh-var(--ifm-navbar-height,3.75rem))] bg-white dark:bg-[#18181b]">
        {/* ========================================================= */}
        {/* DESKTOP SIDEBAR: Unified ModernDocSidebar                 */}
        {/* ========================================================= */}
        <div className="relative hidden w-72 shrink-0 min-[997px]:flex">
          <aside
            className={clsx(
              'doc-sidebar-aside sticky flex w-72 flex-col overflow-hidden transition-[top,height] duration-200 ease-out',
              navbarVisible
                ? 'top-[var(--ifm-navbar-height,3.75rem)] h-[calc(100vh-var(--ifm-navbar-height,3.75rem))]'
                : 'top-0 h-screen',
            )}>
            <ModernDocSidebar currentPath={location.pathname} currentCommandSlug={currentSlug} />
          </aside>
        </div>

        {/* Mobile Header / Drawer Toggle */}
        <div className="fixed bottom-5 right-5 z-40 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-full border-0 bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg dark:bg-[#1ECCFF] dark:text-gray-900">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span>Documentation Menu</span>
          </button>
        </div>

        {/* Mobile Drawer Backdrop and Panel */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="backdrop-blur-xs fixed inset-0 bg-black/40" onClick={() => setMobileDrawerOpen(false)} />
            <div className="relative flex h-full w-80 max-w-[85vw] flex-col overflow-hidden bg-white p-4 shadow-2xl dark:bg-[#18181b]">
              <div className="mb-3 flex items-center justify-between px-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">Documentation</span>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="cursor-pointer border-0 bg-transparent p-1 text-lg text-gray-500">
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <ModernDocSidebar
                  currentPath={location.pathname}
                  currentCommandSlug={currentSlug}
                  onItemClick={() => setMobileDrawerOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MAIN CONTENT AREA: What is Podman OR Selected Command     */}
        {/* ========================================================= */}
        <main className="w-full min-w-0 flex-1 px-4 pb-10 pt-0 sm:px-6 min-[997px]:px-10 min-[997px]:py-8 lg:px-12">
          <MobileDocsMenu
            currentPath={location.pathname}
            currentCommandSlug={currentSlug}
            activeLabel={isOverview ? 'What is Podman?' : currentSlug}
          />

          {/* Top Bar: Breadcrumb + Search */}
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
              {isOverview ? (
                <>
                  <span className="text-slate-500 dark:text-zinc-400">Overview</span>
                  <span className="text-slate-400 dark:text-zinc-500">›</span>
                  <span className="break-words font-semibold text-slate-900 dark:text-zinc-100">What is Podman?</span>
                </>
              ) : (
                <>
                  <span className="text-gray-500 dark:text-[#1ECCFF]">CLI Commands</span>
                  <span className="text-gray-400 dark:text-[#1ECCFF]/60">›</span>
                  <span className="rounded-full bg-[#0284c7]/10 px-2.5 py-0.5 font-mono font-medium text-[#0284c7] dark:bg-[#1ECCFF]/[0.18] dark:text-[#1ECCFF]">
                    {currentSlug}
                  </span>
                </>
              )}
            </nav>

            {/* Top Search */}
            <div className="w-full shrink-0 md:w-auto">
              <TopDocsSearch onSelectCommand={handleSelectCommand} />
            </div>
          </div>

          <OverviewContent manifest={manifest} onSelectCommand={handleSelectCommand} />
        </main>
      </div>
    </Layout>
  );
}
