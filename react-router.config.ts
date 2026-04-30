import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  // return a list of URLs to prerender at build time
  async prerender() {
    return ["/", "/projects"];
  },
} satisfies Config;
