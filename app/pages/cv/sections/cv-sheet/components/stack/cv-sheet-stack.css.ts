import { createVar, style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@styles/theme.css";
import { laneColors } from "@/features/experiences/components/experience-log/experience-log.css";
import { label, u } from "../../cv-sheet-metrics";

/** The meter's length: the domain's tools against the largest domain. */
export const shareVar = createVar();

export const groups = style({
  display: "flex",
  flexDirection: "column",
  gap: u(6),
  margin: 0,
});

export const meterRow = style({
  ...label,
  display: "grid",
  gridTemplateColumns: `${u(100)} minmax(0, 1fr) ${u(20)}`,
  alignItems: "center",
  columnGap: u(6),
  margin: 0,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
});

const meter = style({
  height: u(8),
  width: `calc(${shareVar} * 100%)`,
});

// The monitor's segmented bars, in the domain's lane colour.
export const meters = styleVariants(
  { ...laneColors, tooling: vars.colors.mutedForeground },
  (color) => [
    meter,
    {
      backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 ${u(3)}, transparent ${u(3)} ${u(5)})`,
    },
  ],
);

export const count = style({
  textAlign: "right",
  color: vars.colors.mutedForeground,
  fontVariantNumeric: "tabular-nums",
});

export const tools = style({
  margin: 0,
  textWrap: "pretty",
});
