import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

// Header + aside: stacked, then side by side once both fit on one line.
export const headerRowStyle = style({
  display: "grid",
  "@media": {
    [breakpoints.xl]: {
      gridTemplateColumns: "minmax(0, 1fr) auto",
      columnGap: vars.spacing["2xl"],
      // Both cells keep the header's bottom margin, so their last lines share a baseline zone.
      alignItems: "end",
    },
  },
});

export const asideStyle = style({
  minWidth: 0,
  marginBottom: vars.spacing.xl,
});
