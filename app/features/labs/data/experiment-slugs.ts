// Single source of truth for Labs routing + static prerender.
// Kept dependency-free (plain strings only) so `react-router.config.ts` can
// import it at build time without pulling in React components or `?raw` assets.
export const EXPERIMENT_SLUGS = [
  "computer-3d",
  "server-unit-3d",
  "project-card-3d",
  "glitch-signal-map",
  "cybernetic-glyph-grid",
  "fake-console",
  "system-metrics",
  "grain-shader",
  "mesh-background",
  "scroll-morph",
  "kirby",
] as const;

export type ExperimentSlug = (typeof EXPERIMENT_SLUGS)[number];
