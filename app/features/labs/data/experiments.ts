import { computer3dExperiment } from "../experiments/computer-3d/computer-3d.experiment";
import { cyberneticGlyphGridExperiment } from "../experiments/cybernetic-glyph-grid/cybernetic-glyph-grid.experiment";
import { fakeConsoleExperiment } from "../experiments/fake-console/fake-console.experiment";
import { glitchSignalMapExperiment } from "../experiments/glitch-signal-map/glitch-signal-map.experiment";
import { grainShaderExperiment } from "../experiments/grain-shader/grain-shader.experiment";
import { kirbyExperiment } from "../experiments/kirby/kirby.experiment";
import { meshBackgroundExperiment } from "../experiments/mesh-background/mesh-background.experiment";
import { projectCard3dExperiment } from "../experiments/project-card-3d/project-card-3d.experiment";
import { scrollMorphExperiment } from "../experiments/scroll-morph/scroll-morph.experiment";
import { serverUnit3dExperiment } from "../experiments/server-unit-3d/server-unit-3d.experiment";
import { systemMetricsExperiment } from "../experiments/system-metrics/system-metrics.experiment";
import type { LabExperiment, LabGroup } from "./labs.types";
import { LAB_GROUPS } from "./labs.types";

// Ordered registry of every Labs experiment.
// Each experiment is self-contained in `../experiments/<slug>/` and exports its
// own descriptor; this file is the only place that assembles them.
export const EXPERIMENTS: LabExperiment[] = [
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
  kirbyExperiment,
];

export const EXPERIMENTS_BY_SLUG: Record<string, LabExperiment> = Object.fromEntries(
  EXPERIMENTS.map((experiment) => [experiment.slug, experiment]),
);

export function getExperiment(slug: string | undefined): LabExperiment | undefined {
  if (!slug) return undefined;
  return EXPERIMENTS_BY_SLUG[slug];
}

export interface LabGroupSection {
  group: LabGroup;
  experiments: LabExperiment[];
}

/** Experiments grouped by `group`, in `LAB_GROUPS` order, skipping empty groups. */
export function getGroupedExperiments(): LabGroupSection[] {
  return LAB_GROUPS.map((group) => ({
    group,
    experiments: EXPERIMENTS.filter((experiment) => experiment.group === group),
  })).filter((section) => section.experiments.length > 0);
}
