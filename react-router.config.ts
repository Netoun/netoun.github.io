import type { Config } from "@react-router/dev/config";
import { EXPERIMENT_SLUGS } from "./app/features/labs/data/experiment-slugs";

export default {
  ssr: false,
  // Return the list of URLs to prerender at build time.
  // Labs experiment routes are derived from the slug registry so they stay in sync.
  async prerender() {
    return ["/", "/labs", ...EXPERIMENT_SLUGS.map((slug) => `/labs/${slug}`)];
  },
} satisfies Config;
