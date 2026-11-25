const tabData = [
  {
    label: 'Find',
    title: 'Find and pull down containers no matter where they are.',
    commands: ['podman search', 'podman pull'],
    description:
      'Find and pull down containers whether they are on dockerhub.io or quay.io, an internal registry server, or direct from a vendor.',
    image: {
      src: 'images/optimized/cli-screens/cli-find-image.webp',
      alt: 'example of podman commands',
    },
  },
  {
    label: 'Run',
    title: 'Run pre-built application or distro containers.',
    commands: ['podman run'],
    description:
      'Run containers using images pulled from a registry, or from images you build yourself. Podman lets you run containers as a regular user or as root.',
    image: {
      src: 'images/optimized/cli-screens/cli-run-image.webp',
      alt: 'example of podman commands',
    },
  },
  {
    label: 'Build',
    title: 'Build container images from a Containerfile.',
    commands: ['podman build'],
    description:
      'Build OCI and Docker-compatible container images using a Containerfile or Dockerfile — no daemon required.',
    image: {
      src: 'images/optimized/cli-screens/cli-build-image.webp',
      alt: 'example of podman commands',
    },
  },
  {
    label: 'Share',
    title: "Share the containers you've built.",
    commands: ['podman push'],
    description:
      'Podman lets you push your newly-built containers anywhere you want with a single podman push command.',
    image: {
      src: 'images/optimized/cli-screens/cli-share-image.webp',
      alt: 'example of podman commands',
    },
  },
];

export default tabData;
