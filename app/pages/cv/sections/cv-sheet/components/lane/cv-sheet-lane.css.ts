import { style, styleVariants } from "@vanilla-extract/css";
import { laneColors } from "@/features/experiences/components/experience-log/experience-log.css";
import { LINE, u } from "../../cv-sheet-metrics";

// A git lane in Doto's dots: the commit's `*` on its first line, then a dotted `|` down the
// lines it spans. Drawn, so the PDF's text holds only what a reader reads.

export const lane = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const domain = styleVariants(laneColors, (color) => ({ color }));

export const node = style({
  flexShrink: 0,
  width: u(9),
  height: LINE,
  fill: "currentColor",
});

export const line = style({
  flexGrow: 1,
  width: u(3),
  backgroundImage: `radial-gradient(circle, currentColor 0 ${u(0.9)}, transparent ${u(1.05)})`,
  backgroundSize: `${u(3)} ${u(2.9)}`,
  backgroundPosition: "center top",
  backgroundRepeat: "repeat-y",
  selectors: {
    // The root commit: git draws nothing under it.
    "[data-root] > &": { visibility: "hidden" },
  },
});
