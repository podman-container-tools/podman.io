const CATEGORY_ORDER = [
  'Core CLI (Man Pages)',
  'Containers',
  'Pods & Kubernetes',
  'Images',
  'Networks & Volumes',
  'System & Machine',
  'Quadlet & Systemd',
  'Other Commands',
];

const CORE_COMMANDS = ['podman', 'podman-remote', 'podman-help', 'podman-version', 'podmansh'];

const CONTAINER_COMMANDS = [
  'podman-run',
  'podman-exec',
  'podman-ps',
  'podman-start',
  'podman-stop',
  'podman-restart',
  'podman-rm',
  'podman-kill',
  'podman-logs',
  'podman-inspect',
  'podman-top',
  'podman-stats',
  'podman-cp',
  'podman-attach',
  'podman-commit',
  'podman-create',
  'podman-diff',
  'podman-export',
  'podman-init',
  'podman-mount',
  'podman-unmount',
  'podman-pause',
  'podman-unpause',
  'podman-port',
  'podman-rename',
  'podman-update',
  'podman-wait',
  'podman-checkpoint',
  'podman-restore',
  'podman-generate',
  'podman-generate-spec',
];

const IMAGE_COMMANDS = [
  'podman-build',
  'podman-pull',
  'podman-push',
  'podman-images',
  'podman-rmi',
  'podman-tag',
  'podman-untag',
  'podman-save',
  'podman-load',
  'podman-import',
  'podman-history',
  'podman-search',
  'podman-login',
  'podman-logout',
];

const SYSTEM_COMMANDS = ['podman-info', 'podman-events', 'podman-completion', 'podman-unshare'];

const QUADLET_COMMANDS = ['podman-generate-systemd', 'podman-auto-update'];

const startsWithAny = (name, prefixes) => prefixes.some(prefix => name === prefix || name.startsWith(`${prefix}-`));

/**
 * Places each command in the group it is related to, based on what it manages.
 * Unknown future commands fall back to "Other Commands" so nothing is ever dropped.
 */
function categorizeCommand(title, section) {
  const name = title.toLowerCase();

  // Quadlet / systemd integration (all section 5 unit files, quadlet guides & commands)
  if (section === '5' || name.endsWith('.unit') || name.includes('quadlet') || QUADLET_COMMANDS.includes(name)) {
    return 'Quadlet & Systemd';
  }
  if (CORE_COMMANDS.includes(name)) return 'Core CLI (Man Pages)';
  if (startsWithAny(name, ['podman-pod', 'podman-kube', 'podman-compose']) || name === 'podman-play-kube') {
    return 'Pods & Kubernetes';
  }
  if (
    startsWithAny(name, ['podman-image', 'podman-manifest', 'podman-artifact', 'podman-farm']) ||
    IMAGE_COMMANDS.includes(name)
  ) {
    return 'Images';
  }
  if (startsWithAny(name, ['podman-network', 'podman-volume'])) return 'Networks & Volumes';
  if (startsWithAny(name, ['podman-container', 'podman-healthcheck']) || CONTAINER_COMMANDS.includes(name)) {
    return 'Containers';
  }
  if (startsWithAny(name, ['podman-system', 'podman-machine', 'podman-secret']) || SYSTEM_COMMANDS.includes(name)) {
    return 'System & Machine';
  }
  return 'Other Commands';
}

module.exports = {
  CATEGORY_ORDER,
  categorizeCommand,
};
