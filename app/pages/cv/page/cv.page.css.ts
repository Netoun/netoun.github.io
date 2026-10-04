import { globalStyle, style } from "@vanilla-extract/css";
import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { SHEET_WIDTH } from "../sections/cv-sheet/cv-sheet-metrics";

export const page = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
  boxSizing: "border-box",
  maxWidth: `calc(${SHEET_WIDTH}px + 2 * ${vars.spacing.md})`,
  margin: "0 auto",
  padding: `${vars.spacing.sm} ${vars.spacing.md} ${vars.spacing["3xl"]}`,
  "@media": {
    [breakpoints.sm]: {
      maxWidth: `calc(${SHEET_WIDTH}px + 2 * ${vars.spacing.lg})`,
      paddingInline: vars.spacing.lg,
    },
    print: { maxWidth: "none", padding: 0 },
  },
});

// Printed, the sheet is the page: no paper grain, no margin around it.
globalStyle("html:has([data-cv-page]), html:has([data-cv-page]) body", {
  "@media": {
    print: { margin: 0, background: "none" },
  },
});
