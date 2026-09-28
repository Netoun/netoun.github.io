import { createVar, keyframes, styleVariants } from "@vanilla-extract/css";
import { motion } from "@/styles/motion.css";
import { vars } from "@/styles/theme.css";
import {
  HERO_SPEC_GROUPS,
  HERO_SPEC_HOVER_TARGETS,
  type HeroSpecGroup,
  fileForGroup,
} from "./welcome-hero-spec-data";
import { heroSideBySideXlMedia } from "./welcome-hero-layout.css";

// Shared vocabulary of the hero's spec layer: where it shows, how a group
// lights up, and the plotter keyframes. The layer is decorative (aria-hidden)
// and only ever printed on the dark panel.

/** Annotations need room around the text: the side-by-side hero from xl. */
export const heroSpecMedia = heroSideBySideXlMedia;
export const heroSpecMotionMedia = `${heroSpecMedia} and (prefers-reduced-motion: no-preference)`;
export const heroSpecReducedMotion = "(prefers-reduced-motion: reduce)";

/**
 * The rules that need no room (headline baselines, the lead's bracket and
 * measure line) show at every width, phones included; the notes, dimensions
 * and swatches wait for heroSpecMedia.
 */
export const heroSpecRulesMedia = "screen";
export const heroSpecRulesMotionMedia = "screen and (prefers-reduced-motion: no-preference)";

const root = '[data-section="welcome-hero"]';

/**
 * Set on the section once hydrated with fonts loaded: annotations print values
 * read from the live elements, so without JS they stay hidden.
 */
export const heroSpecOnSelector = `${root}[data-spec="on"]`;

// Lighting only exists once the spec is on: without JS a hover changes nothing.
const litRoot = heroSpecOnSelector;

const anyHoverTarget = `:is(${HERO_SPEC_HOVER_TARGETS.map((group) => `[data-spec-target="${group}"]`).join(", ")}):hover`;

/** "Something is lit" (a picked file or a hovered element), `&` being the styled element. */
export const heroSpecActive = `${litRoot}[data-spec-file] &, ${litRoot}:has(${anyHoverTarget}) &`;

const litSelectors = (group: HeroSpecGroup) => {
  const hoverable = (HERO_SPEC_HOVER_TARGETS as readonly HeroSpecGroup[]).includes(group);
  return [
    ...(hoverable ? [`${litRoot}:has([data-spec-target="${group}"]:hover) &`] : []),
    // A hovered element wins over the picked file, as a pointer is the more recent intent.
    `${litRoot}[data-spec-file="${fileForGroup(group)}"]:not(:has(${anyHoverTarget})) &`,
  ];
};

/** Selector list matching a lit group, `&` being the styled element (append a pseudo-element with replaceAll). */
export const heroSpecLit = Object.fromEntries(
  HERO_SPEC_GROUPS.map((group) => [group, litSelectors(group).join(", ")]),
) as Record<HeroSpecGroup, string>;

// Opacity of an annotation = rest, or lit, dimmed while another group is lit:
// `calc((rest + (lit - rest) * specLift) * specDim)` on an element carrying
// `heroSpecGroup[group]` (or inside one). .css.ts files cannot export
// functions, so each consumer spells the calc with these two vars.
/** 0 at rest, 1 when the element's group is lit. */
export const specLift = createVar();
/** 1, or 0.45 while another group is lit. */
export const specDim = createVar();

export const heroSpecGroup = styleVariants(
  Object.fromEntries(HERO_SPEC_GROUPS.map((group) => [group, group])) as Record<
    HeroSpecGroup,
    HeroSpecGroup
  >,
  (group) => ({
    vars: { [specLift]: "0", [specDim]: "1" },
    selectors: {
      // Order matters: the lit rules come last to win at equal specificity.
      [heroSpecActive]: { vars: { [specDim]: "0.45" } },
      [heroSpecLit[group]]: { vars: { [specLift]: "1", [specDim]: "1" } },
    },
  }),
);

/** Hidden until the spec is on, then shown with the given display, from xl only. */
export const heroSpecShown = styleVariants(
  { block: "block", flex: "flex", inlineFlex: "inline-flex" } as const,
  (display) => ({
    display: "none",
    "@media": {
      [heroSpecMedia]: {
        selectors: { [`${heroSpecOnSelector} &`]: { display } },
      },
    },
  }),
);

/** Type sizes of the code voice. */
export const specType = {
  tab: "0.6875rem",
  note: "0.625rem",
  swatch: "0.5625rem",
} as const;

export const specInk = {
  line: vars.colors.background,
  mint: vars.colors.secondary,
  gold: vars.colors.primary,
} as const;

export const specTransition = `opacity ${motion.duration.base} ${motion.easing.out}, color ${motion.duration.base} ${motion.easing.out}`;

// Plotter keyframes: lines draw, labels type, chips rise. Each runs once, when
// the spec turns on; none runs under reduced motion.
export const specDrawX = keyframes({
  from: { clipPath: "inset(0 100% 0 0)" },
  to: { clipPath: "inset(0)" },
});

export const specDrawY = keyframes({
  from: { clipPath: "inset(0 0 100% 0)" },
  to: { clipPath: "inset(0)" },
});

export const specFadeDown = keyframes({
  from: { opacity: 0, translate: "0 -0.375rem" },
});

export const specRise = keyframes({
  from: { opacity: 0, translate: "0 0.3125rem" },
});

export const specFadeIn = keyframes({
  from: { opacity: 0 },
});

// A light pulse runs along a group's lines each time it lights up: a 10rem
// window slides across, through the mask (over drawn lines) or the background.
export const specSweepWindow = "10rem";

const sweepFrames = (property: "maskPosition" | "backgroundPosition") =>
  keyframes({
    "0%": { [property]: `-${specSweepWindow} 0`, opacity: 0 },
    "15%": { opacity: 1 },
    "100%": { [property]: `calc(100% + ${specSweepWindow}) 0`, opacity: 0 },
  });

export const specSweepMask = sweepFrames("maskPosition");
export const specSweepBackground = sweepFrames("backgroundPosition");

export const specBlip = keyframes({
  "50%": { opacity: 0.3 },
});
