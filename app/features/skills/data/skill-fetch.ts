import { getTagColor } from "@/components/primitives/tag/tag.component";
import type {
  EvidenceSource,
  Receipt,
  SitePackages,
  StackDomain,
  StackGroup,
  StackTool,
} from "./skills-data.types";

// The fetch readout lists the stack by domain and prints, for any tool, where it ships.
// Domains come from the tag primitive's colour map (one taxonomy for the whole site); the
// evidence comes from the page (projects, jobs, Labs) and from the build (package.json).

/** Reading order: the tag primitive's own, then the tooling it leaves neutral. */
export const STACK_DOMAINS: StackDomain[] = [
  "frontend",
  "backend",
  "creative",
  "systems",
  "tooling",
];

/** Other spellings of a tool in the projects', jobs' and Labs' tag lists. */
const TOOL_ALIASES: Partial<Record<string, string[]>> = {
  "Vanilla Extract": ["CSS + Vanilla Extract", "CSS / Vanilla Extract"],
  "Canvas 2D": ["Canvas"],
  Monorepos: ["Monorepo"],
  Queues: ["Queue"],
};

/** The package.json entry that proves a tool on this site. */
const SITE_PACKAGES: Partial<Record<string, string>> = {
  React: "react",
  TypeScript: "typescript",
  "Vanilla Extract": "@vanilla-extract/css",
  "React Router": "react-router",
  "React Aria": "react-aria-components",
  "anime.js": "animejs",
  WebGPU: "@webgpu/types",
  Vite: "vite",
  Vitest: "vitest",
};

export function toDomain(tool: string): StackDomain {
  const color = getTagColor(tool);
  return color === "default" ? "tooling" : color;
}

/** Every project, job and Lab that lists the tool, and the package.json line that ships it. */
export function findReceipt(tool: string, sources: EvidenceSource[], site: SitePackages): Receipt {
  const names = new Set([tool, ...(TOOL_ALIASES[tool] ?? [])]);
  const labels = (kind: EvidenceSource["kind"]) =>
    sources
      .filter((source) => source.kind === kind && source.tags.some((tag) => names.has(tag)))
      .map((source) => source.label);

  const dependency = SITE_PACKAGES[tool];
  let siteEntry: string | null = null;
  if (dependency && site.dependencies.includes(dependency)) siteEntry = dependency;
  else if (site.packageManager === tool.toLowerCase()) siteEntry = "packageManager";

  return {
    projects: labels("project"),
    jobs: labels("job"),
    labs: labels("lab"),
    site: siteEntry,
  };
}

export function hasReceipt(receipt: Receipt): boolean {
  return (
    receipt.projects.length + receipt.jobs.length + receipt.labs.length > 0 || receipt.site !== null
  );
}

/** The tools grouped by domain, in reading order, each with its receipt. Empty domains drop. */
export function toStackGroups(
  tools: string[],
  sources: EvidenceSource[],
  site: SitePackages,
): StackGroup[] {
  const byDomain = new Map<StackDomain, StackTool[]>(STACK_DOMAINS.map((domain) => [domain, []]));
  for (const name of tools) {
    byDomain.get(toDomain(name))?.push({ name, receipt: findReceipt(name, sources, site) });
  }
  return STACK_DOMAINS.map((domain) => ({ domain, tools: byDomain.get(domain) ?? [] })).filter(
    (group) => group.tools.length > 0,
  );
}

const counted = (count: number, word: string) => `${count} ${word}${count > 1 ? "s" : ""}`;

/** `2 projects: Treashunt, Nzoth · 1 job: Lonestone · this site's package.json (react)` */
export function formatReceipt(receipt: Receipt): string {
  const parts: string[] = [];
  if (receipt.projects.length > 0) {
    parts.push(`${counted(receipt.projects.length, "project")}: ${receipt.projects.join(", ")}`);
  }
  if (receipt.jobs.length > 0) {
    parts.push(`${counted(receipt.jobs.length, "job")}: ${receipt.jobs.join(", ")}`);
  }
  if (receipt.labs.length > 0) {
    parts.push(`${counted(receipt.labs.length, "lab")}: ${receipt.labs.join(", ")}`);
  }
  if (receipt.site) parts.push(`this site's package.json (${receipt.site})`);
  return parts.join(" · ");
}
