import { getTagColor } from "@/components/primitives/tag/tag.component";
import type { Experience } from "./experiences-data.types";

// The work log reads the work history as a git graph: every employer is a branch forked
// from `main` on arrival and merged back on departure, the current one is HEAD, client
// projects are its commits. Every value it prints is derived here from experiences-data.ts
// and the current month: nothing is typed by hand.

export type StackDomain = "frontend" | "backend" | "creative" | "systems";
export type DomainMix = Record<StackDomain, number>;

/** The tag primitive's own order, which also breaks ties. */
export const STACK_DOMAINS: StackDomain[] = ["frontend", "backend", "creative", "systems"];

/** One tenure segment per this many months in `branch -v`. */
export const TENURE_SEGMENT_MONTHS = 2;

const MONTH_LABELS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function monthIndex(yearMonth: string): number {
  const [year, month] = yearMonth.split("-").map(Number);
  return year * 12 + (month - 1);
}

/** Whole months from `start` to `end` (both `YYYY-MM`). */
export function monthsBetween(start: string, end: string): number {
  return Math.max(0, monthIndex(end) - monthIndex(start));
}

/** `62` → `5Y 2M`, `24` → `2Y`, `10` → `10M`. */
export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years > 0 && rest > 0) return `${years}Y ${rest}M`;
  if (years > 0) return `${years}Y`;
  return `${rest}M`;
}

/** `2021-07` → `JUL 2021`. Built from the string, so no time zone can shift the month. */
export function formatYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-").map(Number);
  return `${MONTH_LABELS[month - 1]} ${year}`;
}

/** Tags per domain, with the tag primitive's colour map; tooling tags count nowhere. */
export function countDomains(tags: string[]): DomainMix {
  const mix: DomainMix = { frontend: 0, backend: 0, creative: 0, systems: 0 };
  for (const tag of tags) {
    const color = getTagColor(tag);
    if (color !== "default") mix[color] += 1;
  }
  return mix;
}

/** The domain with the most tags; ties go frontend → backend → creative → systems. */
export function mainDomain(mix: DomainMix): StackDomain {
  return STACK_DOMAINS.reduce((best, domain) => (mix[domain] > mix[best] ? domain : best));
}

export interface LogCommit {
  title: string;
  description: string;
  url?: string;
  stack: string[];
  domain: StackDomain;
}

export interface LogBranch {
  slug: string;
  company: string;
  role: string;
  location: string;
  description?: string;
  start: string;
  end?: string;
  isOpen: boolean;
  /** `JUL 2021` */
  startLabel: string;
  /** `JUL 2021`, or `NOW` while the job runs */
  endLabel: string;
  months: number;
  /** `5Y 2M` */
  duration: string;
  /** Lit segments in `branch -v`, one per TENURE_SEGMENT_MONTHS. */
  tenureSegments: number;
  /** The lane colour: the main domain of every tag shipped on this branch. */
  domain: StackDomain;
  mix: DomainMix;
  stack: string[];
  commits: LogCommit[];
  moreProjects: boolean;
}

/** Newest first, the order git log prints. `now` is `YYYY-MM`. */
export function toBranches(experiences: Experience[], now: string): LogBranch[] {
  return experiences
    .toSorted((a, b) => b.start.localeCompare(a.start))
    .map((experience) => {
      const tags = [
        ...experience.stack,
        ...experience.projects.flatMap((project) => project.stack),
      ];
      const mix = countDomains(tags);
      const months = monthsBetween(experience.start, experience.end ?? now);
      return {
        slug: experience.slug,
        company: experience.company,
        role: experience.role,
        location: experience.location,
        description: experience.description,
        start: experience.start,
        end: experience.end,
        isOpen: experience.end === undefined,
        startLabel: formatYearMonth(experience.start),
        endLabel: experience.end ? formatYearMonth(experience.end) : "NOW",
        months,
        duration: formatDuration(months),
        tenureSegments: Math.max(1, Math.round(months / TENURE_SEGMENT_MONTHS)),
        domain: mainDomain(mix),
        mix,
        stack: experience.stack,
        commits: experience.projects.map((project) => ({
          ...project,
          domain: mainDomain(countDomains(project.stack)),
        })),
        moreProjects: experience.moreProjects ?? false,
      };
    });
}

// ── Graph layout ─────────────────────────────────────────────────────────────

export interface LogRef {
  label: string;
  kind: "head" | "branch" | "main" | "tag";
}

export type LogRow =
  | { kind: "tip"; refs: LogRef[] }
  | { kind: "commit"; commit: LogCommit }
  /** More client work than listed: the branch keeps going, unprinted. */
  | { kind: "elided" }
  | { kind: "merge"; refs: LogRef[] }
  | { kind: "root"; refs: LogRef[] }
  /** Connector: the branch lane curves into main (the branch was forked there). */
  | { kind: "fork" }
  /** Connector: main curves out to the branch lane (main merged it there). */
  | { kind: "merge-in" };

/**
 * How `main` runs through a group. Lanes are drawn once per group (not per row), so a
 * gradient can run along them and no seam shows between rows.
 * - `behind`: dashed all the way, main has not moved since the open branch forked;
 * - `tip`: dashed down to the group's merge node (main's latest commit), solid below;
 * - `start`: begins at the group's merge node (nothing is open: HEAD is main);
 * - `solid`: solid all the way.
 */
export type MainRail = "behind" | "tip" | "start" | "solid";

export interface LogGroup {
  branch: LogBranch;
  rows: LogRow[];
  main: MainRail;
  /** The last group: main stops at the root node. */
  endsAtRoot: boolean;
}

/**
 * One group per branch, newest first, with the rows git log --graph would print for it.
 * Assumes at most one open branch (the current job).
 */
export function toLogGroups(branches: LogBranch[]): LogGroup[] {
  let mainTipSeen = false;

  return branches.map((branch, index) => {
    const rows: LogRow[] = [];
    const endsAtRoot = index === branches.length - 1;
    let main: MainRail = mainTipSeen ? "solid" : "behind";

    if (!branch.isOpen && branch.end) {
      const refs: LogRef[] = [];
      if (!mainTipSeen) {
        refs.push(
          index === 0 ? { label: "HEAD -> main", kind: "head" } : { label: "main", kind: "main" },
        );
        main = index === 0 ? "start" : "tip";
      }
      refs.push({ label: `tag: ${branch.end}`, kind: "tag" });
      rows.push({ kind: "merge", refs }, { kind: "merge-in" });
      mainTipSeen = true;
    }

    rows.push({
      kind: "tip",
      refs: [
        branch.isOpen
          ? { label: `HEAD -> ${branch.slug}`, kind: "head" }
          : { label: branch.slug, kind: "branch" },
      ],
    });
    for (const commit of branch.commits) rows.push({ kind: "commit", commit });
    if (branch.moreProjects) rows.push({ kind: "elided" });
    rows.push({ kind: "fork" });
    if (endsAtRoot)
      rows.push({ kind: "root", refs: [{ label: `tag: ${branch.start}`, kind: "tag" }] });

    return { branch, rows, main, endsAtRoot };
  });
}

export interface LogSummary {
  /** `SEP 2017` */
  since: string;
  /** `9Y` */
  total: string;
  branches: number;
  merged: number;
}

export function logSummary(branches: LogBranch[], now: string): LogSummary {
  const first = branches.map((branch) => branch.start).toSorted()[0] ?? now;
  return {
    since: formatYearMonth(first),
    total: formatDuration(monthsBetween(first, now)),
    branches: branches.length,
    merged: branches.filter((branch) => !branch.isOpen).length,
  };
}
