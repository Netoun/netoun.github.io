import { createVar, keyframes, style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

/** How far each side closes in, the scroll it takes, and the frame's radius (set from the controls). */
export const morphGutter = createVar();
export const morphRange = createVar();
export const morphRadius = createVar();

/** Where scroll-driven animations run. Elsewhere the frame simply stays open, as the hero's does. */
export const morphSupports = "(animation-timeline: scroll())";
export const morphMotion = "(prefers-reduced-motion: no-preference)";

// The hero's move (app/pages/welcome/…/welcome-hero-scroll-morph.css.ts): only the frame's sides
// travel, onto the content column. Nothing scales, so the text inside never reflows.
const frameTighten = keyframes({
  from: { clipPath: `inset(0 0 round ${morphRadius})` },
  to: { clipPath: `inset(0 ${morphGutter} round ${morphRadius})` },
});

// The page in miniature: its own scroller names the timeline every piece below reads.
export const scroller = style({
  position: "relative",
  height: "24rem",
  overflowY: "auto",
  overscrollBehavior: "contain",
  scrollTimeline: "--lab-morph block",
  borderRadius: vars.radius.md,
  backgroundColor: vars.colors.background,
});

// Pinned while the frame lands, like the hero's stage.
export const pin = style({
  position: "sticky",
  top: 0,
  zIndex: 1,
  padding: vars.spacing.sm,
});

export const frame = style({
  position: "relative",
  height: "15rem",
  overflow: "hidden",
  clipPath: `inset(0 0 round ${morphRadius})`,
  "@supports": {
    [morphSupports]: {
      "@media": {
        [morphMotion]: {
          animationName: frameTighten,
          // Linear: the scroll is the easing.
          animationTimingFunction: "linear",
          animationFillMode: "both",
          animationTimeline: "--lab-morph",
          animationRange: `0 ${morphRange}`,
        },
      },
    },
  },
});
