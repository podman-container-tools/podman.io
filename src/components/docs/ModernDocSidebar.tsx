import React, { useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { useLocation, useHistory } from '@docusaurus/router';
import { useDocSubmenu, type TOCHeading } from '@site/src/context/DocSubmenuContext';
import { docsService } from '@site/src/services/docsService';
import type { DocManifest, DocCategory } from '@site/src/services/docsTypes';

interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
  icon: () => JSX.Element;
}

function formatHeadingTitle(value: string): string {
  return value
    .replace(/<[^>]*>?/gm, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

const FALLBACK_TOC: Record<string, TOCHeading[]> = {
  'getting-started': [
    { id: 'podman-documentation', value: 'Podman Documentation', level: 2 },
    { id: 'installing-podman', value: 'Installing Podman', level: 2 },
    { id: 'familiarizing-yourself-with-podman', value: 'Familiarizing yourself with Podman', level: 2 },
    { id: 'integration-tests', value: 'Integration Tests', level: 2 },
    { id: 'more-information', value: 'More information', level: 2 },
  ],
  'installation': [
    { id: 'installing-on-mac--windows', value: 'Installing on Mac & Windows', level: 2 },
    { id: 'installing-on-linux', value: 'Installing on Linux', level: 2 },
    { id: 'installing-on-freebsd', value: 'Installing on FreeBSD', level: 2 },
    { id: 'building-from-source', value: 'Building from Source', level: 2 },
    { id: 'ansible', value: 'Ansible', level: 2 },
    { id: 'configuration-files', value: 'Configuration files', level: 2 },
  ],
  'checkpoint': [
    { id: 'checkpointing-the-container', value: 'Checkpointing the container', level: 2 },
    { id: 'restoring-the-container', value: 'Restoring the container', level: 2 },
    { id: 'migrating-the-container', value: 'Migrating the container', level: 2 },
  ],
};

const GUIDE_ITEMS: NavLinkItem[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    href: '/docs',
    icon: () => (
      <svg
        className="h-4 w-4 shrink-0 transition-colors"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
  },
  {
    id: 'installation',
    label: 'Installation',
    href: '/docs/installation',
    icon: () => (
      <svg
        className="h-4 w-4 shrink-0 transition-colors"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    id: 'checkpoint',
    label: 'Checkpoint & Restore',
    href: '/docs/checkpoint',
    icon: () => (
      <svg
        className="h-4 w-4 shrink-0 transition-colors"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
    ),
  },
];

const RESOURCE_ITEMS: NavLinkItem[] = [
  {
    id: 'network',
    label: 'Basic Networking',
    href: 'https://github.com/podman-container-tools/podman/blob/main/docs/tutorials/basic_networking.md',
    isExternal: true,
    icon: () => (
      <svg
        className="h-4 w-4 shrink-0 transition-colors"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: 'python-sdk',
    label: 'Podman Python SDK',
    href: 'https://podman-py.readthedocs.io/en/latest/index.html',
    isExternal: true,
    icon: () => (
      <svg
        className="h-4 w-4 shrink-0 transition-colors"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: 'troubleshooting',
    label: 'Troubleshooting Guide',
    href: 'https://github.com/containers/podman/blob/main/troubleshooting.md',
    isExternal: true,
    icon: () => (
      <svg
        className="h-4 w-4 shrink-0 transition-colors"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    id: 'github-repo',
    label: 'GitHub Source & Issues',
    href: 'https://github.com/containers/podman',
    isExternal: true,
    icon: () => (
      <svg
        className="h-4 w-4 shrink-0 transition-colors"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
];

function getCategoryIcon(catId: string) {
  const iconClass = 'h-4 w-4 shrink-0 transition-colors';

  switch (catId) {
    case 'containers':
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case 'pods---kubernetes':
    case 'pods-kubernetes':
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <circle cx="19" cy="6" r="2" />
          <circle cx="5" cy="6" r="2" />
          <circle cx="19" cy="18" r="2" />
          <circle cx="5" cy="18" r="2" />
          <line x1="12" y1="9" x2="12" y2="3" />
          <line x1="12" y1="15" x2="12" y2="21" />
        </svg>
      );
    case 'images':
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case 'networks---volumes':
    case 'networks-volumes':
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      );
    case 'system---machine':
    case 'system-machine':
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case 'quadlet---systemd--section-5-':
    case 'quadlet-systemd':
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    default:
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
  }
}

interface ModernDocSidebarProps {
  currentPath?: string;
  onItemClick?: () => void;
  className?: string;
  onSelectCommand?: (slug: string) => void;
  currentCommandSlug?: string;
}

export default function ModernDocSidebar({
  currentPath,
  onItemClick,
  className,
  onSelectCommand,
  currentCommandSlug,
}: ModernDocSidebarProps): JSX.Element {
  const location = useLocation();
  const history = useHistory();
  const activePath = currentPath || location.pathname;
  const { toc, activeHeadingId, setActiveHeadingId } = useDocSubmenu();

  // Manifest and commands state
  const [manifest, setManifest] = useState<DocManifest | null>(null);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  const isCliPath = activePath.startsWith('/docs/commands') || activePath.startsWith('/commands');

  // Active command resolution
  const activeCmdParam = useMemo(() => {
    if (currentCommandSlug) return currentCommandSlug.toLowerCase();
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    return (params.get('cmd') || '').toLowerCase();
  }, [currentCommandSlug, location.search]);

  // Load manifest and listen for live updates
  useEffect(() => {
    let mounted = true;
    docsService.getManifest().then(m => {
      if (mounted) {
        setManifest(m);
      }
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

  // Auto-expand category matching current command and close others
  useEffect(() => {
    if (manifest && activeCmdParam && activeCmdParam !== 'overview') {
      for (const cat of manifest.categories) {
        if (cat.items.some(i => i.slug.toLowerCase() === activeCmdParam)) {
          setOpenCategoryId(cat.id);
          break;
        }
      }
    }
  }, [activeCmdParam, manifest]);

  const categories = useMemo<DocCategory[]>(() => {
    return manifest ? manifest.categories : [];
  }, [manifest]);

  const toggleCategory = (catId: string) => {
    setOpenCategoryId(prev => (prev === catId ? null : catId));
    setOpenGuideId(null);
  };

  const handleCommandClick = (slug: string) => {
    if (slug === 'overview' || !slug) {
      setOpenCategoryId(null);
      setOpenGuideId(null);
    }
    if (onSelectCommand) {
      onSelectCommand(slug);
    } else {
      if (slug === 'overview' || !slug) {
        history.push('/docs/commands');
      } else {
        history.push(`/docs/commands?cmd=${encodeURIComponent(slug)}`);
      }
    }
    if (onItemClick) onItemClick();
  };

  // Guides section active check
  const isGuideActive = (href: string) => {
    if (href === '/docs') {
      return (
        activePath === '/docs' ||
        activePath === '/docs/' ||
        activePath === '/docs/podman' ||
        activePath === '/docs/podman/'
      );
    }
    return activePath === href || activePath === `${href}/`;
  };

  const currentActiveGuideId =
    GUIDE_ITEMS.find(item => isGuideActive(item.href))?.id || (isCliPath ? null : 'getting-started');

  const [openGuideId, setOpenGuideId] = useState<string | null>(currentActiveGuideId);

  useEffect(() => {
    const activeGuide = GUIDE_ITEMS.find(item => isGuideActive(item.href));
    if (activeGuide) {
      setOpenGuideId(activeGuide.id);
    } else if (isCliPath) {
      setOpenGuideId(null);
    }
  }, [activePath, isCliPath]);

  const scrollToHeading = (e: React.MouseEvent<HTMLAnchorElement>, headingId: string) => {
    e.preventDefault();
    const el = document.getElementById(headingId);
    if (el) {
      setActiveHeadingId(headingId);
      const navHeight = 60;
      const targetPos = el.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
      window.scrollTo({
        top: Math.max(0, targetPos),
        behavior: 'smooth',
      });
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', `#${headingId}`);
      }
    }
  };

  const handleGuideRowClick = (guideId: string, isActiveGuide: boolean) => {
    if (isActiveGuide) {
      setOpenGuideId(prev => (prev === guideId ? null : guideId));
    } else {
      setOpenGuideId(guideId);
    }
    setOpenCategoryId(null);
    if (onItemClick) onItemClick();
  };

  const isOverviewActive = isCliPath && (!activeCmdParam || activeCmdParam === 'overview');

  return (
    <nav
      className={clsx(
        'modern-doc-sidebar no-scrollbar h-full w-full space-y-7 overflow-y-auto px-4 py-6 text-sm',
        className,
      )}
      aria-label="Documentation navigation">
      {/* ========================================================= */}
      {/* SECTION: OVERVIEW                                         */}
      {/* ========================================================= */}
      <div>
        <h3 className="doc-section-title mb-2.5 px-3 text-[11px] font-bold uppercase tracking-wider">Overview</h3>

        <ul className="m-0 list-none space-y-1 p-0">
          <li className="relative">
            <Link
              to="/docs/commands"
              onClick={() => handleCommandClick('overview')}
              className={clsx(
                'doc-nav-item group flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium no-underline transition-all duration-150',
                isOverviewActive && 'doc-nav-item-active font-semibold',
              )}>
              <div className="flex min-w-0 items-center gap-2.5">
                <svg
                  className="h-4 w-4 shrink-0 transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <span className="doc-nav-title truncate">What is Podman?</span>
              </div>
            </Link>
          </li>
        </ul>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: GUIDES                                         */}
      {/* ========================================================= */}
      <div>
        <h3 className="doc-section-title mb-2.5 px-3 text-[11px] font-bold uppercase tracking-wider">Guides</h3>

        <ul className="m-0 list-none space-y-1 p-0">
          {GUIDE_ITEMS.map(item => {
            const active = isGuideActive(item.href);
            const IconComponent = item.icon;
            const isGuideOpen = openGuideId === item.id;

            const pageToc = toc.length > 0 ? toc : FALLBACK_TOC[item.id] || [];
            const rawHeadings = pageToc.filter(h => h.level === 2);
            const hasSubmenu = rawHeadings.length > 0;

            return (
              <li key={item.id} className="relative">
                <Link
                  to={item.href}
                  onClick={() => handleGuideRowClick(item.id, active)}
                  className={clsx(
                    'doc-nav-item group flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium no-underline transition-all duration-150',
                    active && 'doc-nav-item-active font-semibold',
                  )}>
                  <div className="flex min-w-0 items-center gap-2.5">
                    <IconComponent />
                    <span className="doc-nav-title truncate">{item.label}</span>
                  </div>

                  <svg
                    className={clsx(
                      'duration-250 ml-2 h-3.5 w-3.5 shrink-0 origin-center transition-transform ease-in-out',
                      isGuideOpen ? 'rotate-90' : 'rotate-0',
                    )}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>

                {/* Submenu Headings */}
                {hasSubmenu && (
                  <div className={clsx('doc-submenu-wrapper', isGuideOpen && 'doc-submenu-wrapper-open')}>
                    <div className="doc-submenu-inner">
                      <ul className="doc-submenu-tree mb-2 ml-4 mt-1 list-none space-y-0.5 p-0 pl-2.5">
                        {rawHeadings.map(heading => {
                          const isCurrentActive = active && activeHeadingId === heading.id;
                          const cleanTitle = formatHeadingTitle(heading.value);

                          return (
                            <li key={heading.id}>
                              <a
                                href={`#${heading.id}`}
                                onClick={e => scrollToHeading(e, heading.id)}
                                className={clsx(
                                  'doc-submenu-link block truncate rounded-md px-2 py-1 text-[12.5px] no-underline transition-colors duration-150',
                                  isCurrentActive && 'doc-submenu-link-active font-semibold',
                                )}
                                title={cleanTitle}>
                                {cleanTitle}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* ========================================================= */}
      {/* SECTION 2: CLI COMMANDS                                   */}
      {/* ========================================================= */}
      <div>
        <h3 className="doc-section-title mb-2.5 px-3 text-[11px] font-bold uppercase tracking-wider">CLI Commands</h3>

        <ul className="m-0 list-none space-y-1 p-0">
          {/* Categorized Command Folders */}
          {categories.map(cat => {
            const isOpen = openCategoryId === cat.id;
            const isCatActive = isCliPath && cat.items.some(i => i.slug.toLowerCase() === activeCmdParam);

            return (
              <li key={cat.id} className="relative">
                <Link
                  to={`/docs/commands?category=${encodeURIComponent(cat.id)}`}
                  onClick={e => {
                    e.preventDefault();
                    toggleCategory(cat.id);
                  }}
                  className={clsx(
                    'doc-nav-item group flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium no-underline transition-all duration-150',
                    isCatActive && 'doc-nav-item-active font-semibold',
                  )}>
                  <div className="flex min-w-0 items-center gap-2.5">
                    {getCategoryIcon(cat.id)}
                    <span className="doc-nav-title truncate" title={cat.name}>
                      {cat.name}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="doc-nav-count font-mono text-[11px] opacity-70">{cat.items.length}</span>
                    <svg
                      className={clsx(
                        'duration-250 ml-1 h-3.5 w-3.5 shrink-0 origin-center transition-transform ease-in-out',
                        isOpen ? 'rotate-90' : 'rotate-0',
                      )}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </Link>

                {/* Indented Commands List with Smooth Height Transition */}
                <div className={clsx('doc-submenu-wrapper', isOpen && 'doc-submenu-wrapper-open')}>
                  <div className="doc-submenu-inner">
                    <ul className="doc-submenu-tree mb-2 ml-4 mt-1 list-none space-y-0.5 p-0 pl-2.5">
                      {cat.items.map(cmd => {
                        const isCmdActive = isCliPath && activeCmdParam === cmd.slug.toLowerCase();

                        return (
                          <li key={cmd.slug}>
                            <Link
                              to={`/docs/commands?cmd=${encodeURIComponent(cmd.slug)}`}
                              onClick={() => handleCommandClick(cmd.slug)}
                              className={clsx(
                                'doc-submenu-link block w-full truncate rounded-md px-2 py-1 font-mono text-[12.5px] no-underline transition-colors duration-150',
                                isCmdActive && 'doc-submenu-link-active font-semibold',
                              )}
                              title={cmd.description || cmd.title}>
                              {cmd.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ========================================================= */}
      {/* SECTION 3: TUTORIALS & RESOURCES                          */}
      {/* ========================================================= */}
      <div>
        <h3 className="doc-section-title mb-2.5 px-3 text-[11px] font-bold uppercase tracking-wider">
          Tutorials & Resources
        </h3>

        <ul className="m-0 list-none space-y-1 p-0">
          {RESOURCE_ITEMS.map(item => {
            const IconComponent = item.icon;

            return (
              <li key={item.id} className="relative">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onItemClick}
                  className="doc-nav-item group flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium no-underline transition-all duration-150">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <IconComponent />
                    <span className="doc-nav-title truncate">{item.label}</span>
                  </div>

                  <svg
                    className="ml-2 h-3.5 w-3.5 shrink-0 opacity-70 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
