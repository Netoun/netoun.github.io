import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@styles/theme.css";
import { laneColors } from "@/features/experiences/components/experience-log/experience-log.css";
import { u } from "../../cv-sheet-metrics";

export const tools = style({
  display: "flex",
  flexWrap: "wrap",
  columnGap: u(10),
  margin: 0,
  padding: 0,
  listStyle: "none",
  color: vars.colors.mutedForeground,
});

export const tool = style({
  display: "inline-flex",
  alignItems: "center",
  gap: u(4),
});

const tick = style({
  flexShrink: 0,
  width: u(6),
  height: u(6),
  borderRadius: vars.radius.full,
});

// The domain's lane colour; tooling stays graphite, as the tag primitive leaves it neutral.
export const ticks = styleVariants(
  { ...laneColors, tooling: vars.colors.mutedForeground },
  (color) => [tick, { backgroundColor: color }],
);
