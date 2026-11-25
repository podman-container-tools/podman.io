import React, { useState, useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { useLocation, useHistory } from '@docusaurus/router';
import { useDocSubmenu, type TOCHeading } from '@site/src/context/DocSubmenuContext';
import { docsService } from '@site/src/services/docsService';
import type { DocManifest, DocCommandNode } from '@site/src/services/docsTypes';

interface SpaLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

function RouterLink({ to, onClick, children, ...rest }: SpaLinkProps): JSX.Element {
  const history = useHistory();
  return (
    <a
      href={to}
      onClick={e => {
        if (onClick) {
          onClick(e);
        }
        if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
          e.preventDefault();
          history.push(to);
        }
      }}
      {...rest}>
      {children}
    </a>
  );
}

interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
}

function formatHeadingTitle(value: string): string {
  return value
    .replace(/<[^>]*>?/gm, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, String.fromCharCode(39))
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
  },
  {
    id: 'installation',
    label: 'Installation',
    href: '/docs/installation',
  },
  {
    id: 'checkpoint',
    label: 'Checkpoint & Restore',
    href: '/docs/checkpoint',
  },
];

const RESOURCE_ITEMS: NavLinkItem[] = [
  {
    id: 'network',
    label: 'Basic Networking',
    href: 'https://github.com/podman-container-tools/podman/blob/main/docs/tutorials/basic_networking.md',
    isExternal: true,
  },
  {
    id: 'python-sdk',
    label: 'Podman Python SDK',
    href: 'https://podman-py.readthedocs.io/en/latest/index.html',
    isExternal: true,
  },
  {
    id: 'troubleshooting',
    label: 'Troubleshooting Guide',
    href: 'https://github.com/podman-container-tools/podman/blob/main/troubleshooting.md',
    isExternal: true,
  },
  {
    id: 'github-repo',
    label: 'GitHub Source & Issues',
    href: 'https://github.com/podman-container-tools/podman',
    isExternal: true,
  },
];

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
  const { toc, activeHeadingId, setActiveHeadingId, openCategoryId, setOpenCategoryId, openGuideId, setOpenGuideId } =
    useDocSubmenu();

  // Manifest and commands state
  const [manifest, setManifest] = useState<DocManifest | null>(null);

  const isCliPath = activePath.startsWith('/docs/commands') || activePath.startsWith('/commands');

  // Active command resolution
  const activeCmdParam = useMemo(() => {
    if (currentCommandSlug) return currentCommandSlug.toLowerCase();
    const pathToMatch = activePath || location.pathname;
    const pathMatch = pathToMatch.match(/^\/docs\/commands\/([^/]+)\/?$/);
    if (pathMatch) {
      return decodeURIComponent(pathMatch[1]).toLowerCase();
    }
    const locMatch = location.pathname.match(/^\/docs\/commands\/([^/]+)\/?$/);
    if (locMatch) {
      return decodeURIComponent(locMatch[1]).toLowerCase();
    }
    // Legacy ?cmd= support while bookmarks redirect
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(location.search);
    return (params.get('cmd') || '').toLowerCase();
  }, [currentCommandSlug, activePath, location.pathname, location.search]);

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

  const commandNodes = useMemo<DocCommandNode[]>(() => {
    if (!manifest || !Array.isArray(manifest.commands)) return [];
    return manifest.commands;
  }, [manifest]);

  const manualToggleRef = useRef(false);

  const openParentSubSlugs = useMemo<Set<string>>(() => {
    if (!openCategoryId) return new Set();
    const openNode = commandNodes.find(n => n.slug === openCategoryId);
    if (!openNode) return new Set();
    return new Set(openNode.subcommands.map(s => s.slug.toLowerCase()));
  }, [openCategoryId, commandNodes]);

  useEffect(() => {
    if (commandNodes.length === 0 || !activeCmdParam || activeCmdParam === 'overview') {
      return;
    }

    if (manualToggleRef.current) {
      manualToggleRef.current = false;
      return;
    }

    const topNode = commandNodes.find(n => n.slug.toLowerCase() === activeCmdParam);
    if (topNode) {
      if (topNode.subcommands.length > 0) {
        setOpenCategoryId(topNode.slug);
      } else {
        setOpenCategoryId(prev => {
          if (!prev) return null;
          const prevNode = commandNodes.find(n => n.slug === prev);
          if (prevNode && prevNode.subcommands.some(s => s.slug.toLowerCase() === activeCmdParam)) {
            return prev;
          }
          return null;
        });
      }
      return;
    }

    for (const node of commandNodes) {
      if (node.subcommands.some(sub => sub.slug.toLowerCase() === activeCmdParam)) {
        setOpenCategoryId(node.slug);
        break;
      }
    }
  }, [activeCmdParam, commandNodes, setOpenCategoryId]);

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
        history.push(`/docs/commands/${encodeURIComponent(slug)}`);
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

  useEffect(() => {
    const activeGuide = GUIDE_ITEMS.find(item => isGuideActive(item.href));
    if (activeGuide) {
      setOpenGuideId(activeGuide.id);
    } else if (isCliPath) {
      setOpenGuideId(null);
    }
  }, [activePath, isCliPath, setOpenGuideId]);

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
        'modern-doc-sidebar no-scrollbar h-full w-full space-y-6 overflow-y-auto px-3.5 py-5 text-sm',
        className,
      )}
      aria-label="Documentation navigation">
      {/* ========================================================= */}
      {/* SECTION: OVERVIEW                                         */}
      {/* ========================================================= */}
      <div>
        <h3 className="doc-section-title mb-2 px-3">Overview</h3>

        <ul className="m-0 list-none space-y-0.5 p-0">
          <li className="relative">
            <RouterLink
              to="/docs/commands"
              onClick={() => handleCommandClick('overview')}
              className={clsx(
                'doc-nav-item group flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium no-underline transition-all duration-150',
                isOverviewActive && 'doc-nav-item-active font-semibold',
              )}>
              <div className="flex min-w-0 items-center">
                <span className="doc-nav-title truncate">What is Podman?</span>
              </div>
            </RouterLink>
          </li>
        </ul>
      </div>

      <div className="mx-3 h-px bg-slate-200/70 dark:bg-zinc-800/80" />

      {/* ========================================================= */}
      {/* SECTION 1: GUIDES                                         */}
      {/* ========================================================= */}
      <div>
        <h3 className="doc-section-title mb-2 px-3">Guides</h3>

        <ul className="m-0 list-none space-y-0.5 p-0">
          {GUIDE_ITEMS.map(item => {
            const active = isGuideActive(item.href);
            const isGuideOpen = openGuideId === item.id;

            const pageToc = toc.length > 0 ? toc : FALLBACK_TOC[item.id] || [];
            const rawHeadings = pageToc.filter(h => h.level === 2);
            const hasSubmenu = rawHeadings.length > 0;

            return (
              <li key={item.id} className="relative">
                <RouterLink
                  to={item.href}
                  onClick={() => handleGuideRowClick(item.id, active)}
                  className={clsx(
                    'doc-nav-item group flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-1.5 text-[13px] font-medium no-underline transition-all duration-150',
                    active && 'doc-nav-item-active font-semibold',
                  )}>
                  <div className="flex min-w-0 items-center">
                    <span className="doc-nav-title truncate">{item.label}</span>
                  </div>

                  <svg
                    className={clsx(
                      'duration-250 ml-2 h-3.5 w-3.5 shrink-0 origin-center opacity-60 transition-transform ease-in-out group-hover:opacity-100',
                      isGuideOpen ? 'rotate-90 opacity-90' : 'rotate-0',
                    )}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </RouterLink>

                {/* Submenu Headings */}
                {hasSubmenu && (
                  <div className={clsx('doc-submenu-wrapper', isGuideOpen && 'doc-submenu-wrapper-open')}>
                    <div className="doc-submenu-inner">
                      <ul className="doc-submenu-tree mb-1.5 ml-3.5 mt-1 list-none space-y-0.5 p-0 pl-2.5">
                        {rawHeadings.map(heading => {
                          const isCurrentActive = active && activeHeadingId === heading.id;
                          const cleanTitle = formatHeadingTitle(heading.value);

                          return (
                            <li key={heading.id}>
                              <a
                                href={`#${heading.id}`}
                                onClick={e => scrollToHeading(e, heading.id)}
                                className={clsx(
                                  'doc-submenu-link block truncate rounded-lg px-2.5 py-1.5 text-[12.5px] no-underline transition-all duration-150',
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

      <div className="mx-3 h-px bg-slate-200/70 dark:bg-zinc-800/80" />

      {/* ========================================================= */}
      {/* SECTION 2: CLI COMMANDS (2nd-level + Subcommand Dropdown) */}
      {/* ========================================================= */}
      <div>
        <h3 className="doc-section-title mb-2 px-3">CLI Commands</h3>

        <ul className="m-0 list-none space-y-0.5 p-0">
          {commandNodes.map(node => {
            const hasSubcommands = node.subcommands && node.subcommands.length > 0;
            const isOpen = openCategoryId === node.slug;
            const isActiveInOpenParent = Boolean(
              openCategoryId && openCategoryId !== node.slug && openParentSubSlugs.has(activeCmdParam),
            );
            const isSelfActive = isCliPath && activeCmdParam === node.slug.toLowerCase() && !isActiveInOpenParent;
            const isNodeActive = isSelfActive;
            const displayLabel =
              node.label ||
              (node.slug.toLowerCase() === 'podman'
                ? 'Podman'
                : node.title.replace(/^podman-/i, '').replace(/-/g, ' '));

            if (!hasSubcommands) {
              return (
                <li key={node.slug} className="relative">
                  <RouterLink
                    to={`/docs/commands/${encodeURIComponent(node.slug)}`}
                    onClick={() => {
                      manualToggleRef.current = true;
                      setOpenCategoryId(null);
                      setOpenGuideId(null);
                      handleCommandClick(node.slug);
                    }}
                    className={clsx(
                      'doc-nav-item group flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-1.5 text-[13px] font-medium no-underline transition-all duration-150',
                      isNodeActive && 'doc-nav-item-active font-semibold',
                    )}
                    title={node.description || node.title}>
                    <div className="flex min-w-0 items-center">
                      <span className="doc-nav-title truncate">{displayLabel}</span>
                    </div>
                  </RouterLink>
                </li>
              );
            }

            return (
              <li key={node.slug} className="relative">
                <RouterLink
                  to={`/docs/commands/${encodeURIComponent(node.slug)}`}
                  onClick={e => {
                    manualToggleRef.current = true;
                    setOpenGuideId(null);
                    setOpenCategoryId(prev => (prev === node.slug ? null : node.slug));
                    if (isSelfActive) {
                      e.preventDefault();
                    } else {
                      handleCommandClick(node.slug);
                    }
                  }}
                  className={clsx(
                    'doc-nav-item group flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-1.5 text-[13px] font-medium no-underline transition-all duration-150',
                    isNodeActive && 'doc-nav-item-active font-semibold',
                  )}
                  title={node.description || node.title}>
                  <div className="flex min-w-0 items-center">
                    <span className="doc-nav-title truncate">{displayLabel}</span>
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Toggle ${node.title} subcommands`}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleCategory(node.slug);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleCategory(node.slug);
                      }
                    }}
                    className="ml-1 flex shrink-0 cursor-pointer items-center rounded-md p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                    <svg
                      className={clsx(
                        'duration-250 h-3.5 w-3.5 shrink-0 origin-center opacity-60 transition-transform ease-in-out group-hover:opacity-100',
                        isOpen ? 'rotate-90 opacity-90' : 'rotate-0',
                      )}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.25"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </RouterLink>

                {/* Indented 3rd-Level Subcommands List with Smooth Height Transition */}
                <div
                  aria-hidden={!isOpen}
                  className={clsx('doc-submenu-wrapper', isOpen && 'doc-submenu-wrapper-open')}>
                  <div className="doc-submenu-inner">
                    <ul className="doc-submenu-tree mb-1.5 ml-3.5 mt-1 list-none space-y-0.5 p-0 pl-2.5">
                      {node.subcommands.map(sub => {
                        const isCmdActive = isCliPath && activeCmdParam === sub.slug.toLowerCase();

                        return (
                          <li key={sub.slug}>
                            <RouterLink
                              to={`/docs/commands/${encodeURIComponent(sub.slug)}`}
                              tabIndex={isOpen ? 0 : -1}
                              onClick={() => {
                                manualToggleRef.current = true;
                                setOpenCategoryId(node.slug);
                                handleCommandClick(sub.slug);
                              }}
                              className={clsx(
                                'doc-submenu-link block w-full truncate rounded-lg px-2.5 py-1.5 text-[12.5px] no-underline transition-all duration-150',
                                isCmdActive && 'doc-submenu-link-active font-semibold',
                              )}
                              title={sub.description || sub.title}>
                              {sub.label ||
                                sub.title
                                  .replace(new RegExp(`^${node.slug}-`, 'i'), '')
                                  .replace(/^podman-/i, '')
                                  .replace(/-/g, ' ')}
                            </RouterLink>
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

      <div className="mx-3 h-px bg-slate-200/70 dark:bg-zinc-800/80" />

      {/* ========================================================= */}
      {/* SECTION 3: TUTORIALS & RESOURCES                          */}
      {/* ========================================================= */}
      <div>
        <h3 className="doc-section-title mb-2 px-3">Tutorials & Resources</h3>

        <ul className="m-0 list-none space-y-0.5 p-0">
          {RESOURCE_ITEMS.map(item => {
            return (
              <li key={item.id} className="relative">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onItemClick}
                  className="doc-nav-item group flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-1.5 text-[13px] font-medium no-underline transition-all duration-150">
                  <div className="flex min-w-0 items-center">
                    <span className="doc-nav-title truncate">{item.label}</span>
                  </div>

                  <svg
                    className="ml-2 h-3.5 w-3.5 shrink-0 opacity-60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
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
