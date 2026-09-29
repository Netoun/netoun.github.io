export const EXPERIMENT_SLUGS = [
  "computer-3d",
  "server-unit-3d",
  "chrome-capture",
  "glitch-signal-map",
  "cybernetic-glyph-grid",
  "fake-console",
  "system-metrics",
  "grain-shader",
  "mesh-background",
  "scroll-morph",
  "split-flap",
  "patch-bay",
  "ascii-raymarcher",
] as const;

export type ExperimentSlug = (typeof EXPERIMENT_SLUGS)[number];
