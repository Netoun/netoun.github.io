import { keyframes, style } from "@vanilla-extract/css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";
import {
  heroColumnGutter,
  heroColumnGutterByBreakpoint,
  heroMorphMedia,
  heroPinMedia,
  heroScrollTimelineSupports,
} from "../../welcome-hero-layout.css";

// Frame radius at md+: the footer panel's radius, so the morph lands on its shape.
const frameRadius = vars.radius.xl;

// The frame's sides close in on the page's content column. Text and laptop are
// already laid out on that column, so nothing scales: only the edges move, and
// the panel lands flush with the paper sections and the footer below.
const frameTighten = keyframes({
  from: { clipPath: `inset(0 0 round ${frameRadius})` },
  to: { clipPath: `inset(0 ${heroColumnGutter} round ${frameRadius})` },
});

export const heroScrollMorphWrapper = style({
  position: "relative",

  "@supports": {
    [heroScrollTimelineSupports]: {
      "@media": {
        // A short pin (20vh) so the first scroll visibly tightens the frame
        // before the page moves. The spacer lives in the content box: sticky
        // is bounded by it, a padding would not extend the pin.
        [heroPinMedia]: {
          selectors: {
            "&::after": {
              content: "",
              display: "block",
              height: "20vh",
            },
          },
        },
      },
    },
  },
});

export const heroMorphStage = style({
  position: "relative",
  padding: vars.spacing.sm,

  "@supports": {
    [heroScrollTimelineSupports]: {
      "@media": {
        [heroPinMedia]: {
          position: "sticky",
          top: 0,
          // Above the sections nav (z 40): the nav appears mid-hero and gets
          // uncovered by the panel's bottom edge as the hero scrolls away.
          zIndex: 41,
        },
      },
    },
  },
});

export const heroMorphFrame = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  // In flow, never a fixed height: when the text needs more than one screen
  // (landscape phones, 400 % zoom) the frame grows instead of clipping it.
  minHeight: [`calc(100vh - 2 * ${vars.spacing.sm})`, `calc(100svh - 2 * ${vars.spacing.sm})`],
  overflow: "hidden",
  borderRadius: vars.radius.md,
  vars: {
    [heroColumnGutter]: "0px",
  },

  "@media": {
    [breakpoints.md]: {
      borderRadius: frameRadius,
      vars: { [heroColumnGutter]: heroColumnGutterByBreakpoint.md },
    },
    [breakpoints.lg]: {
      vars: { [heroColumnGutter]: heroColumnGutterByBreakpoint.lg },
    },
    [breakpoints.xl]: {
      vars: { [heroColumnGutter]: heroColumnGutterByBreakpoint.xl },
    },
    [breakpoints["2k"]]: {
      vars: { [heroColumnGutter]: heroColumnGutterByBreakpoint["2k"] },
    },
  },

  "@supports": {
    [heroScrollTimelineSupports]: {
      "@media": {
        [heroMorphMedia]: {
          animationName: frameTighten,
          animationTimingFunction: "linear",
          animationFillMode: "both",
          animationTimeline: "scroll(root block)",
          // Fully landed once half a screen has scrolled: by then the first
          // project cards enter below, on the same column.
          animationRange: "0 50vh",
        },
      },
    },
  },
});

export const heroMorphContent = style({
  position: "relative",
  flex: 1,
  display: "flex",
  flexDirection: "column",
});
