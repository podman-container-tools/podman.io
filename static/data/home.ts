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

const featureList = [
  {
    id: 'fast-and-light',
    title: 'Fast and light',
    icon: 'lucide:zap',
    description:
      "Daemonless, using the fastest technologies for a snappy experience. Our UI is reactive and light on resource usage and won't drag you down.",
    href: 'https://www.redhat.com/architect/hpc-containers-scale-using-podman',
  },
  {
    id: 'secure',
    title: 'Secure',
    icon: 'lucide:shield-check',
    description:
      'Rootless containers allow you to contain privileges without compromising functionality. Trusted by US government agencies for secure HPC at scale [case study](https://www.redhat.com/architect/hpc-containers-scale-using-podman). ',
    href: 'https://www.redhat.com/architect/hpc-containers-scale-using-podman',
  },
  {
    id: 'open',
    title: 'Open',
    icon: 'lucide:lock-open',
    description:
      "Podman is open source first and won't lock you in. Podman Desktop can be used as one tool to manage all your containers, regardless of container engine - even if you don't use Podman as your container engine.",
    href: 'https://developers.redhat.com/blog/2020/11/19/transitioning-from-docker-to-podman',
  },
  {
    id: 'compatible',
    title: 'Compatible',
    icon: 'lucide:blocks',
    description:
      'Compatible with other OCI compliant container formats including Docker. Run your legacy Docker containers (including docker-compose files) on Podman. [Learn more](https://developers.redhat.com/blog/2020/11/19/transitioning-from-docker-to-podman)',
    href: 'https://developers.redhat.com/blog/2020/11/19/transitioning-from-docker-to-podman',
  },
];

const kubernetesBanner = {
  title: 'Kubernetes Ready',
  description:
    'Create, start, inspect, and manage pods. Play Kubernetes YAML directly with Podman, generate Kubernetes YAML from pods, and deploy to existing Kubernetes environments.',
  icon: 'devicon:kubernetes',
  iconSize: 144,
};

const compatibleTools = {
  title: 'A growing set of compatible tools',
  tools: [
    {
      title: 'VS Code',
      description: 'Visual Studio Code includes Podman support',
      icon: 'logos:visual-studio-code',
      iconClassName: 'h-20 w-20',
    },
    {
      title: 'Cirrus',
      description: 'Cirrus CLI allows you to reproducibly run containerized tasks with Podman',
      icon: 'simple-icons:cirrusci',
      iconClassName: 'h-20 w-20 text-gray-900 dark:text-white',
    },
    {
      title: 'GitHub Actions',
      description: 'GitHub Actions include support for Podman, as well as friends buildah and skopeo',
      icon: 'fa6-brands:github',
      iconClassName: 'h-20 w-20 text-gray-900 dark:text-white',
    },
    {
      title: 'Kind',
      description: "Kind's ability to run local Kubernetes clusters via container nodes includes support for Podman",
      image: { path: 'logos/raw/kind-logo.png', alt: 'Kind Logo' },
    },
  ],
};

const coloringBook = {
  title: 'Have fun coloring and learn about Podman!',
  subtitle:
    "A decentralized team of open source container tool superheroes comes to the rescue when an asteroid storm threatens the planet. Learn about each tool—Podman, CRI-O, Buildah, Skopeo, and OpenShift—as they redesign the planet's protective shields' container deployment to protect Earth.",
  link: {
    text: 'Download',
    path: 'https://developers.redhat.com/e-books/container-commandos-coloring-book',
  },
  images: [
    {
      path: '#',
      altText: 'Container Commandos coloring book cover',
    },
    {
      path: '#',
      altText: 'Four examples of coloring book pages from the Container Commandos coloring book.',
    },
  ],
};

const containerTools = {
  text: 'Podman is one of a family of open source container tools',
  toolList: [
    {
      image: {
        path: '#',
        altText: 'Podman',
      },
      link: {
        text: 'podman.io',
        path: '#',
      },
    },
    {
      image: {
        path: '#',
        altText: 'Buildah',
      },
      link: {
        text: 'buildah.io',
        path: '#',
      },
    },
    {
      image: {
        path: '#',
        altText: 'Cri-o',
      },
      link: {
        text: 'cri-o.io',
        path: '#',
      },
    },
    {
      image: {
        path: '#',
        altText: 'Skopeo',
      },
      link: {
        text: 'github.com/containers/skopeo',
        path: '#',
      },
    },
  ],
};

export { header, featureList, kubernetesBanner, compatibleTools, coloringBook };
