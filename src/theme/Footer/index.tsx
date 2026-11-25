import React, { useEffect, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useThemeConfig, type FooterLinkItem } from '@docusaurus/theme-common';
import { Icon } from '@iconify/react';
import { CncfWordmark } from './FooterLogos';

const ITEM_ICONS: Record<string, string> = {
  'Installation Instructions': 'material-symbols:download-rounded',
  Documentation: 'material-symbols:menu-book-outline-rounded',
  Matrix: 'simple-icons:matrix',
  Discord: 'simple-icons:discord',
  Blog: 'material-symbols:article-outline-rounded',
  'Mailing List': 'material-symbols:mail-outline-rounded',
  'Podman GitHub': 'simple-icons:github',
  'Podman Desktop GitHub': 'simple-icons:github',
  'Podman Container Tools GitHub': 'simple-icons:github',
  'Podman Desktop Website': 'material-symbols:desktop-windows-outline-rounded',
};

const SOCIAL_LINKS = [
  {
    label: 'Podman on GitHub',
    href: 'https://github.com/containers/podman',
    icon: 'simple-icons:github',
  },
  {
    label: 'Podman Discord',
    href: 'https://discord.com/invite/x5GzFF6QH4',
    icon: 'simple-icons:discord',
  },
  {
    label: 'Podman Matrix',
    href: 'https://matrix.to/#/#podman:fedoraproject.org',
    icon: 'simple-icons:matrix',
  },
  {
    label: 'Podman Mailing List',
    href: 'https://lists.podman.io',
    icon: 'material-symbols:mail-outline-rounded',
  },
];

const CURRENT_YEAR = new Date().getFullYear();

const LINK_RESET = 'no-underline hover:no-underline';

function FooterLink({ item }: { item: FooterLinkItem }): JSX.Element {
  const { to, href, label, prependBaseUrlToHref, ...props } = item;
  const toUrl = useBaseUrl(to);
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });
  const iconName = label ? ITEM_ICONS[label] : undefined;

  return (
    <Link
      className={`group inline-flex items-center gap-2.5 text-sm text-white/80 transition-all duration-150 hover:translate-x-0.5 hover:text-white dark:text-white/80 dark:hover:text-white ${LINK_RESET}`}
      {...(href
        ? {
            href: prependBaseUrlToHref ? normalizedHref : href,
          }
        : {
            to: toUrl,
          })}
      {...props}>
      {iconName && (
        <Icon
          icon={iconName}
          className="h-4 w-4 shrink-0 text-white/80 transition-colors duration-150 group-hover:text-white"
          aria-hidden="true"
        />
      )}
      <span>{label}</span>
    </Link>
  );
}

function Footer(): JSX.Element | null {
  const { footer } = useThemeConfig();
  const podmanLogoUrl = useBaseUrl('logos/optimized/podman-3-logo-266w-253h.webp');
  const footerRevealRef = useRef<HTMLElement>(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const el = footerRevealRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsFooterVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.12 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!footer) {
    return null;
  }

  const rawLinks: Array<FooterLinkItem | { title?: string; items: FooterLinkItem[] }> = footer.links ?? [];
  const columns = rawLinks.filter((col): col is { title?: string; items: FooterLinkItem[] } => 'items' in col);

  return (
    <footer
      ref={footerRevealRef}
      className="overflow-hidden border-t border-white/20 bg-purple-700 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
      <div className="mx-auto max-w-7xl px-5 pb-5 pt-7 sm:px-8 sm:pt-9 lg:px-10">
        {/* Top Section: Brand, Navigation Columns & CNCF */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="overflow-hidden py-1">
              <Link
                to="/"
                className={`inline-flex items-center gap-3.5 text-white hover:text-white dark:text-white dark:hover:text-white sm:gap-4 ${LINK_RESET}`}>
                <img
                  src={podmanLogoUrl}
                  alt="Podman Logo"
                  width={101}
                  height={96}
                  className={`h-14 w-auto transition-all duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:h-16 md:h-20 ${
                    isFooterVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                  }`}
                  loading="lazy"
                  decoding="async"
                />
                <span
                  className={`font-display text-4xl font-semibold leading-none tracking-tight text-white transition-all delay-100 duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:text-5xl md:text-6xl ${
                    isFooterVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                  }`}>
                  podman
                </span>
              </Link>
            </div>

            <p
              className={`mt-3 max-w-xs text-xs leading-relaxed text-white/80 transition-all delay-100 duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:translate-y-0 motion-reduce:opacity-100 dark:text-white/80 sm:text-sm ${
                isFooterVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
              A daemonless, open-source, Linux-native container engine for developing, managing, and running OCI
              Containers.
            </p>

            <div className="mt-4 flex items-center gap-4">
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className={`text-white/80 transition-all duration-150 hover:-translate-y-0.5 hover:text-white dark:text-white/80 dark:hover:text-white ${LINK_RESET}`}>
                  <Icon icon={social.icon} className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-7 lg:pt-1">
            {columns.map((col, idx) => (
              <div key={col.title ?? idx}>
                <h3 className="mb-2.5 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-purple-300 dark:text-purple-300">
                  {col.title}
                </h3>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {col.items.map((item, itemIdx) => (
                    <li key={item.label ?? itemIdx}>
                      <FooterLink item={item} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Foundation, Copyright & Legal */}
        <div className="mt-8 flex flex-col items-start gap-4 border-t border-white/15 pt-6 text-left">
          <a
            href="https://www.cncf.io/"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex shrink-0 items-center text-white transition-all delay-150 duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform hover:text-white hover:opacity-80 motion-reduce:translate-y-0 motion-reduce:opacity-100 dark:text-white dark:hover:text-white ${LINK_RESET} ${
              isFooterVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            title="Cloud Native Computing Foundation">
            <CncfWordmark className="h-11 w-auto max-w-full sm:h-12" />
          </a>

          <div className="flex w-full flex-col items-start justify-between gap-2.5 md:flex-row md:items-center">
            <p className="m-0 max-w-2xl text-xs leading-relaxed text-white/75 dark:text-white/75">
              Copyright © {CURRENT_YEAR} Podman Container Tools, a Series of LF Projects, LLC.
              <br />
              For website terms of use, trademark policy, and other project policies, please see the{' '}
              <a
                href="https://lfprojects.org/policies/"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs text-purple-300 transition-colors duration-150 hover:text-white dark:text-purple-300 dark:hover:text-white ${LINK_RESET}`}>
                LF Projects policies page
              </a>
              .
            </p>

            <a
              href="https://docusaurus.io/"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex shrink-0 items-center gap-1.5 text-xs text-white/75 transition-colors duration-150 hover:text-white dark:text-white/75 dark:hover:text-white ${LINK_RESET}`}>
              <Icon icon="simple-icons:docusaurus" className="h-4 w-4 text-white" aria-hidden="true" />
              <span>Built with Docusaurus</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
