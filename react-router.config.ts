import { copyFile } from "node:fs/promises";
import path from "node:path";
import type { Config } from "@react-router/dev/config";
import { EXPERIMENT_SLUGS } from "./app/features/labs/data/experiment-slugs";

export default {
  ssr: false,
  async prerender() {
    return ["/", "/labs", ...EXPERIMENT_SLUGS.map((slug) => `/labs/${slug}`)];
  },
  // Cloudflare Pages answers a path it has no file for with the top-level `404.html`, status
  // 404. The SPA fallback renders any URL on the client (the root boundary for unknown paths,
  // the Labs page for an unknown slug) and hydrates without a mismatch, so it is that file.
  async buildEnd({ reactRouterConfig }) {
    const client = path.join(reactRouterConfig.buildDirectory, "client");
    await copyFile(path.join(client, "__spa-fallback.html"), path.join(client, "404.html"));
  },
} satisfies Config;
