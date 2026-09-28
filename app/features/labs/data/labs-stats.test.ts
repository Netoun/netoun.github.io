import { describe, expect, it } from "vitest";
import { labs } from "./experiments";
import { countLines, groupDir, isInkSpecimen, treeSize } from "./labs-stats";

describe("labs stats helpers", () => {
  it("counts lines the way wc -l does", () => {
    expect(countLines("")).toBe(0);
    expect(countLines("a")).toBe(1);
    expect(countLines("a\n")).toBe(1);
    expect(countLines("a\nb\n")).toBe(2);
    expect(countLines("a\nb")).toBe(2);
  });

  it("prints sizes the way tree -h does", () => {
    expect(treeSize(974)).toBe("974");
    expect(treeSize(1024)).toBe("1.0K");
    expect(treeSize(2693)).toBe("2.6K");
    expect(treeSize(10_624)).toBe("10K");
    expect(treeSize(37_647)).toBe("37K");
    expect(treeSize(154_499)).toBe("151K");
    expect(treeSize(3 * 1024 * 1024)).toBe("3.0M");
  });

  it("names group directories as paths", () => {
    expect(groupDir("3D CSS")).toBe("3d-css");
    expect(groupDir("HUD")).toBe("hud");
    expect(groupDir("Shaders")).toBe("shaders");
  });

  it("puts HUD and shader specimens on ink, the rest on paper", () => {
    expect(isInkSpecimen("HUD")).toBe(true);
    expect(isInkSpecimen("Shaders")).toBe(true);
    expect(isInkSpecimen("3D CSS")).toBe(false);
    expect(isInkSpecimen("Scroll")).toBe(false);
  });
});

describe("labs registry stats", () => {
  const experiments = labs.getAll();

  it("numbers experiments in registry order", () => {
    expect(experiments.map((experiment) => labs.getStats(experiment).index)).toEqual(
      experiments.map((_, position) => String(position + 1).padStart(2, "0")),
    );
  });

  it("counts every source file once", () => {
    for (const experiment of experiments) {
      const stats = labs.getStats(experiment);
      expect(stats.files).toBe(experiment.sources.length);
      expect(stats.lines).toBe(
        experiment.sources.reduce((sum, source) => sum + countLines(source.code), 0),
      );
      expect(stats.sources.every((source) => source.lines > 0 && source.bytes > 0)).toBe(true);
    }
  });

  it("adds up to the totals, as tree -d counts directories", () => {
    const totals = labs.getTotals();
    const groups = labs.getGroupStats();

    expect(totals.experiments).toBe(experiments.length);
    expect(totals.directories).toBe(groups.length + experiments.length);
    expect(groups.reduce((sum, group) => sum + group.experiments, 0)).toBe(experiments.length);
    expect(groups.reduce((sum, group) => sum + group.lines, 0)).toBe(totals.lines);
    expect(groups.reduce((sum, group) => sum + group.bytes, 0)).toBe(totals.bytes);
    expect(totals.files).toBe(
      experiments.reduce((sum, experiment) => sum + experiment.sources.length, 0),
    );
  });
});
