import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test-setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./app"),
      "@components": resolve(__dirname, "./app/components"),
      "@primitives": resolve(__dirname, "./app/components/primitives"),
      "@styles": resolve(__dirname, "./app/styles"),
    },
  },
});
