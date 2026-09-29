import type { ComponentType } from "react";
import type { ExperimentSlug } from "./experiment-slugs";

/** Sidebar grouping for experiments. Order defined by `LAB_GROUPS`. */
export type LabGroup = "3D CSS" | "CSS" | "HUD" | "Shaders" | "Scroll" | "SVG";

/** Accent maps onto the design system's three accent colors. */
export type LabAccent = "primary" | "secondary" | "tertiary";

/**
 * What a source file is to the experiment: the technique itself, its styles, or the Lab's own
 * wiring around it (controls, layout). The code viewer opens on the first source, so the
 * technique comes first and the demo last.
 */
export type LabSourceRole = "technique" | "styles" | "demo";

/** A single source file shown as a tab in the code viewer. */
export interface LabSource {
  /** Tab label, e.g. `computer.component.tsx`. */
  label: string;
  /** Raw file contents (imported via Vite `?raw`). */
  code: string;
  /** Prism language id, e.g. `tsx`, `ts`, `glsl`. */
  lang: string;
  /** Repo path of the file, for the viewer's source link (a test checks it matches `code`). */
  path: string;
  role: LabSourceRole;
}

/**
 * A span of one source file, anchored by the text of its first and last lines rather than by
 * line numbers, so an edit above it does not move the reference. `from` is the first line that
 * contains the text; `to` the first line at or after it that contains its own text.
 */
export interface LabSourceRef {
  /** `LabSource.label` of the file. */
  source: string;
  from: string;
  to?: string;
}

/** One entry of an experiment's `man` page. `body` may quote code between backticks. */
export interface LabNote {
  lead: string;
  body: string;
  refs?: LabSourceRef[];
}

/** The experiment's `man` page: what it is, how the technique works, what it costs. */
export interface LabManual {
  /** One line after the name, e.g. "a Canvas 2D signal grid driven by one seeded generator". */
  name: string;
  how: LabNote[];
  cost: LabNote[];
  seeAlso?: { slug: ExperimentSlug; text: string }[];
}

/** Descriptor for one Labs experiment. Each experiment folder exports one. */
export interface LabExperiment {
  /** URL slug — typed against `experiment-slugs.ts`, which drives prerender + sitemap. */
  slug: ExperimentSlug;
  /** Human title (also used in SEO). */
  title: string;
  /** One-line description (landing card + SEO description). */
  description: string;
  /** Keywords — surfaced as UI chips and SEO `keywords`. */
  tags: string[];
  group: LabGroup;
  accent: LabAccent;
  /** What draws the piece, printed in the stage's command bar (`CSS 3D`, `Canvas 2D`, `WebGL`). */
  engine: string;
  /** The demo reads `useLabsXray()` and can show its mechanism: the stage offers RUN | XRAY. */
  xray?: boolean;
  /** The interactive demo (live component + its controls). */
  Demo: ComponentType;
  /** Source files displayed in the code viewer, technique first. */
  sources: LabSource[];
  manual?: LabManual;
}

/** Ordered groups used to lay out the sidebar. */
export const LAB_GROUPS: LabGroup[] = ["3D CSS", "CSS", "HUD", "Shaders", "Scroll", "SVG"];
