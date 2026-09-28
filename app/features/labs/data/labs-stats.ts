import type { LabExperiment, LabGroup } from "./labs.types";

// Everything the Labs index prints about the experiments is counted here, from the `?raw`
// sources themselves: nothing is typed by hand, so a changed file changes the index.

export interface LabSourceStats {
  label: string;
  lang: string;
  lines: number;
  bytes: number;
  /** The size as `tree -h` prints it (`974`, `2.5K`, `26K`). */
  size: string;
}

export interface LabExperimentStats {
  /** Registry order, zero-padded: `01`…`10`. */
  index: string;
  /** The group's directory in `~/labs` (`3d-css`). */
  dir: string;
  sources: LabSourceStats[];
  files: number;
  lines: number;
  bytes: number;
  size: string;
}

export interface LabGroupStats {
  group: LabGroup;
  dir: string;
  experiments: number;
  lines: number;
  bytes: number;
  size: string;
}

export interface LabsStats {
  experiments: number;
  /** Group directories plus one directory per experiment, as `tree -d` counts them. */
  directories: number;
  files: number;
  lines: number;
  bytes: number;
  size: string;
}

const encoder = new TextEncoder();

/** Lines as `wc -l` would print them for a file that ends with a newline. */
export function countLines(code: string): number {
  if (code.length === 0) return 0;
  const breaks = code.split("\n").length - 1;
  return code.endsWith("\n") ? breaks : breaks + 1;
}

/** `tree -h`: base 1024, one decimal under ten units, bare bytes under 1K. */
export function treeSize(bytes: number): string {
  if (bytes < 1024) return String(bytes);
  let value = bytes;
  for (const unit of ["K", "M", "G"]) {
    value /= 1024;
    if (value < 1024 || unit === "G") {
      return value < 9.95 ? `${value.toFixed(1)}${unit}` : `${Math.round(value)}${unit}`;
    }
  }
  return String(bytes);
}

/** `"3D CSS"` → `3d-css`. */
export function groupDir(group: LabGroup): string {
  return group.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
}

/** HUD widgets and shaders paint their own dark ground; CSS-3D objects sit on paper. */
export function isInkSpecimen(group: LabGroup): boolean {
  return group === "HUD" || group === "Shaders";
}

export function experimentStats(experiment: LabExperiment, position: number): LabExperimentStats {
  const sources = experiment.sources.map((source) => {
    const bytes = encoder.encode(source.code).length;
    return {
      label: source.label,
      lang: source.lang,
      lines: countLines(source.code),
      bytes,
      size: treeSize(bytes),
    };
  });
  const bytes = sources.reduce((sum, source) => sum + source.bytes, 0);

  return {
    index: String(position + 1).padStart(2, "0"),
    dir: groupDir(experiment.group),
    sources,
    files: sources.length,
    lines: sources.reduce((sum, source) => sum + source.lines, 0),
    bytes,
    size: treeSize(bytes),
  };
}

export function groupStats(
  group: LabGroup,
  experiments: readonly LabExperimentStats[],
): LabGroupStats {
  const bytes = experiments.reduce((sum, experiment) => sum + experiment.bytes, 0);
  return {
    group,
    dir: groupDir(group),
    experiments: experiments.length,
    lines: experiments.reduce((sum, experiment) => sum + experiment.lines, 0),
    bytes,
    size: treeSize(bytes),
  };
}

export function labsStats(
  experiments: readonly LabExperimentStats[],
  groups: readonly LabGroupStats[],
): LabsStats {
  const bytes = experiments.reduce((sum, experiment) => sum + experiment.bytes, 0);
  return {
    experiments: experiments.length,
    directories: groups.length + experiments.length,
    files: experiments.reduce((sum, experiment) => sum + experiment.files, 0),
    lines: experiments.reduce((sum, experiment) => sum + experiment.lines, 0),
    bytes,
    size: treeSize(bytes),
  };
}
