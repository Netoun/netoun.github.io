import { describe, expect, it } from "vitest";
import { labs } from "../../data/experiments";
import { dockPosition, experimentNumber, groupDockEntries, stationOffset } from "./labs-dock";

const experiments = labs.getAll();
const last = experiments.length - 1;

describe("labs dock helpers", () => {
  it("numbers experiments by their place in the registry", () => {
    expect(experimentNumber(0)).toBe("_01");
    expect(experimentNumber(9)).toBe("_10");
  });

  it("groups the list like the registry, every experiment once", () => {
    const groups = groupDockEntries(experiments);
    expect(groups.map((section) => section.group)).toEqual(
      labs.getGrouped().map((section) => section.group),
    );
    const slugs = groups.flatMap((section) =>
      section.entries.map((entry) => entry.experiment.slug),
    );
    expect(slugs.toSorted()).toEqual(experiments.map((experiment) => experiment.slug).toSorted());
  });

  it("stands nowhere on the index: nothing lit, no neighbours", () => {
    expect(dockPosition(experiments, undefined)).toEqual({ current: -1, lit: 0 });
    expect(dockPosition(experiments, "not-an-experiment")).toEqual({ current: -1, lit: 0 });
  });

  it("does not wrap at either end", () => {
    const first = dockPosition(experiments, experiments[0].slug);
    expect(first).toMatchObject({ current: 0, lit: 0, previous: undefined });
    expect(first.next?.slug).toBe(experiments[1].slug);

    const end = dockPosition(experiments, experiments[last].slug);
    expect(end).toMatchObject({ current: last, lit: 1, next: undefined });
    expect(end.previous?.slug).toBe(experiments[last - 1].slug);
  });

  it("spreads the stations evenly along the track", () => {
    expect(stationOffset(0, 10)).toBe(0);
    expect(stationOffset(9, 10)).toBe(1);
    expect(stationOffset(0, 1)).toBe(0);
  });
});
