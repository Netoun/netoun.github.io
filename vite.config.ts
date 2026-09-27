/// <reference types="vitest/config" />
import fs from "node:fs";
import { reactRouter } from "@react-router/dev/vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig, type Plugin } from "vite";
import { EXPERIMENT_SLUGS } from "./app/features/labs/data/experiment-slugs.ts";

const SITE_URL = "https://www.netoun.com";

/**
 * Loads `*.css.ts?raw` imports as plain strings.
 *
 * The vanilla-extract plugin claims every `.css.ts` file regardless of the
 * `?raw` query (it strips the query before matching), so Vite's built-in raw
 * loader never runs. This pre-plugin resolves such imports to a query-less
 * virtual id that VE's `cssFileFilter` won't match, then returns the file's
 * source. Used by the Labs source viewer to display `.css.ts` styling.
 */
function rawCssTsPlugin(): Plugin {
  const PREFIX = "\0raw-css-ts:";
  const idToFile = new Map<string, string>();
  const fileToId = new Map<string, string>();
  let counter = 0;

  return {
    name: "raw-css-ts",
    enforce: "pre",
    async resolveId(source, importer) {
      if (!source.endsWith(".css.ts?raw")) return null;
      const resolved = await this.resolve(source.slice(0, -"?raw".length), importer, {
        skipSelf: true,
      });
      if (!resolved) return null;

      let id = fileToId.get(resolved.id);
      if (!id) {
        id = `${PREFIX}${counter++}`;
        fileToId.set(resolved.id, id);
        idToFile.set(id, resolved.id);
      }
      return id;
    },
    load(id) {
      const filePath = idToFile.get(id);
      if (!filePath) return null;
      const code = fs.readFileSync(filePath, "utf-8");
      return `export default ${JSON.stringify(code)};`;
    },
  };
}

/**
 * Emits `sitemap.xml` into the client build output (not `public/`), so builds
 * and typechecks never dirty the working tree. Routes mirror the prerender
 * list in `react-router.config.ts`.
 */
function sitemapPlugin(): Plugin {
  return {
    name: "generate-sitemap",
    apply: "build",
    generateBundle() {
      if (this.environment.name !== "client") return;

      const pages = [
        { url: `${SITE_URL}/`, priority: "1.0" },
        { url: `${SITE_URL}/labs`, priority: "0.8" },
        ...EXPERIMENT_SLUGS.map((slug) => ({ url: `${SITE_URL}/labs/${slug}`, priority: "0.6" })),
      ];
      const urls = pages
        .map(
          (page) => `  <url>
    <loc>${page.url}</loc>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
        )
        .join("\n");

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
      });
    },
  };
}

export default defineConfig({
  plugins: [
    rawCssTsPlugin(),
    sitemapPlugin(),
    // The React Router plugin replaces the app entry; Vitest must not load it.
    !process.env.VITEST && reactRouter(),
    vanillaExtractPlugin(),
  ],
  resolve: {
    // Aliases come from `tsconfig.json#compilerOptions.paths` (single source of truth).
    tsconfigPaths: true,
  },
  build: {
    rolldownOptions: {
      output: {
        // Long-lived vendor chunks for better caching across deploys.
        codeSplitting: {
          groups: [
            {
              name: "vendor-react",
              test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/,
            },
            { name: "vendor-anime", test: /node_modules[\\/]animejs[\\/]/ },
          ],
        },
      },
    },
  },
  // React Router prerenders through a Vite preview server and requests it over
  // IPv4. Where `localhost` resolves to ::1 first (e.g. Debian-based Docker
  // images), an unpinned host listens on IPv6 only and every prerender request
  // is refused.
  preview: { host: "127.0.0.1" },
  test: {
    environment: "happy-dom",
    setupFiles: ["./test-setup.ts"],
    globals: true,
  },
});
