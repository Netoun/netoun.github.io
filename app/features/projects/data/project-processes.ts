import { getTagColor } from "@/components/primitives/tag/tag.component";
import type { Project } from "./projects-data.types";

// The projects monitor reads the projects as processes. Every value it prints is derived
// here from projects-data.ts: nothing is typed by hand, nothing is a made-up metric.

export type ProcessStatus = "live" | "source";
export type ProcessSortKey = "name" | "status" | "date";
export type SortDirection = "ascending" | "descending";

export interface ProcessSort {
  key: ProcessSortKey;
  direction: SortDirection;
}

export interface ProjectProcess {
  id: string;
  /** Process id, "01" for the oldest project: it grows with time, like a real PID. */
  pid: string;
  title: string;
  description: string;
  date: string;
  url: string;
  image: string;
  /** URL without scheme or trailing slash: `github.com/lonestone/nzoth`. */
  address: string;
  status: ProcessStatus;
  /** `2026-04` */
  yearMonth: string;
  /** `APR 2026` */
  month: string;
  /** `React · TypeScript · Vanilla Extract` */
  stack: string;
}

export type MeterDomain = "frontend" | "backend" | "creative" | "systems";

export interface DomainMeter {
  domain: MeterDomain;
  count: number;
}

export interface MonitorStats {
  total: number;
  live: number;
  source: number;
  since: string;
  latest: string;
}

export const DEFAULT_SORT: ProcessSort = { key: "date", direction: "descending" };

const METER_DOMAINS: MeterDomain[] = ["frontend", "backend", "creative", "systems"];
const DEFAULT_DIRECTION: Record<ProcessSortKey, SortDirection> = {
  name: "ascending",
  status: "ascending",
  date: "descending",
};
const STATUS_ORDER: Record<ProcessStatus, number> = { live: 0, source: 1 };

export function toAddress(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

export function toStatus(address: string): ProcessStatus {
  return address.startsWith("github.com/") ? "source" : "live";
}

/** Date-only ISO strings are UTC midnight: format them in UTC or the month slips west of Greenwich. */
export function formatMonth(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`)
    .toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
    .toUpperCase();
}

function byDate(a: { date: string }, b: { date: string }): number {
  return a.date.localeCompare(b.date);
}

/** Processes in PID order (oldest first). */
export function toProcesses(projects: Project[]): ProjectProcess[] {
  const width = Math.max(2, String(projects.length).length);
  return projects.toSorted(byDate).map((project, index) => {
    const address = toAddress(project.url);
    return {
      id: project.slug,
      pid: String(index + 1).padStart(width, "0"),
      title: project.title,
      description: project.description,
      date: project.date,
      url: project.url,
      image: project.image,
      address,
      status: toStatus(address),
      yearMonth: project.date.slice(0, 7),
      month: formatMonth(project.date),
      stack: project.tags.join(" · "),
    };
  });
}

export function sortProcesses(processes: ProjectProcess[], sort: ProcessSort): ProjectProcess[] {
  const sign = sort.direction === "ascending" ? 1 : -1;
  const compare = (a: ProjectProcess, b: ProjectProcess): number => {
    switch (sort.key) {
      case "name":
        return a.title.localeCompare(b.title, "en");
      case "status":
        return STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || byDate(b, a);
      case "date":
        return byDate(a, b);
    }
  };
  return processes.toSorted((a, b) => sign * compare(a, b));
}

/** Same column flips the direction; a new column starts from its natural direction. */
export function nextSort(current: ProcessSort, key: ProcessSortKey): ProcessSort {
  if (current.key !== key) return { key, direction: DEFAULT_DIRECTION[key] };
  return { key, direction: current.direction === "ascending" ? "descending" : "ascending" };
}

/** Tags per domain across every project, with the tag primitive's own colour map. */
export function countDomains(projects: Project[]): DomainMeter[] {
  const tags = projects.flatMap((project) => project.tags);
  return METER_DOMAINS.map((domain) => ({
    domain,
    count: tags.filter((tag) => getTagColor(tag) === domain).length,
  }));
}

export function monitorStats(processes: ProjectProcess[]): MonitorStats {
  const dates = processes.map((process) => process.date).toSorted();
  const live = processes.filter((process) => process.status === "live").length;
  return {
    total: processes.length,
    live,
    source: processes.length - live,
    since: dates.length > 0 ? formatMonth(dates[0]) : "—",
    latest: dates.length > 0 ? formatMonth(dates[dates.length - 1]) : "—",
  };
}
