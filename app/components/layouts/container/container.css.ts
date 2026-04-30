import { style } from "@vanilla-extract/css";
import { breakpoints } from "@/styles/responsive.css";

export const containerStyle = style({
  maxWidth: "100%",
  margin: "0 auto",
  padding: "0 1rem",

  "@media": {
    [breakpoints.md]: {
      maxWidth: "768px",
    },
    [breakpoints.lg]: {
      maxWidth: "1024px",
    },
    [breakpoints.xl]: {
      maxWidth: "1440px",
    },
  },
});
