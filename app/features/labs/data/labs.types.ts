import type { ComponentType } from "react";

/** Sidebar grouping for experiments. Order defined by `LAB_GROUPS`. */
export type LabGroup = "3D CSS" | "HUD" | "Shaders" | "Scroll" | "SVG";

/** Accent maps onto the design system's three accent colors. */
export type LabAccent = "primary" | "secondary" | "tertiary";

/** A single source file shown as a tab in the code viewer. */
export interface LabSource {
  /** Tab label, e.g. `computer.component.tsx`. */
  label: string;
  /** Raw file contents (imported via Vite `?raw`). */
  code: string;
  /** Prism language id, e.g. `tsx`, `ts`, `glsl`. */
  lang: string;
}

/** Descriptor for one Labs experiment. Each experiment folder exports one. */
export interface LabExperiment {
  /** URL slug — must also be listed in `experiment-slugs.ts`. */
  slug: string;
  /** Human title (also used in SEO). */
  title: string;
  /** One-line description (landing card + SEO description). */
  description: string;
  /** Keywords — surfaced as UI chips and SEO `keywords`. */
  tags: string[];
  group: LabGroup;
  accent: LabAccent;
  /** Emoji shown in the sidebar / landing card. */
  icon: string;
  /** The interactive demo (live component + its controls). */
  Demo: ComponentType;
  /** Source files displayed in the code viewer. */
  sources: LabSource[];
}

/** Ordered groups used to lay out the sidebar. */
export const LAB_GROUPS: LabGroup[] = ["3D CSS", "HUD", "Shaders", "Scroll", "SVG"];
