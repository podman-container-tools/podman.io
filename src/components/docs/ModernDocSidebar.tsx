import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { useDocSubmenu, type TOCHeading } from '@site/src/context/DocSubmenuContext';

interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
  icon: (props: { className?: string; active?: boolean }) => JSX.Element;
}

interface NavSection {
  title: string;
  items: NavLinkItem[];
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

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Guides',
    items: [
      {
        id: 'getting-started',
        label: 'Getting Started',
        href: '/docs',
        icon: ({ className, active }) => (
          <svg
            className={clsx(
              'h-4 w-4 shrink-0 transition-colors',
              className,
              active
                ? 'text-[#892ca0] dark:text-purple-300'
                : 'text-gray-400 dark:text-zinc-500 group-hover:text-[#892ca0] dark:group-hover:text-purple-300',
            )}
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
        icon: ({ className, active }) => (
          <svg
            className={clsx(
              'h-4 w-4 shrink-0 transition-colors',
              className,
              active
                ? 'text-[#892ca0] dark:text-purple-300'
                : 'text-gray-400 dark:text-zinc-500 group-hover:text-[#892ca0] dark:group-hover:text-purple-300',
            )}
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
        label: 'Checkpoint',
        href: '/docs/checkpoint',
        icon: ({ className, active }) => (
          <svg
            className={clsx(
              'h-4 w-4 shrink-0 transition-colors',
              className,
              active
                ? 'text-[#892ca0] dark:text-purple-300'
                : 'text-gray-400 dark:text-zinc-500 group-hover:text-[#892ca0] dark:group-hover:text-purple-300',
            )}
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
    ],
  },
  {
    title: 'Resources',
    items: [
      {
        id: 'tutorials',
        label: 'Tutorials',
        href: 'https://docs.podman.io/en/latest/Tutorials.html',
        isExternal: true,
        icon: ({ className }) => (
          <svg
            className={clsx(
              'text-gray-400 dark:text-zinc-500 h-4 w-4 shrink-0 transition-colors group-hover:text-[#892ca0] dark:group-hover:text-purple-300',
              className,
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        ),
      },
      {
        id: 'documentation',
        label: 'Documentation',
        href: 'https://docs.podman.io',
        isExternal: true,
        icon: ({ className }) => (
          <svg
            className={clsx(
              'text-gray-400 dark:text-zinc-500 h-4 w-4 shrink-0 transition-colors group-hover:text-[#892ca0] dark:group-hover:text-purple-300',
              className,
            )}
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
        ),
      },
      {
        id: 'network',
        label: 'Network',
        href: 'https://github.com/podman-container-tools/podman/blob/main/docs/tutorials/basic_networking.md',
        isExternal: true,
        icon: ({ className }) => (
          <svg
            className={clsx(
              'text-gray-400 dark:text-zinc-500 h-4 w-4 shrink-0 transition-colors group-hover:text-[#892ca0] dark:group-hover:text-purple-300',
              className,
            )}
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
        label: 'Podman Python',
        href: 'https://podman-py.readthedocs.io/en/latest/index.html',
        isExternal: true,
        icon: ({ className }) => (
          <svg
            className={clsx(
              'text-gray-400 dark:text-zinc-500 h-4 w-4 shrink-0 transition-colors group-hover:text-[#892ca0] dark:group-hover:text-purple-300',
              className,
            )}
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
    ],
  },
  {
    title: 'Community',
    items: [
      {
        id: 'community-meetings',
        label: 'Meetings & Notes',
        href: '/community',
        icon: ({ className, active }) => (
          <svg
            className={clsx(
              'h-4 w-4 shrink-0 transition-colors',
              className,
              active
                ? 'text-[#892ca0] dark:text-purple-300'
                : 'text-gray-400 dark:text-zinc-500 group-hover:text-[#892ca0] dark:group-hover:text-purple-300',
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        id: 'github-repo',
        label: 'GitHub',
        href: 'https://github.com/containers/podman',
        isExternal: true,
        icon: ({ className }) => (
          <svg
            className={clsx(
              'text-gray-400 dark:text-zinc-500 h-4 w-4 shrink-0 transition-colors group-hover:text-[#892ca0] dark:group-hover:text-purple-300',
              className,
            )}
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
    ],
  },
];

interface ModernDocSidebarProps {
  currentPath?: string;
  onItemClick?: () => void;
  className?: string;
}

export default function ModernDocSidebar({ currentPath, onItemClick, className }: ModernDocSidebarProps): JSX.Element {
  const location = useLocation();
  const activePath = currentPath || location.pathname;
  const { toc, activeHeadingId, setActiveHeadingId } = useDocSubmenu();

  const isItemActive = (href: string, isExternal?: boolean) => {
    if (isExternal) return false;
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

  const currentActiveGuideId = NAV_SECTIONS[0].items.find(item => isItemActive(item.href))?.id || 'getting-started';

  // Accordion state: only one guide is open at a time
  const [openGuideId, setOpenGuideId] = useState<string | null>(currentActiveGuideId);

  // When active page changes, auto-open that guide and close the others
  useEffect(() => {
    if (currentActiveGuideId) {
      setOpenGuideId(currentActiveGuideId);
    }
  }, [currentActiveGuideId]);

  const handleGuideRowClick = (guideId: string, isActive: boolean) => {
    if (onItemClick) onItemClick();
    if (isActive) {
      // Toggle if clicking the already active guide
      setOpenGuideId(prev => (prev === guideId ? null : guideId));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Opening another guide immediately closes the previous one with smooth transition
      setOpenGuideId(guideId);
    }
  };

  const scrollToHeading = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const navbarOffset = 115;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', `#${id}`);
      setActiveHeadingId(id);
      if (onItemClick) onItemClick();
    }
  };

  return (
    <nav
      className={clsx('no-scrollbar w-full flex-1 select-none space-y-6 overflow-y-auto px-3 py-5', className)}
      aria-label="Documentation Navigation">
      {NAV_SECTIONS.map(section => (
        <div key={section.title}>
          <div className="text-gray-400 dark:text-zinc-500 mb-2 px-3 text-[11px] font-bold uppercase tracking-wider">
            {section.title}
          </div>

          <ul className="m-0 list-none space-y-0.5 p-0">
            {section.items.map(item => {
              const active = isItemActive(item.href, item.isExternal);
              const IconComponent = item.icon;
              const isGuide = section.title === 'Guides';
              const rawHeadings = isGuide
                ? ((active && toc && toc.length > 0 ? toc : FALLBACK_TOC[item.id]) || []).filter(h => h.level === 2)
                : [];
              const hasSubmenu = isGuide && rawHeadings.length > 0;
              const isGuideOpen = isGuide && openGuideId === item.id;

              return (
                <li key={item.id} className="relative">
                  <Link
                    to={item.href}
                    onClick={() => {
                      if (isGuide) {
                        handleGuideRowClick(item.id, active);
                      } else {
                        if (onItemClick) onItemClick();
                      }
                    }}
                    className={clsx(
                      'doc-nav-item group flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium no-underline transition-all duration-150',
                      active ? 'doc-nav-item-active font-semibold text-[#892ca0]' : 'dark:text-zinc-300 text-gray-700',
                    )}>
                    <div className="flex min-w-0 items-center gap-2.5">
                      <IconComponent active={active} />
                      <span className="doc-nav-title truncate">{item.label}</span>
                    </div>

                    {/* Chevron dropdown icon visible on all three guide items inside the row */}
                    {isGuide && (
                      <svg
                        className={clsx(
                          'duration-250 ml-2 h-3.5 w-3.5 shrink-0 origin-center transition-transform ease-in-out',
                          isGuideOpen ? 'rotate-90' : 'rotate-0',
                          active
                            ? 'text-[#892ca0] dark:text-purple-300'
                            : 'text-gray-400 dark:text-zinc-500 group-hover:text-[#892ca0] dark:group-hover:text-purple-300',
                        )}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    )}

                    {item.isExternal && (
                      <svg
                        className="text-gray-400 ml-2 h-3.5 w-3.5 shrink-0 opacity-40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#892ca0] group-hover:opacity-100 dark:group-hover:text-purple-300"
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
                    )}
                  </Link>

                  {/* Smooth collapsible accordion container with fluid height & opacity transition */}
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
                                    isCurrentActive
                                      ? 'doc-submenu-link-active font-semibold text-[#892ca0] dark:text-purple-300'
                                      : 'dark:text-zinc-400 dark:hover:text-zinc-200 text-gray-500 hover:text-gray-900',
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
      ))}
    </nav>
  );
}
