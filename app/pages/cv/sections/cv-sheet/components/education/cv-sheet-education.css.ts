import { style } from "@vanilla-extract/css";
import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";

export const list = style({
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const degree = style({
  margin: 0,
  fontSize: "inherit",
  ...weight(600),
  lineHeight: "inherit",
});

export const school = style({
  margin: 0,
  color: vars.colors.mutedForeground,
});
