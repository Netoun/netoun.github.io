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
    return LAB_GROUPS.map((group) => ({
      group,
      experiments: EXPERIMENTS.filter((experiment) => experiment.group === group),
    })).filter((section) => section.experiments.length > 0);
  },

  buildMeta(experiment: LabExperiment): MetaDescriptor[] {
    return buildExperimentMeta(experiment);
  },

  buildIndexMeta(): MetaDescriptor[] {
    return buildLabsIndexMeta();
  },
};
