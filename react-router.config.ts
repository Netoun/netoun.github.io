import type { Config } from "@react-router/dev/config";
import { EXPERIMENT_SLUGS } from "./app/features/labs/data/experiment-slugs";

export default {
  ssr: false,
  async prerender() {
    return ["/", "/labs", ...EXPERIMENT_SLUGS.map((slug) => `/labs/${slug}`)];
  },
} satisfies Config;
