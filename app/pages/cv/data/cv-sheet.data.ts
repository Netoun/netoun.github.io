import {
  formatDuration,
  formatYearMonth,
  monthsBetween,
  toBranches,
  type StackDomain as LaneDomain,
} from "@/features/experiences/data/experience-log";
import { experiences } from "@/features/experiences/data/experiences-data";
import { EXPERIMENT_SLUGS } from "@/features/labs/data/experiment-slugs";
import {
  DEFAULT_SORT,
  sortProcesses,
  toAddress,
  toProcesses,
  type ProcessStatus,
} from "@/features/projects/data/project-processes";
import { projects } from "@/features/projects/data/projects-data";
import { contactLinks, type ContactLink } from "@/features/site/data/contact-links.data";
import { SITE_URL } from "@/features/site/data/site";
import { STACK_DOMAINS, toDomain } from "@/features/skills/data/skill-fetch";
import { PRACTICES, STACK_TOOLS } from "@/features/skills/data/skills-data";
import type { StackDomain } from "@/features/skills/data/skills-data.types";
import {
  CV_CLIENTS,
  CV_EDUCATION,
  CV_JOBS,
  CV_LEAD,
  CV_NAME,
  CV_PROJECTS,
  CV_TAGLINE,
  type CvEducation,
} from "./cv-copy.data";

// The résumé, read from the site's data the way the home reads it: the work log's branches
// and durations, the monitor's processes, the fetch readout's domains. Only the descriptions
// are the résumé's own (cv-copy.data.ts).

export interface CvTool {
  name: string;
  domain: StackDomain;
}

export interface CvClient {
  title: string;
  text: string;
  domain: LaneDomain;
  tools: CvTool[];
}

export interface CvJob {
  slug: string;
  company: string;
  role: string;
  /** `JUL 2021 – NOW` */
  period: string;
  /** `5Y 3M` */
  duration: string;
  isOpen: boolean;
  domain: LaneDomain;
  text: string;
  tools: CvTool[];
  clients: CvClient[];
  moreClients: boolean;
}

export interface CvProject {
  slug: string;
  pid: string;
  title: string;
  text: string;
  url: string;
  address: string;
  status: ProcessStatus;
  yearMonth: string;
}

export interface CvStackGroup {
  domain: StackDomain;
  tools: string[];
  /** Tools in this domain against the largest domain, 0 to 1: the meter's length. */
  share: number;
}

export interface CvContact {
  key: string;
  value: string;
  href?: string;
}

export interface CvPractice {
  title: string;
  tools: string[];
}

export interface CvSheet {
  name: string;
  tagline: string;
  lead: string;
  contacts: CvContact[];
  jobs: CvJob[];
  projects: CvProject[];
  stack: CvStackGroup[];
  practices: CvPractice[];
  education: CvEducation[];
  labsCount: number;
}

function copyOf(copy: Record<string, string>, key: string): string {
  const text = copy[key];
  if (text === undefined) throw new Error(`cv-copy.data.ts has no line for "${key}"`);
  return text;
}

const toTools = (names: string[]): CvTool[] =>
  names.map((name) => ({ name, domain: toDomain(name) }));

/** `github.com/netoun`, a LinkedIn handle, a mail address: what the readout prints. */
function contactOf(link: ContactLink): CvContact {
  if (link.url.startsWith("mailto:")) {
    return { key: "Mail", value: link.url.slice("mailto:".length), href: link.url };
  }
  const address = toAddress(link.url);
  const value = link.label === "LinkedIn" ? (address.split("/").pop() ?? address) : address;
  return { key: link.label, value, href: link.url };
}

/** The whole page, for a month (`YYYY-MM`): durations and the uptime count up to it. */
export function toCvSheet(now: string): CvSheet {
  const branches = toBranches(experiences, now);
  const first = branches.at(-1);
  const current = branches.find((branch) => branch.isOpen) ?? branches[0];
  const mail = contactLinks.find((link) => link.url.startsWith("mailto:"));
  const profiles = contactLinks.filter((link) => link !== mail);
  const host = new URL(SITE_URL).hostname.replace(/^www\./, "");

  const contacts: CvContact[] = [
    { key: "Host", value: host, href: `${SITE_URL}/` },
    ...(mail ? [contactOf(mail)] : []),
    ...profiles.map(contactOf),
    { key: "Location", value: current.location },
  ];
  if (first) {
    contacts.push({
      key: "Uptime",
      value: `${formatDuration(monthsBetween(first.start, now))} · since ${formatYearMonth(first.start)}`,
    });
  }

  const byDomain = new Map<StackDomain, string[]>(STACK_DOMAINS.map((domain) => [domain, []]));
  for (const tool of STACK_TOOLS) byDomain.get(toDomain(tool))?.push(tool);
  const largest = Math.max(...[...byDomain.values()].map((tools) => tools.length));

  return {
    name: CV_NAME,
    tagline: CV_TAGLINE,
    lead: CV_LEAD,
    contacts,
    jobs: branches.map((branch) => ({
      slug: branch.slug,
      company: branch.company,
      role: branch.role,
      period: `${branch.startLabel} – ${branch.endLabel}`,
      duration: branch.duration,
      isOpen: branch.isOpen,
      domain: branch.domain,
      text: copyOf(CV_JOBS, branch.slug),
      tools: toTools(branch.stack),
      clients: branch.commits.map((commit) => ({
        title: commit.title,
        text: copyOf(CV_CLIENTS, commit.title),
        domain: commit.domain,
        tools: toTools(commit.stack),
      })),
      moreClients: branch.moreProjects,
    })),
    projects: sortProcesses(toProcesses(projects), DEFAULT_SORT).map((process) => ({
      slug: process.id,
      pid: process.pid,
      title: process.title,
      text: copyOf(CV_PROJECTS, process.id),
      url: process.url,
      address: process.address,
      status: process.status,
      yearMonth: process.yearMonth,
    })),
    stack: STACK_DOMAINS.map((domain) => {
      const tools = byDomain.get(domain) ?? [];
      return { domain, tools, share: tools.length / largest };
    }).filter((group) => group.tools.length > 0),
    practices: PRACTICES.map((practice) => ({ title: practice.title, tools: practice.with })),
    education: CV_EDUCATION,
    labsCount: EXPERIMENT_SLUGS.length,
  };
}

/** A month before every start: each duration reads 0 and only the content is left to hash. */
const FINGERPRINT_MONTH = "1970-01";

/**
 * What the PDF prints, minus the calendar: FNV-1a of the page's content. `generate-cv` stores it
 * beside the PDF; a test compares it with the data, so a change on the site asks for a new PDF.
 */
export function cvFingerprint(): string {
  let hash = 0x811c9dc5;
  for (const char of JSON.stringify(toCvSheet(FINGERPRINT_MONTH))) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
