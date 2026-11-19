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
  'RSS Feed': 'material-symbols:rss-feed-rounded',
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
  {
    label: 'Podman Blog RSS Feed',
    href: 'https://blog.podman.io/feed/',
    icon: 'material-symbols:rss-feed-rounded',
  },
];

const CURRENT_YEAR = new Date().getFullYear();

function FooterLink({ item }: { item: FooterLinkItem }): JSX.Element {
  const { to, href, label, prependBaseUrlToHref, ...props } = item;
  const toUrl = useBaseUrl(to);
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });
  const iconName = label ? ITEM_ICONS[label] : undefined;

  return (
    <Link
      className="inline-flex items-center gap-2 text-sm text-white/90 no-underline hover:text-white/90 hover:no-underline dark:text-white/90 dark:hover:text-white/90"
      {...(href
        ? {
            href: prependBaseUrlToHref ? normalizedHref : href,
          }
        : {
            to: toUrl,
          })}
      {...props}>
      {iconName && <Icon icon={iconName} className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />}
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
    <footer className="bg-purple-700 text-white">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-12 sm:px-8 lg:px-10">
        {/* Top Section: Brand + Navigation Columns */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-white no-underline hover:text-white hover:no-underline dark:text-white dark:hover:text-white">
              <img
                src={podmanLogoUrl}
                alt="Podman Logo"
                width={42}
                height={40}
                className="h-10 w-auto"
                loading="lazy"
                decoding="async"
              />
              <span className="font-display text-2xl font-bold tracking-tight text-white">podman</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-purple-100/80 dark:text-purple-100/80">
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
                  className="text-white no-underline hover:text-white hover:no-underline dark:text-white dark:hover:text-white">
                  <Icon icon={social.icon} className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            {columns.map((col, idx) => (
              <div key={col.title ?? idx}>
                <h3 className="mb-4 font-display text-sm font-bold text-white dark:text-white">{col.title}</h3>
                <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
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
        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-10 gap-y-6 border-t border-white/15 py-7">
          <a
            href="https://www.cncf.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white no-underline hover:text-white hover:no-underline dark:text-white dark:hover:text-white"
            title="Cloud Native Computing Foundation">
            <CncfWordmark className="h-8 w-auto" />
          </a>

          <a
            href="https://lfx.linuxfoundation.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white no-underline hover:text-white hover:no-underline dark:text-white dark:hover:text-white"
            title="LFX - The Linux Foundation">
            <LfxWordmark className="h-7 w-auto" />
          </a>

          <a
            href="https://opencontainers.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white no-underline hover:text-white hover:no-underline dark:text-white dark:hover:text-white"
            title="Open Container Initiative">
            <OciWordmark className="h-8 w-auto" />
          </a>

          <a
            href="https://podman-desktop.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-white no-underline hover:text-white hover:no-underline dark:text-white dark:hover:text-white"
            title="Podman Desktop">
            <img
              src={podmanDesktopLogoUrl}
              alt="Podman Desktop"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
              loading="lazy"
              decoding="async"
            />
            <span className="font-display text-sm font-bold tracking-wide text-white">Podman Desktop</span>
          </a>
        </div>

        {/* Copyright & Legal */}
        <div className="flex flex-col items-center justify-between gap-3 pt-4 text-xs text-white/75 md:flex-row">
          <p className="m-0 text-center text-xs leading-normal text-white/75 dark:text-white/75 md:text-left">
            Copyright © {CURRENT_YEAR} Podman Container Tools, a Series of LF Projects, LLC.{' '}
            <a
              href="https://lfprojects.org/policies/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-300 no-underline hover:text-blue-300 hover:no-underline dark:text-blue-300 dark:hover:text-blue-300">
              LF Projects policies
            </a>
            .
          </p>
          <a
            href="https://docusaurus.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-white/75 no-underline hover:text-white/75 hover:no-underline dark:text-white/75 dark:hover:text-white/75">
            <Icon icon="simple-icons:docusaurus" className="h-4 w-4 text-white" aria-hidden="true" />
            <span>Built with Docusaurus</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
