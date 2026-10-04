import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";
import { laneColors } from "@/features/experiences/components/experience-log/experience-log.css";
import { label, u } from "../../cv-sheet-metrics";

// `netoun ps --projects` on paper: each project a process, its PID and its state on its first
// line, the address it runs at on its last.

export const grid = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: `${u(10)} ${u(16)}`,
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const process = style({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  paddingTop: u(6),
  borderTop: `1px solid ${vars.colors.cardBorder}`,
});

export const head = style({
  display: "flex",
  alignItems: "baseline",
  gap: u(8),
});

export const pid = style({
  ...label,
  letterSpacing: "0.06em",
  color: vars.colors.mutedForeground,
});

export const title = style({
  flexGrow: 1,
  minWidth: 0,
  margin: 0,
  fontSize: u(13.55),
  ...weight(600),
  lineHeight: "inherit",
});

export const status = style({
  ...label,
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  gap: u(5),
  letterSpacing: "0.08em",
});

const led = style({
  width: u(6),
  height: u(6),
  borderRadius: vars.radius.full,
});

// The monitor's LEDs: mint for a live site, violet for source on GitHub.
export const leds = styleVariants(
  { live: laneColors.frontend, source: laneColors.backend },
  (color) => [led, { backgroundColor: color }],
);

export const text = style({
  margin: 0,
  textWrap: "pretty",
});

export const foot = style({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  columnGap: u(8),
  margin: 0,
  color: vars.colors.mutedForeground,
});

export const address = style({
  minWidth: 0,
  color: "inherit",
  textDecoration: "none",
  overflowWrap: "anywhere",
  ":hover": { textDecoration: "underline", textUnderlineOffset: u(3) },
});

export const date = style({
  ...label,
  fontVariantNumeric: "tabular-nums",
});
