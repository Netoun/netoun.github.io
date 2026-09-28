import type { FooterStatus } from "@/components/layouts/footer/footer.component";
import { EXPERIMENT_SLUGS, type ExperimentSlug } from "@/features/labs/data/experiment-slugs";
import { SITE_URL } from "@/features/labs/data/labs-seo";

// Everything the footer's status strip prints comes from the build or the site's own data.
export const footerStatus: FooterStatus = {
  host: new URL(SITE_URL).hostname.replace(/^www\./, ""),
  routes: __PRERENDERED_ROUTES__,
  buildDate: __BUILD_DATE__,
  commit: __BUILD_COMMIT__,
  sourceUrl: "https://github.com/netoun/netoun.github.io",
};

export const footerLabs = { href: "/labs/", count: EXPERIMENT_SLUGS.length };

const RACK_LAB: ExperimentSlug = "server-unit-3d";

/** The rack in the footer is this Lab's object. */
export const footerRackLabHref = `/labs/${RACK_LAB}/`;
