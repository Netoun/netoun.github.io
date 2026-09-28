import type { FooterStatus } from "@/components/layouts/footer/footer.component";
import { SITE_URL } from "./site";

// Everything the footer's status strip prints comes from the build or the site's own data.
export const siteStatus: FooterStatus = {
  host: new URL(SITE_URL).hostname.replace(/^www\./, ""),
  routes: __PRERENDERED_ROUTES__,
  buildDate: __BUILD_DATE__,
  commit: __BUILD_COMMIT__,
  sourceUrl: "https://github.com/netoun/netoun.github.io",
};
