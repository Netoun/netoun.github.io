import type { FooterFile } from "@/components/layouts/footer/footer.component";
import { RESUME_HREF, RESUME_IS_PUBLISHED } from "@/features/site/data/resume.data";
import { EXPERIMENT_SLUGS, type ExperimentSlug } from "@/features/labs/data/experiment-slugs";

export const footerLabs = { href: "/labs/", count: EXPERIMENT_SLUGS.length };

const RACK_LAB: ExperimentSlug = "server-unit-3d";

/** The rack in the footer is this Lab's object. */
export const footerRackLabHref = `/labs/${RACK_LAB}/`;

/** The résumé on the plate, once it is published (resume.data.ts). */
export const footerResume: FooterFile | undefined = RESUME_IS_PUBLISHED
  ? {
      href: RESUME_HREF,
      label: "CV · résumé",
      format: "A4",
      detail: "One page, printed from this site's data",
    }
  : undefined;
