import { style } from "@vanilla-extract/css";
import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";
import { u } from "../../cv-sheet-metrics";

export const pointer = style({
  display: "flex",
  flexDirection: "column",
  gap: u(8),
});

// The site's command pill (work log, Labs tree, man pages): ink, gold prompt. Small, so the
// printed page keeps its ink to a line.
export const command = style({
  alignSelf: "flex-start",
  display: "inline-flex",
  alignItems: "center",
  gap: u(7),
  height: u(28),
  padding: `0 ${u(12)}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.colors.foreground,
  color: vars.colors.background,
  fontFamily: vars.fontFamily.doto,
  ...weight(900),
  fontSize: u(12),
  letterSpacing: "0.04em",
  textDecoration: "none",
  whiteSpace: "nowrap",
  vars: { [vars.colors.ring]: vars.colors.primary },
});

export const prompt = style({
  width: u(13),
  height: u(10),
  fill: vars.colors.primary,
});

export const cursor = style({
  width: "0.5em",
  height: "1em",
  marginLeft: u(-3),
  backgroundColor: vars.colors.primary,
});

export const text = style({
  margin: 0,
  textWrap: "pretty",
});
