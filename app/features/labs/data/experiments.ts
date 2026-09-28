import { computer3dExperiment } from "../experiments/computer-3d/computer-3d.experiment";
import { cyberneticGlyphGridExperiment } from "../experiments/cybernetic-glyph-grid/cybernetic-glyph-grid.experiment";
import { fakeConsoleExperiment } from "../experiments/fake-console/fake-console.experiment";
import { glitchSignalMapExperiment } from "../experiments/glitch-signal-map/glitch-signal-map.experiment";
import { grainShaderExperiment } from "../experiments/grain-shader/grain-shader.experiment";
import { meshBackgroundExperiment } from "../experiments/mesh-background/mesh-background.experiment";
import { projectCard3dExperiment } from "../experiments/project-card-3d/project-card-3d.experiment";
import { scrollMorphExperiment } from "../experiments/scroll-morph/scroll-morph.experiment";
import { serverUnit3dExperiment } from "../experiments/server-unit-3d/server-unit-3d.experiment";
import { systemMetricsExperiment } from "../experiments/system-metrics/system-metrics.experiment";
import type { LabExperiment, LabGroup } from "./labs.types";
import { LAB_GROUPS } from "./labs.types";
import { buildExperimentMeta, buildLabsIndexMeta } from "./labs-seo";
import {
  experimentStats,
  groupStats,
  labsStats,
  type LabExperimentStats,
  type LabGroupStats,
  type LabsStats,
} from "./labs-stats";
import { EXPERIMENT_SLUGS } from "./experiment-slugs";

import type { MetaDescriptor } from "./labs-seo";

const EXPERIMENTS: LabExperiment[] = [
  computer3dExperiment,
  serverUnit3dExperiment,
  projectCard3dExperiment,
  glitchSignalMapExperiment,
  cyberneticGlyphGridExperiment,
  fakeConsoleExperiment,
  systemMetricsExperiment,
  grainShaderExperiment,
  meshBackgroundExperiment,
  scrollMorphExperiment,
];

const EXPERIMENTS_BY_SLUG: Record<string, LabExperiment> = Object.fromEntries(
  EXPERIMENTS.map((experiment) => [experiment.slug, experiment]),
);

export interface LabGroupSection {
  group: LabGroup;
  experiments: LabExperiment[];
}

const GROUPED: LabGroupSection[] = LAB_GROUPS.map((group) => ({
  group,
  experiments: EXPERIMENTS.filter((experiment) => experiment.group === group),
})).filter((section) => section.experiments.length > 0);

// Counted once, from the `?raw` sources the code viewer shows.
const STATS_BY_SLUG: Record<string, LabExperimentStats> = Object.fromEntries(
  EXPERIMENTS.map((experiment, position) => [
    experiment.slug,
    experimentStats(experiment, position),
  ]),
);

const GROUP_STATS: LabGroupStats[] = GROUPED.map((section) =>
  groupStats(
    section.group,
    section.experiments.map((experiment) => STATS_BY_SLUG[experiment.slug]),
  ),
);

const TOTALS: LabsStats = labsStats(Object.values(STATS_BY_SLUG), GROUP_STATS);

export const labs = {
  slugs: EXPERIMENT_SLUGS,

  getAll(): readonly LabExperiment[] {
    return EXPERIMENTS;
  },

  getBySlug(slug: string | undefined): LabExperiment | undefined {
    if (!slug) return undefined;
    return EXPERIMENTS_BY_SLUG[slug];
  },

  getGrouped(): LabGroupSection[] {
    return GROUPED;
  },

  /** Registry position, files, lines and sizes of one experiment. */
  getStats(experiment: LabExperiment): LabExperimentStats {
    return STATS_BY_SLUG[experiment.slug];
  },

  /** One row per non-empty group, in `LAB_GROUPS` order. */
  getGroupStats(): readonly LabGroupStats[] {
    return GROUP_STATS;
  },

  getTotals(): LabsStats {
    return TOTALS;
  },

  buildMeta(experiment: LabExperiment): MetaDescriptor[] {
    return buildExperimentMeta(experiment);
  },

  buildIndexMeta(): MetaDescriptor[] {
    return buildLabsIndexMeta();
  },
};
