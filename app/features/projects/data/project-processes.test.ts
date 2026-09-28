import { describe, expect, it } from "vitest";
import type { Project } from "./projects-data.types";
import {
  countDomains,
  DEFAULT_SORT,
  formatMonth,
  monitorStats,
  nextSort,
  sortProcesses,
  toAddress,
  toProcesses,
  toStatus,
} from "./project-processes";
import { projects } from "./projects-data";

const project = (overrides: Partial<Project>): Project => ({
  slug: "sample",
  title: "Sample",
  description: "",
  date: "2026-01-01",
  tags: [],
  image: "/images/projects/sample.webp",
  url: "https://example.com",
  ...overrides,
});

describe("toAddress / toStatus", () => {
  it("drops the scheme and trailing slashes", () => {
    expect(toAddress("https://r-noise-map.vercel.app/")).toBe("r-noise-map.vercel.app");
    expect(toAddress("https://github.com/lonestone/nzoth")).toBe("github.com/lonestone/nzoth");
  });

  it("reads a GitHub repository as source and anything else as live", () => {
    expect(toStatus("github.com/lonestone/nzoth")).toBe("source");
    expect(toStatus("communile.fr")).toBe("live");
    expect(toStatus("github.community")).toBe("live");
  });
});

describe("formatMonth", () => {
  it("formats date-only strings in UTC, whatever the visitor's offset", () => {
    expect(formatMonth("2025-11-01")).toBe("NOV 2025");
    expect(formatMonth("2025-06-01")).toBe("JUN 2025");
  });
});

describe("toProcesses", () => {
  it("numbers processes by age: the oldest project is PID 01", () => {
    const processes = toProcesses(projects);
    expect(processes.map((process) => [process.pid, process.id])).toEqual([
      ["01", "lonestone-boilerplate"],
      ["02", "nzoth"],
      ["03", "procedural-map"],
      ["04", "communile"],
      ["05", "treashunt"],
      ["06", "my-website"],
    ]);
  });

  it("derives the address, status, month and stack line from the project", () => {
    const [website] = toProcesses([
      project({
        url: "https://github.com/netoun/netoun.github.io",
        date: "2026-04-27",
        tags: ["React", "TypeScript"],
      }),
    ]);
    expect(website).toMatchObject({
      address: "github.com/netoun/netoun.github.io",
      status: "source",
      yearMonth: "2026-04",
      month: "APR 2026",
      stack: "React · TypeScript",
    });
  });
});

describe("sortProcesses / nextSort", () => {
  const processes = toProcesses(projects);
  const titles = (sort = DEFAULT_SORT) => sortProcesses(processes, sort).map((row) => row.title);

  it("starts newest first", () => {
    expect(titles()[0]).toBe("My website");
    expect(titles().at(-1)).toBe("Lonestone Boilerplate");
  });

  it("sorts by name and flips on a second press", () => {
    const byName = nextSort(DEFAULT_SORT, "name");
    expect(byName).toEqual({ key: "name", direction: "ascending" });
    expect(titles(byName)[0]).toBe("Commun'île");
    expect(titles(nextSort(byName, "name"))[0]).toBe("Treashunt");
  });

  it("groups live processes first, newest first inside each group", () => {
    const byStatus = sortProcesses(processes, { key: "status", direction: "ascending" });
    expect(byStatus.map((row) => row.status)).toEqual([
      "live",
      "live",
      "live",
      "source",
      "source",
      "source",
    ]);
    expect(byStatus[0].title).toBe("Treashunt");
  });

  it("gives a new column its natural direction", () => {
    const byName = { key: "name", direction: "descending" } as const;
    expect(nextSort(byName, "date")).toEqual({ key: "date", direction: "descending" });
  });
});

describe("countDomains", () => {
  it("counts every tag with the tag primitive's colour map", () => {
    expect(countDomains(projects)).toEqual([
      { domain: "frontend", count: 14 },
      { domain: "backend", count: 9 },
      { domain: "creative", count: 2 },
      { domain: "systems", count: 0 },
    ]);
  });
});

describe("monitorStats", () => {
  it("reports totals and the dated range", () => {
    expect(monitorStats(toProcesses(projects))).toEqual({
      total: 6,
      live: 3,
      source: 3,
      since: "MAR 2025",
      latest: "APR 2026",
    });
  });

  it("stays printable with no projects", () => {
    expect(monitorStats([])).toMatchObject({ total: 0, since: "—", latest: "—" });
  });
});
