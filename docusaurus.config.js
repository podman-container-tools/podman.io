// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Podman',
  tagline:
    'Podman is a daemonless container engine for developing, managing, and running OCI Containers on your Linux System',
  url: 'https://podman.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'favicon.ico',
  trailingSlash: false,
  deploymentBranch: 'gh-pages',
  organizationName: 'containers',
  projectName: 'containers.github.io',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  plugins: [
    '@docusaurus/theme-live-codeblock',
    async function tailwindPlugin() {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(require('tailwindcss'));
          postcssOptions.plugins.push(require('autoprefixer'));
          return postcssOptions;
        },
      };
    },
    [
      '@docusaurus/plugin-content-blog',
      {
        showReadingTime: true,
        routeBasePath: 'release',
        id: 'release-anouncements',
        path: './release',
      },
    ],
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          path: 'docs',
          editUrl: 'https://github.com/containers/podman.io/tree/main',
        },
        blog: {
          showReadingTime: true,
          routeBasePath: 'blogs',
        },
        theme: {
          customCss: require.resolve('./src/css/main.css'),
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        hideOnScroll: true,

        title: 'podman',
        logo: {
          alt: 'Podman Logo',
          src: 'logos/optimized/podman-3-logo-266w-253h.webp',
        },
        items: [
          { to: 'features', label: 'Features', position: 'right' },
          { to: 'get-started', label: 'Get Started', position: 'right' },
          {
            type: 'dropdown',
            label: 'Community',
            position: 'right',
            items: [
              {
                label: 'Community',
                to: 'community',
                exact: true,
                activeBaseRegex: '^/community/?$',
              },
              {
                label: 'Meetings Archive',
                to: 'community/meetings',
                exact: true,
                activeBaseRegex: '^/community/meetings/?$',
              },
            ],
          },
          {
            to: 'https://blog.podman.io',
            target: '_self',
            label: 'Development Blog',
            position: 'right',
          },
          {
            type: 'doc',
            docId: 'podman',
            label: 'Documentation',
            position: 'right',
          },

          {
            to: 'https://github.com/containers/',
            target: '_self',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Installation Instructions',
                to: 'docs/installation',
              },
              {
                label: 'Documentation',
                to: 'docs/',
              },

              {
                label: 'Podman CLI Commands',
                href: 'https://docs.podman.io/en/latest/Commands.html',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Matrix',
                href: 'https://matrix.to/#/#podman:fedoraproject.org',
              },
              {
                label: 'Discord',
                href: 'https://discord.com/invite/x5GzFF6QH4',
              },
              {
                label: 'Blog',
                href: 'https://blog.podman.io/',
              },
              {
                label: 'Mailing List',
                href: 'https://lists.podman.io',
              },
              {
                label: 'RSS Feed',
                href: 'https://blog.podman.io/feed/',
              },
            ],
          },
          {
            title: 'Projects',
            items: [
              {
                label: 'Podman GitHub',
                href: 'https://github.com/podman-container-tools/podman',
              },
              {
                label: 'Podman Desktop GitHub',
                href: 'https://github.com/podman-desktop/podman-desktop',
              },
              {
                label: 'Podman Website GitHub',
                href: 'https://github.com/containers/podman.io',
              },
              {
                label: 'Podman Desktop Website',
                href: 'https://podman-desktop.io/',
              },
            ],
          },
        ],
        copyright: `<p>Copyright © ${new Date().getFullYear()} Podman Container Tools, a Series of LF Projects, LLC. Built with Docusaurus.</p><p>For website terms of use, trademark policy, and other project policies, please see the <a href="https://lfprojects.org/policies/">LF Projects policies page</a>.</p>`,
      },

      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      liveCodeBlock: {
        playgroundPosition: 'bottom',
      },
    }),
};

module.exports = config;
