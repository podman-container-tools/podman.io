import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useThemeConfig, type FooterLinkItem } from '@docusaurus/theme-common';
import { Icon } from '@iconify/react';
import { CncfWordmark, LfxWordmark, OciWordmark } from './FooterLogos';

const ITEM_ICONS: Record<string, string> = {
  'Installation Instructions': 'material-symbols:download-rounded',
  Documentation: 'material-symbols:menu-book-outline-rounded',
  Matrix: 'simple-icons:matrix',
  Discord: 'simple-icons:discord',
  Blog: 'material-symbols:article-outline-rounded',
  'Mailing List': 'material-symbols:mail-outline-rounded',
  'Podman GitHub': 'simple-icons:github',
  'Podman Desktop GitHub': 'simple-icons:github',
  'Podman Website GitHub': 'simple-icons:github',
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
  const podmanDesktopLogoUrl = useBaseUrl('logos/optimized/podman-desktop-logo-200w-198h.webp');

  if (!footer) {
    return null;
  }

  const rawLinks: Array<FooterLinkItem | { title?: string; items: FooterLinkItem[] }> = footer.links ?? [];
  const columns = rawLinks.filter((col): col is { title?: string; items: FooterLinkItem[] } => 'items' in col);

  return (
    <footer className="border-t border-white/20 bg-purple-700 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-10 sm:px-8 sm:pt-14 lg:px-10">
        {/* Top Section: Brand & Navigation Columns */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Link
              to="/"
              className={`inline-flex items-center gap-3 text-white hover:text-white dark:text-white dark:hover:text-white sm:gap-3.5 ${LINK_RESET}`}>
              <img
                src={podmanLogoUrl}
                alt="Podman Logo"
                width={67}
                height={64}
                className="h-14 w-auto sm:h-16"
                loading="lazy"
                decoding="async"
              />
              <span className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">podman</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80 dark:text-white/80">
              A daemonless, open-source, Linux-native container engine for developing, managing, and running OCI
              Containers.
            </p>

            <div className="mt-5 flex items-center gap-4">
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className={`text-white/80 transition-all duration-150 hover:-translate-y-0.5 hover:text-white dark:text-white/80 dark:hover:text-white ${LINK_RESET}`}>
                  <Icon icon={social.icon} className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-7 lg:pt-2">
            {columns.map((col, idx) => (
              <div key={col.title ?? idx}>
                <h3 className="mb-4 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-purple-300 dark:text-purple-300">
                  {col.title}
                </h3>
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
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

        {/* Foundation & Ecosystem Logos */}
        <div className="mt-10 grid grid-cols-1 gap-6 border-b border-white/15 py-7 sm:mt-12 sm:grid-cols-2 sm:py-8 lg:flex lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-10 lg:gap-y-6">
          <a
            href="https://www.cncf.io/"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center text-white transition-opacity duration-150 hover:text-white hover:opacity-80 dark:text-white dark:hover:text-white ${LINK_RESET}`}
            title="Cloud Native Computing Foundation">
            <CncfWordmark className="h-9 w-auto max-w-full sm:h-10" />
          </a>

          <a
            href="https://lfx.linuxfoundation.org/"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center text-white transition-opacity duration-150 hover:text-white hover:opacity-80 dark:text-white dark:hover:text-white ${LINK_RESET}`}
            title="LFX - The Linux Foundation">
            <LfxWordmark className="h-6 w-auto max-w-full sm:h-7" />
          </a>

          <a
            href="https://opencontainers.org/"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center text-white transition-opacity duration-150 hover:text-white hover:opacity-80 dark:text-white dark:hover:text-white ${LINK_RESET}`}
            title="Open Container Initiative">
            <OciWordmark className="h-9 w-auto max-w-full sm:h-10" />
          </a>

          <a
            href="https://podman-desktop.io/"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-3 text-white transition-opacity duration-150 hover:text-white hover:opacity-80 dark:text-white dark:hover:text-white ${LINK_RESET}`}
            title="Podman Desktop">
            <img
              src={podmanDesktopLogoUrl}
              alt="Podman Desktop"
              width={40}
              height={40}
              className="h-9 w-9 object-contain sm:h-10 sm:w-10"
              loading="lazy"
              decoding="async"
            />
            <span className="font-display text-[15px] font-semibold tracking-wide text-white">Podman Desktop</span>
          </a>
        </div>

        {/* Copyright & Legal */}
        <div className="flex flex-col items-center justify-between gap-3 pt-6 text-center text-xs text-white/75 md:flex-row md:text-left">
          <p className="m-0 text-center text-xs leading-normal text-white/75 dark:text-white/75 md:text-left">
            Copyright © {CURRENT_YEAR} Podman Container Tools, a Series of LF Projects, LLC.{' '}
            <a
              href="https://lfprojects.org/policies/"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs text-purple-300 transition-colors duration-150 hover:text-white dark:text-purple-300 dark:hover:text-white ${LINK_RESET}`}>
              LF Projects policies
            </a>
            .
          </p>
          <a
            href="https://docusaurus.io/"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-xs text-white/75 transition-colors duration-150 hover:text-white dark:text-white/75 dark:hover:text-white ${LINK_RESET}`}>
            <Icon icon="simple-icons:docusaurus" className="h-4 w-4 text-white" aria-hidden="true" />
            <span>Built with Docusaurus</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
