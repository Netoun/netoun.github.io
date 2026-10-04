import { style } from "@vanilla-extract/css";
import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";
import { label, promptColor, u } from "../../cv-sheet-metrics";

// `fastfetch --logo netoun`, as the Skills section prints it: the logo, then the user@host
// readout. The name and the lead sit between them, where a résumé is read first.

export const header = style({
  display: "grid",
  gridTemplateColumns: `${u(92)} minmax(0, 1fr) ${u(248)}`,
  columnGap: u(22),
  alignItems: "start",
});

export const logo = style({
  display: "block",
  width: "100%",
  height: "auto",
  marginTop: u(4),
  color: vars.colors.foreground,
});

export const identity = style({
  display: "flex",
  flexDirection: "column",
  gap: u(4),
});

export const name = style({
  margin: 0,
  fontSize: u(32.5),
  ...weight(700),
  lineHeight: 1.05,
  letterSpacing: "-0.03em",
});

export const tagline = style({
  margin: 0,
  fontSize: u(16.25),
  lineHeight: 1.3,
});

export const lead = style({
  margin: `${u(6)} 0 0`,
  fontSize: u(14.08),
  lineHeight: 1.38,
  textWrap: "pretty",
});

export const prompt = style({
  display: "inline-block",
  width: u(13),
  height: u(10),
  marginRight: u(6),
  fill: promptColor,
});

// `▐`, the shell's cursor, after the last word. Static: the sheet is a printout.
export const cursor = style({
  display: "inline-block",
  width: "0.5em",
  height: "1em",
  marginLeft: u(3),
  verticalAlign: "-0.15em",
  backgroundColor: promptColor,
});

export const readout = style({
  display: "flex",
  flexDirection: "column",
});

export const user = style({
  margin: 0,
  fontFamily: vars.fontFamily.doto,
  ...weight(900),
  fontSize: u(13),
  lineHeight: u(18),
  letterSpacing: "0.04em",
});

export const at = style({
  color: vars.colors.mutedForeground,
});

// fastfetch's `--------------` under the title, in dots.
export const underline = style({
  width: u(14 * 8.2),
  height: u(12),
  marginBottom: u(2),
  backgroundImage: `radial-gradient(circle, ${vars.colors.mutedForeground} 0 ${u(0.9)}, transparent ${u(1.05)})`,
  backgroundSize: `${u(2.9)} 100%`,
  backgroundRepeat: "repeat-x",
});

export const list = style({
  margin: 0,
});

export const row = style({
  display: "grid",
  gridTemplateColumns: `${u(76)} minmax(0, 1fr)`,
  alignItems: "baseline",
  whiteSpace: "nowrap",
});

export const key = style({
  ...label,
  color: vars.colors.foreground,
});

export const value = style({
  margin: 0,
  minWidth: 0,
});

export const link = style({
  color: "inherit",
  textDecoration: "none",
  ":hover": { textDecoration: "underline", textUnderlineOffset: u(3) },
});
