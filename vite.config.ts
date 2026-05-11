import path from "node:path";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vite";

const root = import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  plugins: [mdx(), reactRouter(), vanillaExtractPlugin()],
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
