const fs = require('fs');
const path = require('path');

/**
 * Registers /docs/commands/:slug and static paths for each known command slug
 * in manifest.json so CLI docs use path-based deep links instead of ?cmd=
 * query parameters and work on direct page load / static hosting.
 */
module.exports = function cliDocsRoutesPlugin(context) {
  return {
    name: 'cli-docs-routes',
    async contentLoaded({ actions }) {
      const { addRoute } = actions;
      const component = '@site/src/components/RuntimeDocs/CommandsPage';

      addRoute({
        path: '/docs/commands/:slug',
        component,
        exact: true,
      });

      const manifestPath = path.join(context.siteDir, 'static', 'data', 'cli-docs', 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        try {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
          const seen = new Set();
          for (const category of manifest.categories || []) {
            for (const item of category.items || []) {
              if (item && item.slug && !seen.has(item.slug)) {
                seen.add(item.slug);
                addRoute({
                  path: `/docs/commands/${encodeURIComponent(item.slug)}`,
                  component,
                  exact: true,
                });
              }
            }
          }
        } catch {
          // Ignore malformed manifest; dynamic route remains registered
        }
      }
    },
  };
};
