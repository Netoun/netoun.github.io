/** The tag primitive's domains, plus the tooling it leaves neutral. */
export type StackDomain = "frontend" | "backend" | "creative" | "systems" | "tooling";

/** One AI practice, written as facts: what is done, with what, and where it can be seen. */
export interface Practice {
  id: string;
  title: string;
  body: string;
  /** `works with` for the agents that run it, `built with` for what it is made of. */
  withLabel: "works with" | "built with";
  with: string[];
  receipt: {
    text: string;
    /** A public place a peer can read it, when there is one. */
    href?: string;
  };
}

/** Somewhere a tool ships: a project, a job or a Lab, with the tags it lists. */
export interface EvidenceSource {
  kind: "project" | "job" | "lab";
  label: string;
  tags: string[];
}

/** The site's own package.json, as injected at build time. */
export interface SitePackages {
  dependencies: string[];
  packageManager: string;
}

/** Where one tool ships. A tool without any of these is not listed. */
export interface Receipt {
  projects: string[];
  jobs: string[];
  labs: string[];
  /** The package.json entry that proves it on this site. */
  site: string | null;
}

export interface StackTool {
  name: string;
  receipt: Receipt;
}

export interface StackGroup {
  domain: StackDomain;
  tools: StackTool[];
}

/**
 * A run of a readout value. `strong` is the datum (a name, a count), `muted` its context,
 * `role` the job title, set like the hero headline.
 */
export interface FetchPart {
  text: string;
  tone?: "strong" | "muted" | "role";
}

/** One `key: value` line of the fetch readout. */
export interface FetchLine {
  key: string;
  parts: FetchPart[];
}
