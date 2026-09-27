import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";
import { breakpoints } from "@/styles/responsive.css";

// The content column is capped *below* the common viewport widths so the page
// always keeps real side margins. Matching max-width to the breakpoint (what we
// did before) collapsed the gutter down to the padding — at 1440px the content
// sat 16px from the edge, which is the fastest way to look unfinished.
// Gutters grow with the viewport; the hero and footer panels stay near
// full-bleed on purpose, so the paper sections read as the quiet counterpoint.
export const containerStyle = style({
  maxWidth: "100%",
  margin: "0 auto",
  padding: `0 ${vars.spacing.md}`,

  "@media": {
    [breakpoints.sm]: {
      padding: `0 ${vars.spacing.lg}`,
    },
    [breakpoints.md]: {
      maxWidth: "768px",
      padding: `0 ${vars.spacing.xl}`,
    },
    [breakpoints.lg]: {
      maxWidth: "1024px",
      padding: `0 ${vars.spacing["2xl"]}`,
    },
    [breakpoints.xl]: {
      maxWidth: "1280px",
      padding: `0 ${vars.spacing["2xl"]}`,
    },
    [breakpoints["2k"]]: {
      maxWidth: "1440px",
      padding: `0 ${vars.spacing["3xl"]}`,
    },
  },
});
