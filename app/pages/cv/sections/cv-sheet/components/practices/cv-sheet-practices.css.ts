import { style } from "@vanilla-extract/css";
import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";
import { laneColors } from "@/features/experiences/components/experience-log/experience-log.css";
import { LINE, u } from "../../cv-sheet-metrics";

export const list = style({
  display: "flex",
  flexDirection: "column",
  gap: u(6),
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const practice = style({
  display: "grid",
  gridTemplateColumns: `${u(16)} minmax(0, 1fr)`,
});

// The readout's check, in dots, in mint: the practice runs.
export const check = style({
  width: u(9),
  height: LINE,
  fill: laneColors.frontend,
});

export const title = style({
  margin: 0,
  fontSize: "inherit",
  ...weight(600),
  lineHeight: "inherit",
});

export const tools = style({
  margin: 0,
  color: vars.colors.mutedForeground,
});
