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
] as const;

export type ExperimentSlug = (typeof EXPERIMENT_SLUGS)[number];
