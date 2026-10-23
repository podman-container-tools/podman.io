const header = {
  title: 'Podman Features',
  subtitle:
    'Podman is an open source container, pod, and container image management engine. Podman makes it easy to find, run, build, and share containers.',
  image: {
    path: 'images/optimized/podman-2-196w-172h.webp',
    alt: 'Podman Seal Image',
  },
};

const knowPodman = {
  title: 'Getting to know Podman',
  cards: [
    {
      title: 'Quick dive into Podman',
      description:
        "Hop on over to our [Docs](/docs) and we'll lead you through the basic Podman commands Guide and give you pointers to more learning materials and guides.",
      image: {
        path: 'images/optimized/characters/seal-diving-276w-226h.webp',
        alt: 'A seal diving into the water',
      },
    },
    {
      title: "Join Podman's Community",
      description:
        'Podman has an active chat and mailing list, and regular open community meetings. Users and aspiring contributors are most welcome in all of these venues. Join us!',
      image: {
        path: 'images/optimized/characters/seals-swimming-205w-238h.webp',
        alt: 'A group of seals swimming.',
      },
    },
    {
      title: 'Need some help?',
      description:
        'Check out the [Podman Troubleshooting Guide](https://github.com/containers/podman/blob/main/troubleshooting.md), search our [Documentation](https://docs.podman.io), or file an issue in our [issue tracker](https://github.com/containers/podman/issues).',
      image: {
        path: 'images/optimized/characters/confused-seal-231w-248h.webp',
        alt: 'A confused seal.',
      },
    },
  ],
};

const carouselContent = [
  {
    title: 'Find',
    commands: ['podman search', 'podman pull'],
    subtitle: 'Find and pull down containers no matter what they are',
    description:
      'Find and pull down containers whether they are on dockerhub.io or quay.io, an internal registry server, or direct from a vendor.',
    image: {
      path: 'images/optimized/cli-screens/cli-find-image.webp',
      alt: 'A screenshot of the commandline while using the search and pull commands',
    },
  },
  {
    title: 'Run',
    commands: ['podman run'],
    subtitle: 'Run pre-built application or distro containers.',
    description:
      'Find and pull down containers whether they are on dockerhub.io or quay.io, an internal registry server, or direct from a vendor.',
    image: {
      path: 'images/optimized/cli-screens/cli-run-image.webp',
      alt: 'A screenshot of the commandline while using the run command',
    },
  },
  {
    title: 'Build',
    commands: ['podman build'],
    subtitle: 'Podman Troubleshooting Guide',
    description: 'Creating new layers with small tweaks or major overhauls is easy with podman build',
    image: {
      path: 'images/optimized/cli-screens/cli-build-image.webp',
      alt: 'A screenshot of the commandline while using the build command',
    },
  },
  {
    title: 'Share',
    commands: ['podman push'],
    subtitle: "Share the containers you've built",
    description:
      'Podman lets you push your newly-built containers anywhere you want with a single podman push command.',
    image: {
      path: 'images/optimized/cli-screens/cli-share-image.webp',
      alt: 'A screenshot of the commandline while using the push command',
    },
  },
];
const learnMore = {
  title: 'Want to learn more?',
  blogPosts: {
    title: 'Recent Podman Blog Posts',
  },
};

export { header, knowPodman, carouselContent, learnMore };
