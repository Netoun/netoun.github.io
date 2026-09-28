import { EXPERIMENT_SLUGS, type ExperimentSlug } from "@/features/labs/data/experiment-slugs";

export const footerLabs = { href: "/labs/", count: EXPERIMENT_SLUGS.length };

const RACK_LAB: ExperimentSlug = "server-unit-3d";

/** The rack in the footer is this Lab's object. */
export const footerRackLabHref = `/labs/${RACK_LAB}/`;
