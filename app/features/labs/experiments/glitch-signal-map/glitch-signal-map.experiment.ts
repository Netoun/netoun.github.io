import componentCss from "@/components/misc/glitch-signal-map/glitch-signal-map.css.ts?raw";
import componentSource from "@/components/misc/glitch-signal-map/glitch-signal-map.component.tsx?raw";
import type { LabExperiment } from "../../data/labs.types";
import { GlitchSignalMapDemo } from "./glitch-signal-map.demo";
import demoSource from "./glitch-signal-map.demo.tsx?raw";

const COMPONENT = "glitch-signal-map.component.tsx";

export const glitchSignalMapExperiment: LabExperiment = {
  slug: "glitch-signal-map",
  title: "Glitch Signal Map",
  description:
    "A Canvas 2D signal grid with a per-cell state machine, pulsing accents and glitchy recalibration — throttled to 30fps.",
  tags: ["Canvas 2D", "state machine", "LCG noise", "30fps"],
  group: "HUD",
  accent: "secondary",
  engine: "Canvas 2D",
  xray: true,
  Demo: GlitchSignalMapDemo,
  sources: [
    {
      label: COMPONENT,
      code: componentSource,
      lang: "tsx",
      path: "app/components/misc/glitch-signal-map/glitch-signal-map.component.tsx",
      role: "technique",
    },
    {
      label: "glitch-signal-map.css.ts",
      code: componentCss,
      lang: "ts",
      path: "app/components/misc/glitch-signal-map/glitch-signal-map.css.ts",
      role: "styles",
    },
    {
      label: "glitch-signal-map.demo.tsx",
      code: demoSource,
      lang: "tsx",
      path: "app/features/labs/experiments/glitch-signal-map/glitch-signal-map.demo.tsx",
      role: "demo",
    },
  ],
  manual: {
    name: "a Canvas 2D signal grid driven by one seeded generator.",
    how: [
      {
        lead: "One generator, no Math.random.",
        body: "Every value comes from `lcg(seed) = (seed × 1664525 + 1013904223) >>> 0`, started at `0x5e2d91af`: the grid is the same on every load.",
        refs: [{ source: COMPONENT, from: "const lcg = ", to: "return cells;" }],
      },
      {
        lead: "A scattered walk.",
        body: "Every 250 ms, 4 % of the cells are rewritten (8 of the 222 on this screen), picked at `(tick × 7 + i × 19 + 5) mod n`, so the updates land apart instead of sweeping down the grid.",
        refs: [
          {
            source: COMPONENT,
            from: "const updateBlocks = ",
            to: "const block = blocks[blockIndex];",
          },
        ],
      },
      {
        lead: "Three states from one number.",
        body: "Bits of the new seed decide: `seed & 0x7f ≤ 4` recalibrates (a 120 ms cyan jitter, then it settles), otherwise `5 in 16` turn active, and `1 in 16` carry the pink accent.",
        refs: [
          {
            source: COMPONENT,
            from: "const nextSeed = lcg(block.seed);",
            to: "block.settleSeed = ",
          },
        ],
      },
      {
        lead: "Breathing, not blinking.",
        body: "Active and accent cells pulse on a 3.4 s sine, each shifted by `(i × 11 mod 240) / 80` s, so the pulse ripples across the grid.",
        refs: [
          { source: COMPONENT, from: "pulseDelay: ((index * 11)" },
          {
            source: COMPONENT,
            from: "} else if (block.accent) {",
            to: "alpha = 0.48 + 0.24 * pulse;",
          },
        ],
      },
    ],
    cost: [
      {
        lead: "Capped.",
        body: "At most 30 draws a second (`1000 / 30` ms apart), `devicePixelRatio` held at 1.5, one `fillRect` per cell.",
        refs: [
          { source: COMPONENT, from: "const shouldDrawFrame", to: "draw(now);" },
          { source: COMPONENT, from: "const MAX_DPR", to: "const TARGET_FRAME_MS" },
        ],
      },
      {
        lead: "Idle when still.",
        body: "Paused, or under `prefers-reduced-motion`: one last frame, then no `requestAnimationFrame` at all.",
        refs: [
          { source: COMPONENT, from: "const stopLoop = () => {", to: "};" },
          { source: COMPONENT, from: "const updateReducedMotion = () => {", to: "};" },
        ],
      },
    ],
    seeAlso: [{ slug: "computer-3d", text: "this grid is zone 2 of its screen." }],
  },
};
