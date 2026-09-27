// The hero's spec layer: annotations that print the values the hero is built
// from. Every group belongs to the source file that sets its values, so a file
// tab lights exactly what that file controls.

export const HERO_SPEC_GROUPS = ["heading", "lead", "cta", "gutter", "laptop"] as const;

export type HeroSpecGroup = (typeof HERO_SPEC_GROUPS)[number];

export interface HeroSpecFile {
  id: string;
  /** Real file name in this folder. */
  label: string;
  groups: readonly HeroSpecGroup[];
}

export const HERO_SPEC_FILES = [
  { id: "content", label: "welcome-hero-section-content.css.ts", groups: ["heading", "lead"] },
  { id: "hero", label: "welcome-hero.css.ts", groups: ["gutter", "cta"] },
  { id: "computer", label: "welcome-hero-computer.css.ts", groups: ["laptop"] },
] as const satisfies readonly HeroSpecFile[];

export type HeroSpecFileId = (typeof HERO_SPEC_FILES)[number]["id"];

/** The section's entry file: the header's only label where the tabs do not fit. */
export const HERO_SPEC_ENTRY_FILE = "welcome-hero.section.tsx";

/**
 * Elements whose hover lights their own annotations. Not the CTA: its contact
 * popover opens over its annotation.
 */
export const HERO_SPEC_HOVER_TARGETS = [
  "heading",
  "lead",
  "laptop",
] as const satisfies readonly HeroSpecGroup[];

/** Palette swatches, always at full strength (no tab, no lighting): token key in theme.css.ts, and its name in DESIGN.md. */
export const HERO_SPEC_SWATCHES = [
  { token: "primary", name: "Lamplight Gold" },
  { token: "secondary", name: "Phosphor Mint" },
  { token: "tertiary", name: "Ultraviolet Orchid" },
  { token: "background", name: "Warm Paper Beige" },
] as const;

export function fileForGroup(group: HeroSpecGroup): HeroSpecFileId {
  const file = HERO_SPEC_FILES.find((candidate) =>
    (candidate.groups as readonly HeroSpecGroup[]).includes(group),
  );
  if (!file) throw new Error(`No spec file owns the "${group}" group`);
  return file.id;
}

export function isHeroSpecFileId(value: unknown): value is HeroSpecFileId {
  return HERO_SPEC_FILES.some((file) => file.id === value);
}
