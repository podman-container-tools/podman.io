const fs = require('fs');
const path = require('path');

const FALLBACK_SLUGS = [
  'podman',
  'podman-run',
  'podman-build',
  'podman-exec',
  'podman-ps',
  'podman-images',
  'podman-pull',
  'podman-push',
  'podman-stop',
  'podman-rm',
  'podman-pod-create',
  'podman-pod-ps',
  'podman-kube-play',
  'podman-kube-generate',
  'podman-network-create',
  'podman-volume-create',
  'podman-machine-init',
  'podman-machine-start',
  'podman-system-prune',
  'podman-systemd.unit',
  'podman-troubleshooting',
  'podman-rootless',
];

/**
 * Registers static paths (/docs/commands/<slug>) for each command slug in
 * manifest.json so CLI docs use path-based deep links instead of ?cmd= query
 * parameters without emitting an invalid ":slug.html" filename in the build
 * artifact.
 */
module.exports = function cliDocsRoutesPlugin(context) {
  return {
    name: 'cli-docs-routes',
    async contentLoaded({ actions }) {
      const { addRoute } = actions;
      const component = '@site/src/components/RuntimeDocs/CommandsPage';
      const seen = new Set();

      const registerSlug = slug => {
        if (!slug || seen.has(slug)) return;
        seen.add(slug);
        addRoute({
          path: `/docs/commands/${encodeURIComponent(slug)}`,
          component,
          exact: true,
        });
      };

      const manifestPath = path.join(context.siteDir, 'static', 'data', 'cli-docs', 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        try {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
          for (const category of manifest.categories || []) {
            for (const item of category.items || []) {
              if (item && item.slug) {
                registerSlug(item.slug);
              }
            }
          }
        } catch {
          // Fall back to core command slugs below
        }
      }

      if (seen.size === 0) {
        FALLBACK_SLUGS.forEach(registerSlug);
      }
    },
  };
};
