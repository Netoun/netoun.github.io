import { style } from "@vanilla-extract/css";
import { motion } from "@styles/motion.css";
import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";

// The way home and the file, above the sheet. Screen only: the printout is the sheet alone.
export const toolbar = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  columnGap: vars.spacing.lg,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.sm,
  ...weight(800),
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  "@media": {
    print: { display: "none" },
  },
});

export const path = style({
  display: "flex",
  alignItems: "center",
  margin: 0,
  padding: 0,
  listStyle: "none",
});

// 44px tall: on a phone, these are the page's two controls.
export const link = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5em",
  minHeight: "2.75rem",
  color: vars.colors.foreground,
  textDecoration: "none",
  textUnderlineOffset: "0.3em",
  transition: `color ${motion.duration.fast} ${motion.easing.out}`,
  selectors: {
    "&:hover": { textDecoration: "underline" },
  },
});

export const separator = style({
  paddingInline: "0.6em",
  color: vars.colors.mutedForeground,
});

export const current = style({
  color: vars.colors.mutedForeground,
  textTransform: "none",
});
