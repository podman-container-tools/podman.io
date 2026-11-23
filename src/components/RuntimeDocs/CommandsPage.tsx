import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import { useLocation, useHistory, matchPath } from '@docusaurus/router';
import ModernDocSidebar from '@site/src/components/docs/ModernDocSidebar';
import DocsContent from '@site/src/components/RuntimeDocs/DocsContent';
import OverviewContent from '@site/src/components/RuntimeDocs/OverviewContent';
import TopDocsSearch from '@site/src/components/RuntimeDocs/TopDocsSearch';
import { docsService } from '@site/src/services/docsService';
import type { DocManifest, DocContent as DocContentType } from '@site/src/services/docsTypes';

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
  const [docContent, setDocContent] = useState<DocContentType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  // Fetch document whenever currentSlug changes, with live update listener
  useEffect(() => {
    if (!currentSlug || currentSlug === 'overview') {
      setDocContent(null);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    docsService
      .getDocument(currentSlug)
      .then(doc => {
        if (mounted) {
          setDocContent(doc);
          setLoading(false);
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    // Listen for live background SWR document updates
    const handleDocUpdate = (e: CustomEvent<{ slug: string; content: DocContentType }>) => {
      if (mounted && e.detail && e.detail.slug.toLowerCase() === currentSlug.toLowerCase()) {
        setDocContent(e.detail.content);
        setLoading(false);
      }
    };

    const handleDocInvalidation = () => {
      if (mounted) {
        docsService
          .getDocument(currentSlug, true)
          .then(doc => {
            if (mounted) {
              setDocContent(doc);
              setLoading(false);
            }
          })
          .catch(() => undefined);
      }
    };

    window.addEventListener('podman-doc-updated', handleDocUpdate as EventListener);
    window.addEventListener('podman-docs-invalidated', handleDocInvalidation as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener('podman-doc-updated', handleDocUpdate as EventListener);
      window.removeEventListener('podman-docs-invalidated', handleDocInvalidation as EventListener);
    };
  }, [currentSlug]);

  const handleSelectCommand = (slug: string, hash?: string) => {
    const cleanHash = hash ? (hash.startsWith('#') ? hash : `#${hash}`) : '';
    if (!slug || slug === 'overview') {
      setCurrentSlug('');
      history.push('/docs/commands');
    } else {
      setCurrentSlug(slug);
      history.push(`/docs/commands/${encodeURIComponent(slug)}${cleanHash}`);
    }
    setMobileDrawerOpen(false);
  };

  // Find active category for breadcrumb
  const activeCategory = useMemo(() => {
    if (!manifest || !currentSlug || currentSlug === 'overview') return null;
    return manifest.categories.find(c => c.items.some(i => i.slug.toLowerCase() === currentSlug.toLowerCase()));
  }, [manifest, currentSlug]);

  const isOverview = !currentSlug || currentSlug === 'overview';

  const pageTitle = isOverview
    ? 'CLI Commands | Podman Documentation'
    : docContent?.metadata.title
      ? `${docContent.metadata.title} | Podman Documentation`
      : `${currentSlug} | Podman Documentation`;

  const pageDescription = isOverview
    ? 'Podman daemonless container engine and CLI reference documentation'
    : docContent?.metadata.description || 'Podman CLI reference documentation';

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <div className="flex min-h-[calc(100vh-var(--ifm-navbar-height,3.75rem))] bg-white dark:bg-[#18181b]">
        {/* ========================================================= */}
        {/* DESKTOP SIDEBAR: Unified ModernDocSidebar                 */}
        {/* ========================================================= */}
        <div className="relative hidden w-72 shrink-0 lg:flex">
          <aside
            className={clsx(
              'doc-sidebar-aside sticky flex w-72 flex-col overflow-hidden transition-[top,height] duration-200 ease-out',
              navbarVisible
                ? 'top-[var(--ifm-navbar-height,3.75rem)] h-[calc(100vh-var(--ifm-navbar-height,3.75rem))]'
                : 'top-0 h-screen',
            )}>
            <ModernDocSidebar
              currentPath={location.pathname}
              currentCommandSlug={currentSlug}
              onSelectCommand={handleSelectCommand}
            />
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
                  onSelectCommand={handleSelectCommand}
                  onItemClick={() => setMobileDrawerOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MAIN CONTENT AREA: What is Podman OR Selected Command     */}
        {/* ========================================================= */}
        <main className="w-full min-w-0 flex-1 px-6 py-8 sm:px-10 lg:px-12">
          {/* Top Bar: Breadcrumb + Search */}
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
              {isOverview ? (
                <>
                  <span className="text-gray-500 dark:text-[#1ECCFF]">Overview</span>
                  <span className="text-gray-400 dark:text-[#1ECCFF]/60">›</span>
                  <span className="rounded-full bg-[#0284c7]/10 px-2.5 py-0.5 font-medium text-[#0284c7] dark:bg-[#1ECCFF]/[0.18] dark:text-[#1ECCFF]">
                    What is Podman?
                  </span>
                </>
              ) : (
                <>
                  <span className="text-gray-500 dark:text-[#1ECCFF]">CLI Commands</span>
                  {activeCategory && (
                    <>
                      <span className="text-gray-400 dark:text-[#1ECCFF]/60">›</span>
                      <span className="text-gray-500 dark:text-[#1ECCFF]">{activeCategory.name}</span>
                    </>
                  )}
                  <span className="text-gray-400 dark:text-[#1ECCFF]/60">›</span>
                  <span className="rounded-full bg-[#0284c7]/10 px-2.5 py-0.5 font-mono font-medium text-[#0284c7] dark:bg-[#1ECCFF]/[0.18] dark:text-[#1ECCFF]">
                    {currentSlug}
                  </span>
                </>
              )}
            </nav>

            {/* Top Search */}
            <TopDocsSearch onSelectCommand={handleSelectCommand} />
          </div>

          {/* Render Overview OR Specific Command */}
          {isOverview ? (
            <OverviewContent manifest={manifest} onSelectCommand={handleSelectCommand} />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleSelectCommand('overview')}
                  className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-xs font-medium text-gray-500 transition-colors hover:text-sky-600 dark:text-blue-500 dark:hover:text-blue-300">
                  <span>← Back to Overview</span>
                </button>
              </div>

              <DocsContent content={docContent} loading={loading} onNavigateInternal={handleSelectCommand} />
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}
