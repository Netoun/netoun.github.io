import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";
import { breakpoints } from "@/styles/responsive.css";

// The content column is capped *below* the common viewport widths so the page
// always keeps real side margins. Matching max-width to the breakpoint (what we
// did before) collapsed the gutter down to the padding — at 1440px the content
// sat 16px from the edge, which is the fastest way to look unfinished.
// Gutters grow with the viewport; the hero and footer panels stay near
// full-bleed on purpose, so the paper sections read as the quiet counterpoint.
//
// Exported so anything that must land on this column (the hero scroll morph)
// derives its geometry from the same numbers instead of a hand-copied table.
export const containerColumn = {
  base: { maxWidth: "100%", padding: vars.spacing.md },
  sm: { maxWidth: "100%", padding: vars.spacing.lg },
  md: { maxWidth: "768px", padding: vars.spacing.xl },
  lg: { maxWidth: "1024px", padding: vars.spacing["2xl"] },
  xl: { maxWidth: "1280px", padding: vars.spacing["2xl"] },
  "2k": { maxWidth: "1440px", padding: vars.spacing["3xl"] },
} as const;

export const containerStyle = style({
  maxWidth: containerColumn.base.maxWidth,
  margin: "0 auto",
  padding: `0 ${containerColumn.base.padding}`,

  "@media": {
    [breakpoints.sm]: {
      maxWidth: containerColumn.sm.maxWidth,
      padding: `0 ${containerColumn.sm.padding}`,
    },
    [breakpoints.md]: {
      maxWidth: containerColumn.md.maxWidth,
      padding: `0 ${containerColumn.md.padding}`,
    },
    [breakpoints.lg]: {
      maxWidth: containerColumn.lg.maxWidth,
      padding: `0 ${containerColumn.lg.padding}`,
    },
    [breakpoints.xl]: {
      maxWidth: containerColumn.xl.maxWidth,
      padding: `0 ${containerColumn.xl.padding}`,
    },
    [breakpoints["2k"]]: {
      maxWidth: containerColumn["2k"].maxWidth,
      padding: `0 ${containerColumn["2k"].padding}`,
    },
  },
});
