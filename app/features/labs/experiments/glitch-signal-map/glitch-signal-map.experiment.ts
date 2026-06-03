import componentCss from "@/components/misc/glitch-signal-map/glitch-signal-map.css.ts?raw";
import componentSource from "@/components/misc/glitch-signal-map/glitch-signal-map.component.tsx?raw";
import type { LabExperiment } from "../../data/labs.types";
import { GlitchSignalMapDemo } from "./glitch-signal-map.demo";
import demoSource from "./glitch-signal-map.demo.tsx?raw";

export const glitchSignalMapExperiment: LabExperiment = {
  slug: "glitch-signal-map",
  title: "Glitch Signal Map",
  description:
    "A Canvas 2D signal grid with a per-cell state machine, pulsing accents and glitchy recalibration — throttled to 30fps.",
  tags: ["Canvas 2D", "state machine", "LCG noise", "30fps"],
  group: "HUD",
  accent: "secondary",
  icon: "📡",
  Demo: GlitchSignalMapDemo,
  sources: [
    { label: "glitch-signal-map.demo.tsx", code: demoSource, lang: "tsx" },
    { label: "glitch-signal-map.component.tsx", code: componentSource, lang: "tsx" },
    { label: "glitch-signal-map.css.ts", code: componentCss, lang: "ts" },
  ],
};
