import type { LabExperiment, LabGroup } from "../../data/labs.types";
import { LAB_GROUPS } from "../../data/labs.types";

/** `_01`…: an experiment's number is its place in the registry. */
export function experimentNumber(position: number): string {
  return `_${String(position + 1).padStart(2, "0")}`;
}

export interface DockEntry {
  experiment: LabExperiment;
  /** `_01`… */
  number: string;
  /** Place in the registry, 0-based. */
  position: number;
  /** Place in the grouped list, 1-based: the rows type in in this order. */
  row: number;
}

export interface DockGroup {
  group: LabGroup;
  entries: DockEntry[];
}

/** The list, grouped in the sidebar's group order; empty groups are left out. */
export function groupDockEntries(experiments: readonly LabExperiment[]): DockGroup[] {
  let row = 0;
  const groups: DockGroup[] = [];
  for (const group of LAB_GROUPS) {
    const entries: DockEntry[] = [];
    experiments.forEach((experiment, position) => {
      if (experiment.group !== group) return;
      row += 1;
      entries.push({ experiment, number: experimentNumber(position), position, row });
    });
    if (entries.length > 0) groups.push({ group, entries });
  }
  return groups;
}

export interface DockPosition {
  /** Place of the current experiment, or `-1` on the index. */
  current: number;
  previous?: LabExperiment;
  next?: LabExperiment;
  /** How much of the track is lit, `0`–`1`: up to the current station, nothing on the index. */
  lit: number;
}

/** Where the dock stands: the list does not wrap, so the first has no previous, the last no next. */
export function dockPosition(
  experiments: readonly LabExperiment[],
  currentSlug: string | undefined,
): DockPosition {
  const current = currentSlug
    ? experiments.findIndex((experiment) => experiment.slug === currentSlug)
    : -1;
  if (current === -1) return { current: -1, lit: 0 };
  const last = experiments.length - 1;
  return {
    current,
    previous: current > 0 ? experiments[current - 1] : undefined,
    next: current < last ? experiments[current + 1] : undefined,
    lit: last > 0 ? current / last : 0,
  };
}

/** Where station `position` sits along the track, `0`–`1`. */
export function stationOffset(position: number, count: number): number {
  return count > 1 ? position / (count - 1) : 0;
}
