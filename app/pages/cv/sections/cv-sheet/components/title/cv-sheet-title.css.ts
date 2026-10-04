import { style } from "@vanilla-extract/css";
import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";
import { label, promptColor, u } from "../../cv-sheet-metrics";

export const head = style({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: u(12),
});

export const title = style({
  display: "flex",
  alignItems: "baseline",
  gap: u(6),
  margin: 0,
  fontSize: u(15.17),
  ...weight(700),
  lineHeight: u(18),
});

export const prompt = style({
  flexShrink: 0,
  width: u(13),
  height: u(10),
  fill: promptColor,
});

export const command = style({
  ...label,
  letterSpacing: "0.06em",
  color: vars.colors.mutedForeground,
  whiteSpace: "nowrap",
});
