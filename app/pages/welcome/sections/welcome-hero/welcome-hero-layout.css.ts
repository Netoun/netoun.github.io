import { createVar } from "@vanilla-extract/css";
import { containerColumn } from "@/components/layouts/container/container.css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";

// Shared geometry of the hero: which layout applies where, and where the page's
// content column sits inside the frame. Every hero piece (frame, text, laptop)
// reads these, so the scroll morph lands exactly on the column the paper
// sections and the footer panel use.

/**
 * Laptop beside the text, the whole hero on one screen. Narrower or shorter
 * viewports stack the laptop under the text and let the frame grow instead of
 * clipping (landscape phones, 400 % zoom).
 */
export const heroSideBySideMedia = "screen and (min-width: 1024px) and (min-height: 640px)";
export const heroSideBySideXlMedia = "screen and (min-width: 1280px) and (min-height: 640px)";
export const heroSideBySide2kMedia = "screen and (min-width: 1920px) and (min-height: 640px)";

/** The morph is CSS scroll-driven; without scroll timelines the frame simply stays full-bleed. */
export const heroScrollTimelineSupports = "(animation-timeline: scroll())";
/** The frame tightens onto the column from md up. */
export const heroMorphMedia = `${breakpoints.md} and (prefers-reduced-motion: no-preference)`;
/** The short pin only where the hero fits one screen — a taller pinned stage would hide its own bottom. */
export const heroPinMedia = `${heroSideBySideMedia} and (prefers-reduced-motion: no-preference)`;

/** Distance from the hero frame's edge to the page's content column. `0px` below md. */
export const heroColumnGutter = createVar();

// The frame is the viewport minus the stage's 2 × sm inset, so the column's
// container is min(maxWidth, 100% + 2 × sm) wide and its content box loses
// 2 × padding. Percentages resolve against the frame width wherever the var is
// used: padding and `right` of direct frame descendants, and clip-path inset().
const gutterFor = ({ maxWidth, padding }: { maxWidth: string; padding: string }) =>
  `calc((100% - min(${maxWidth}, 100% + 2 * ${vars.spacing.sm}) + 2 * ${padding}) / 2)`;

export const heroColumnGutterByBreakpoint = {
  md: gutterFor(containerColumn.md),
  lg: gutterFor(containerColumn.lg),
  xl: gutterFor(containerColumn.xl),
  "2k": gutterFor(containerColumn["2k"]),
} as const;

/** Inner padding between the column edge and the hero text — the footer panel's padding from lg. */
export const heroPanelPadding = {
  md: vars.spacing.xl,
  lg: vars.spacing["3xl"],
} as const;

/** Laptop width while stacked under the text (below lg, or short viewports). */
export const heroStackedLaptopWidth = {
  base: "min(100%, 400px)",
  md: "460px",
} as const;

/** Height / width of the laptop scene (lid + chassis, tilted, without the caption), measured: 437 / 640. */
export const heroLaptopAspect = "0.69";

/** Height of the spec header strip (file tabs, renderer, fps) along the frame's top edge. */
export const heroHeaderHeight = "2.5rem";

/** Space between the frame's top edge and the headline, header included. */
export const heroPanelPaddingTop = {
  base: `calc(${heroHeaderHeight} + ${vars.spacing.lg})`,
  lg: vars.spacing["3xl"],
  sideBySide2k: "6rem",
} as const;
