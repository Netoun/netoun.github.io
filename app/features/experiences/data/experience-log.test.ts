import { describe, expect, it } from "vitest";
import type { Experience } from "./experiences-data.types";
import {
  countDomains,
  formatDuration,
  formatYearMonth,
  logSummary,
  mainDomain,
  monthsBetween,
  toBranches,
  toLogGroups,
} from "./experience-log";
import { experiences } from "./experiences-data";

const NOW = "2026-09";

describe("dates", () => {
  it("counts whole months across years", () => {
    expect(monthsBetween("2021-07", "2026-09")).toBe(62);
    expect(monthsBetween("2019-07", "2021-07")).toBe(24);
    expect(monthsBetween("2021-07", "2021-07")).toBe(0);
  });

  it("prints durations like the log", () => {
    expect(formatDuration(62)).toBe("5Y 2M");
    expect(formatDuration(24)).toBe("2Y");
    expect(formatDuration(10)).toBe("10M");
    expect(formatDuration(0)).toBe("0M");
  });

  it("formats a month from the string, whatever the time zone", () => {
    expect(formatYearMonth("2017-09")).toBe("SEP 2017");
    expect(formatYearMonth("2021-01")).toBe("JAN 2021");
  });
});

describe("domains", () => {
  it("counts tags with the tag primitive's map and ignores tooling", () => {
    expect(countDomains(["React", "NestJS", "WebGL", "AI", "Vite"])).toEqual({
      frontend: 1,
      backend: 1,
      creative: 1,
      systems: 1,
    });
  });

  it("breaks ties frontend → backend → creative → systems", () => {
    expect(mainDomain({ frontend: 2, backend: 2, creative: 0, systems: 0 })).toBe("frontend");
    expect(mainDomain({ frontend: 0, backend: 3, creative: 3, systems: 0 })).toBe("backend");
    expect(mainDomain({ frontend: 1, backend: 0, creative: 4, systems: 4 })).toBe("creative");
    expect(mainDomain({ frontend: 1, backend: 0, creative: 0, systems: 4 })).toBe("systems");
  });
});

describe("toBranches", () => {
  const branches = toBranches(experiences, NOW);

  it("lists employers newest first, the current one open", () => {
    expect(branches.map((branch) => branch.slug)).toEqual(["lonestone", "easilys", "sogeti"]);
    expect(branches.map((branch) => branch.isOpen)).toEqual([true, false, false]);
    expect(branches[0].endLabel).toBe("NOW");
  });

  it("derives tenures from the dates and today's month", () => {
    expect(branches.map((branch) => branch.duration)).toEqual(["5Y 2M", "2Y", "1Y 10M"]);
    expect(branches.map((branch) => branch.tenureSegments)).toEqual([31, 12, 11]);
  });

  it("colours each lane by the main domain of what shipped there", () => {
    expect(branches.map((branch) => branch.domain)).toEqual(["backend", "frontend", "systems"]);
    expect(branches[0].mix).toEqual({ frontend: 6, backend: 11, creative: 0, systems: 2 });
    expect(branches[0].commits.map((commit) => commit.domain)).toEqual([
      "backend",
      "frontend",
      "backend",
      "backend",
    ]);
  });

  it("keeps the unlisted client work as a flag, never as a commit", () => {
    expect(branches[0].moreProjects).toBe(true);
    expect(branches[0].commits.map((commit) => commit.title)).not.toContain("… and many more");
  });
});

describe("toLogGroups", () => {
  const groups = toLogGroups(toBranches(experiences, NOW));
  const kinds = groups.map((group) => group.rows.map((row) => row.kind));

  it("prints the rows git log --graph would print", () => {
    expect(kinds).toEqual([
      ["tip", "commit", "commit", "commit", "commit", "elided", "fork"],
      ["merge", "merge-in", "tip", "fork"],
      ["merge", "merge-in", "tip", "fork", "root"],
    ]);
  });

  it("points HEAD at the open branch and main at its latest merge", () => {
    const [head] = groups[0].rows;
    const merge = groups[1].rows[0];
    expect(head.kind === "tip" && head.refs).toEqual([
      { label: "HEAD -> lonestone", kind: "head" },
    ]);
    expect(merge.kind === "merge" && merge.refs).toEqual([
      { label: "main", kind: "main" },
      { label: "tag: 2021-07", kind: "tag" },
    ]);
  });

  it("dashes main above its latest merge, then runs it solid to the root", () => {
    expect(groups.map((group) => group.main)).toEqual(["behind", "tip", "solid"]);
    expect(groups.map((group) => group.endsAtRoot)).toEqual([false, false, true]);
  });

  it("gives every printed commit a stable, distinct 7-character hash", () => {
    const hashes = groups.flatMap((group) =>
      group.rows.flatMap((row) => ("hash" in row ? [row.hash] : [])),
    );
    expect(hashes).toHaveLength(10);
    expect(new Set(hashes).size).toBe(hashes.length);
    for (const hash of hashes) expect(hash).toMatch(/^[0-9a-f]{7}$/);
    expect(toLogGroups(toBranches(experiences, NOW))).toEqual(groups);
  });

  it("puts HEAD on main when nothing is open", () => {
    const closed: Experience[] = experiences.map((experience) => ({
      ...experience,
      end: experience.end ?? "2026-01",
    }));
    const [first] = toLogGroups(toBranches(closed, NOW));
    expect(first.main).toBe("start");
    expect(first.rows[0]).toMatchObject({
      kind: "merge",
      refs: [
        { label: "HEAD -> main", kind: "head" },
        { label: "tag: 2026-01", kind: "tag" },
      ],
    });
  });
});

describe("logSummary", () => {
  it("counts from the first job to today", () => {
    expect(logSummary(toBranches(experiences, NOW), NOW)).toEqual({
      since: "SEP 2017",
      total: "9Y",
      branches: 3,
      merged: 2,
    });
  });
});
