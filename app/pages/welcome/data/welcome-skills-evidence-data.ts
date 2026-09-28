import { experiences } from "@/features/experiences/data/experiences-data";
import { projects } from "@/features/projects/data/projects-data";
import type { EvidenceSource, SitePackages } from "@/features/skills/data/skills-data.types";

/**
 * Where the stack ships, for the Skills receipts: every project, every job (the company's stack
 * and its client projects'), every Lab. The page assembles it because business domains never
 * import each other; the Labs' tags come from the build so no demo ships with the home.
 */
export const skillEvidence: EvidenceSource[] = [
  ...projects.map((project) => ({
    kind: "project" as const,
    label: project.title,
    tags: project.tags,
  })),
  ...experiences.map((experience) => ({
    kind: "job" as const,
    label: experience.company,
    tags: [...experience.stack, ...experience.projects.flatMap((project) => project.stack)],
  })),
  ...Object.entries(__LAB_TAGS__).map(([slug, tags]) => ({
    kind: "lab" as const,
    label: slug,
    tags,
  })),
];

/** The site's own package.json, read at build time. */
export const sitePackages: SitePackages = __SITE_PACKAGES__;
