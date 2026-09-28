import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";
import { weight } from "@styles/weight";

const rule = `1px solid color-mix(in srgb, ${vars.colors.cardBorder} 55%, transparent)`;

// Pointer screens only: on narrow screens every row already shows its capture and text.
export const detailStyle = style({
  display: "none",
  "@media": {
    [breakpoints.md]: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 18rem) minmax(0, 1fr)",
      gap: vars.spacing.xl,
      padding: vars.spacing.lg,
      borderTop: rule,
      // A faint pool of shade seats the chrome capture on the paper.
      backgroundImage: `radial-gradient(55% 90% at 18% 50%, color-mix(in srgb, ${vars.colors.cardBorder} 38%, transparent), transparent 72%)`,
    },
    [breakpoints.lg]: {
      gridTemplateColumns: "minmax(0, 22rem) minmax(0, 1fr)",
    },
    [breakpoints.xl]: {
      gridTemplateColumns: "25rem minmax(0, 1fr)",
    },
  },
});

export const bodyStyle = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.sm,
  minWidth: 0,
});

export const inspectStyle = style({
  fontFamily: vars.fontFamily.doto,
  ...weight(vars.fontWeight.extrabold),
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.08em",
  color: vars.colors.mutedForeground,
});

export const titleStyle = style({
  margin: 0,
  fontSize: vars.fontSize["2xl"],
  ...weight(vars.fontWeight.semibold),
  lineHeight: vars.lineHeight.tight,
  "@media": {
    [breakpoints.lg]: {
      fontSize: vars.fontSize["3xl"],
    },
  },
});

export const descriptionStyle = style({
  margin: 0,
  maxWidth: "36em",
  fontSize: vars.fontSize.base,
  lineHeight: "1.45",
  textWrap: "pretty",
});

export const stackStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: "1.4",
  color: vars.colors.mutedForeground,
});

export const linkStyle = style({
  display: "inline-flex",
  alignItems: "center",
  minHeight: "2.75rem",
  fontFamily: vars.fontFamily.doto,
  ...weight(vars.fontWeight.extrabold),
  fontSize: vars.fontSize.base,
  letterSpacing: "0.1em",
  color: vars.colors.foreground,
  textDecoration: "none",
  ":hover": {
    textDecoration: "underline",
    textUnderlineOffset: "4px",
  },
});
