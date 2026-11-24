import { LATEST_VERSION, LATEST_DESKTOP_VERSION, LATEST_DESKTOP_DOWNLOAD_URL } from './global';

const header = {
  title: 'The best free & open source container tools',
  subtitle:
    'Manage containers, pods, and images with Podman. Seamlessly work with containers and Kubernetes from your local environment.',
  image: {
    path: 'images/optimized/podman-ui-1200w-646h.webp',
    alt: 'Two screenshots of the Podman Desktop user interface',
  },
  podmanrelease: {
    text: LATEST_VERSION,
    path: 'https://github.com/containers/podman/releases',
  },
  desktoprelease: {
    text: LATEST_DESKTOP_VERSION,
    path: LATEST_DESKTOP_DOWNLOAD_URL,
  },
  platforms: [
    'Supported Platforms',
    'fa6-brands:redhat',
    'fa6-brands:apple',
    'fa6-brands:microsoft',
    'fa6-brands:linux',
  ],
};

export { header };
