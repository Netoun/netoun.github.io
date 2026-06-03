import fs from "node:fs";
import path from "node:path";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig, type Plugin } from "vite";

const root = import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname);

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

export default defineConfig({
  plugins: [rawCssTsPlugin(), mdx(), reactRouter(), vanillaExtractPlugin()],
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
