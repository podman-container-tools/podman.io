// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'podman',
      label: 'Getting Started',
    },
    {
      type: 'doc',
      id: 'installation',
      label: 'Installation',
    },
    {
      type: 'doc',
      id: 'checkpoint',
      label: 'Checkpoint',
    },
    {
      type: 'link',
      label: 'Tutorials',
      href: 'https://docs.podman.io/en/latest/Tutorials.html',
    },
    {
      type: 'link',
      label: 'Documentation',
      href: 'https://docs.podman.io',
    },
    {
      type: 'link',
      label: 'Network',
      href: 'https://github.com/podman-container-tools/podman/blob/main/docs/tutorials/basic_networking.md',
    },
    {
      type: 'link',
      label: 'Podman Python',
      href: 'https://podman-py.readthedocs.io/en/latest/index.html',
    },
  ],
};
module.exports = sidebars;
