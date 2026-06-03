import componentCss from "@/components/misc/system-metrics-panel/system-metrics-panel.css.ts?raw";
import componentSource from "@/components/misc/system-metrics-panel/system-metrics-panel.component.tsx?raw";
import type { LabExperiment } from "../../data/labs.types";
import { SystemMetricsDemo } from "./system-metrics.demo";
import demoSource from "./system-metrics.demo.tsx?raw";

export const systemMetricsExperiment: LabExperiment = {
  slug: "system-metrics",
  title: "System Metrics Panel",
  description:
    "An animated telemetry HUD with live-updating gauges and readouts, easing toward shifting target values.",
  tags: ["HUD", "metrics", "animation", "gauges"],
  group: "HUD",
  accent: "secondary",
  icon: "📊",
  Demo: SystemMetricsDemo,
  sources: [
    { label: "system-metrics.demo.tsx", code: demoSource, lang: "tsx" },
    { label: "system-metrics-panel.component.tsx", code: componentSource, lang: "tsx" },
    { label: "system-metrics-panel.css.ts", code: componentCss, lang: "ts" },
  ],
};
