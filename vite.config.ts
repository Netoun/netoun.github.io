import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig, type Plugin } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

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

function sitemapPlugin(): Plugin {
  const slugs = [
    "computer-3d", "server-unit-3d", "project-card-3d",
    "glitch-signal-map", "cybernetic-glyph-grid", "fake-console",
    "system-metrics", "grain-shader", "mesh-background",
    "scroll-morph", "kirby",
  ];

  return {
    name: "generate-sitemap",
    buildStart() {
      const SITE_URL = "https://www.netoun.com";
      const pages = [
        { url: `${SITE_URL}/`, priority: "1.0" },
        { url: `${SITE_URL}/labs`, priority: "0.8" },
        ...slugs.map((s) => ({ url: `${SITE_URL}/labs/${s}`, priority: "0.6" })),
      ];
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${p.url}</loc>
    <changefreq>monthly</changefreq>
    <priority>${p.priority}</priority>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
      const publicDir = path.resolve(root, "public");
      fs.mkdirSync(publicDir, { recursive: true });
      fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
      console.log(`sitemap.xml generated with ${pages.length} URLs`);
    },
  };
}

export default defineConfig({
  plugins: [rawCssTsPlugin(), sitemapPlugin(), mdx(), reactRouter(), vanillaExtractPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(root, "app"),
      "@components": path.resolve(root, "app/components"),
      "@primitives": path.resolve(root, "app/components/primitives"),
      "@styles": path.resolve(root, "app/styles"),
    },
  },
  build: {
    cssMinify: "esbuild",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate vendor chunks for better caching
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/animejs")) {
            return "vendor-anime";
          }
        },
      },
    },
  },
});
