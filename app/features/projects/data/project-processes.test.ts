import { afterEach, beforeEach, describe, expect, it } from "vitest";
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

// Deliberately unsorted, so the tests do not pass just because the input is already in order.
const fixture = [
  project({ slug: "c", title: "Charlie", date: "2026-03-01", url: "https://c.example.com" }),
  project({ slug: "a", title: "Alpha", date: "2025-01-01", url: "https://github.com/o/a" }),
  project({ slug: "b", title: "Bravo", date: "2025-06-01", url: "https://b.example.com" }),
  project({ slug: "d", title: "Delta", date: "2026-05-01", url: "https://github.com/o/d" }),
];

// `count` projects with strictly ascending dates, one per day from 2020-01-01.
const ascending = (count: number): Project[] =>
  Array.from({ length: count }, (_, index) =>
    project({
      slug: `p${index}`,
      date: new Date(Date.UTC(2020, 0, 1 + index)).toISOString().slice(0, 10),
    }),
  );

const pidsOf = (count: number) => toProcesses(ascending(count)).map((process) => process.pid);

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
  const originalTz = process.env.TZ;

  beforeEach(() => {
    // 2025-11-01T00:00Z is still October 31 in Los Angeles: a local-time formatter would fail here.
    process.env.TZ = "America/Los_Angeles";
  });

  afterEach(() => {
    if (originalTz === undefined) delete process.env.TZ;
    else process.env.TZ = originalTz;
  });

  it("formats date-only strings in UTC, whatever the visitor's offset", () => {
    expect(formatMonth("2025-11-01")).toBe("NOV 2025");
    expect(formatMonth("2025-06-01")).toBe("JUN 2025");
  });
});

describe("toProcesses", () => {
  it("numbers processes by age: the oldest project is PID 01", () => {
    const processes = toProcesses(fixture);
    expect(processes.map((process) => [process.pid, process.id])).toEqual([
      ["01", "a"],
      ["02", "b"],
      ["03", "c"],
      ["04", "d"],
    ]);
  });

  it("widens the PID so every number has the same width", () => {
    expect(pidsOf(10)[0]).toBe("01");
    expect(pidsOf(10).at(-1)).toBe("10");
    expect(pidsOf(100)[0]).toBe("001");
    expect(pidsOf(100).at(-1)).toBe("100");
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
  const processes = toProcesses(fixture);
  const titles = (sort = DEFAULT_SORT) => sortProcesses(processes, sort).map((row) => row.title);

  it("starts newest first", () => {
    expect(titles()[0]).toBe("Delta");
    expect(titles().at(-1)).toBe("Alpha");
  });

  it("sorts by name and flips on a second press", () => {
    const byName = nextSort(DEFAULT_SORT, "name");
    expect(byName).toEqual({ key: "name", direction: "ascending" });
    expect(titles(byName)[0]).toBe("Alpha");
    expect(titles(nextSort(byName, "name"))[0]).toBe("Delta");
  });

  it("groups live processes first, newest first inside each group", () => {
    const byStatus = sortProcesses(processes, { key: "status", direction: "ascending" });
    expect(byStatus.map((row) => row.status)).toEqual(["live", "live", "source", "source"]);
    expect(titles({ key: "status", direction: "ascending" })).toEqual([
      "Charlie",
      "Bravo",
      "Delta",
      "Alpha",
    ]);
  });

  it("gives a new column its natural direction", () => {
    const byName = { key: "name", direction: "descending" } as const;
    expect(nextSort(byName, "date")).toEqual({ key: "date", direction: "descending" });
  });
});

describe("countDomains", () => {
  it("counts every tag in its domain and ignores tags outside the colour map", () => {
    const counts = countDomains([
      project({ tags: ["React", "TypeScript", "Elysia", "Rust"] }),
      project({ tags: ["Three.js", "React", "Web"] }),
    ]);
    expect(counts).toEqual([
      { domain: "frontend", count: 3 },
      { domain: "backend", count: 1 },
      { domain: "creative", count: 1 },
      { domain: "systems", count: 1 },
    ]);
  });
});

describe("monitorStats", () => {
  it("reports totals and the dated range", () => {
    expect(
      monitorStats(
        toProcesses([
          project({ date: "2025-03-01", url: "https://a.example.com" }),
          project({ slug: "b", date: "2026-04-27", url: "https://github.com/o/b" }),
          project({ slug: "c", date: "2025-11-01", url: "https://c.example.com" }),
        ]),
      ),
    ).toEqual({ total: 3, live: 2, source: 1, since: "MAR 2025", latest: "APR 2026" });
  });

  it("stays printable with no projects", () => {
    expect(monitorStats([])).toMatchObject({ total: 0, since: "—", latest: "—" });
  });
});
