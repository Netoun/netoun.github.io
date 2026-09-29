import componentCss from "@/components/misc/system-metrics-panel/system-metrics-panel.css.ts?raw";
import componentSource from "@/components/misc/system-metrics-panel/system-metrics-panel.component.tsx?raw";
import type { LabExperiment } from "../../data/labs.types";
import { SystemMetricsDemo } from "./system-metrics.demo";
import demoSource from "./system-metrics.demo.tsx?raw";

const COMPONENT = "system-metrics-panel.component.tsx";

export const systemMetricsExperiment: LabExperiment = {
  slug: "system-metrics",
  title: "System Metrics Panel",
  description:
    "A telemetry HUD whose six meters wander ±1 a tick on fixed drift sequences — no random numbers, a pure function of the tick.",
  tags: ["HUD", "metrics", "deterministic", "gauges"],
  group: "HUD",
  accent: "secondary",
  engine: "DOM",
  xray: true,
  Demo: SystemMetricsDemo,
  sources: [
    {
      label: COMPONENT,
      code: componentSource,
      lang: "tsx",
      path: "app/components/misc/system-metrics-panel/system-metrics-panel.component.tsx",
      role: "technique",
    },
    {
      label: "system-metrics-panel.css.ts",
      code: componentCss,
      lang: "ts",
      path: "app/components/misc/system-metrics-panel/system-metrics-panel.css.ts",
      role: "styles",
    },
    {
      label: "system-metrics.demo.tsx",
      code: demoSource,
      lang: "tsx",
      path: "app/features/labs/experiments/system-metrics/system-metrics.demo.tsx",
      role: "demo",
    },
  ],
  manual: {
    name: "six telemetry meters computed from nothing but a tick counter.",
    how: [
      {
        lead: "A function of the tick.",
        body: "A meter's value is its base, plus its eight-step drift sequence summed up to `tick % 8`, plus one when it pulses. No state but the counter: the prerendered frame and any later one are the same function.",
        refs: [{ source: COMPONENT, from: "export function metricsAt", to: "export const bandOf" }],
      },
      {
        lead: "Sequences that sum to zero.",
        body: "Each sequence of `+1`, `0`, `−1` cancels out over its eight steps, and the pulse comes round every 12 ticks (three ticks apart from one meter to the next): the panel loops every 24 ticks, 14.9 s.",
        refs: [
          { source: COMPONENT, from: "// Each sums to zero", to: "] as const;" },
          { source: COMPONENT, from: "export const isPulsing" },
        ],
      },
      {
        lead: "It used to creep.",
        body: "The meters once kept each pulse: after five minutes on the page every one sat at 95–96 %. The xray's drift table made it plain; now the bump lasts one tick.",
        refs: [{ source: COMPONENT, from: "The pulse is never kept", to: "creeping to the top." }],
      },
      {
        lead: "Three bands.",
        body: "Under 40 a bar is gold, from 70 violet, mint between; the fill is a width set inline as `metricFill`.",
        refs: [
          {
            source: COMPONENT,
            from: "export const BANDS",
            to: "export const SYSTEM_METRICS_DEFAULTS",
          },
          { source: COMPONENT, from: "style={assignInlineVars({ [styles.metricFill]:" },
        ],
      },
    ],
    cost: [
      {
        lead: "One render a tick.",
        body: "A `setInterval` every 620 ms bumps the counter and React renders six rows; the home passes `isAnimating={false}` while its screen is off view, and under `prefers-reduced-motion` no interval runs.",
        refs: [
          {
            source: COMPONENT,
            from: "if (!isAnimating || prefersReducedMotion) return;",
            to: "}, [isAnimating, prefersReducedMotion, tickMs]);",
          },
        ],
      },
    ],
    seeAlso: [{ slug: "computer-3d", text: "this panel is zone 4 of its screen." }],
  },
};
