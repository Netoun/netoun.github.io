import { style } from "@vanilla-extract/css";
import { motion } from "@styles/motion.css";
import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";

export const pathStyle = style({
  paddingTop: vars.spacing.md,
});

export const listStyle = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  margin: 0,
  padding: 0,
  listStyle: "none",
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.sm,
  ...weight(800),
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});

export const itemStyle = style({
  display: "inline-flex",
  alignItems: "center",
});

// 44px tall: the path is the way home on a phone.
export const linkStyle = style({
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

export const separatorStyle = style({
  paddingInline: "0.6em",
  color: vars.colors.mutedForeground,
});

export const currentStyle = style({
  color: vars.colors.mutedForeground,
});

// A slug is a path segment: printed as it is typed.
export const slugStyle = style({
  textTransform: "none",
});
