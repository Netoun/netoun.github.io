import componentCss from "./patch-bay.css.ts?raw";
import componentSource from "./patch-bay.component.tsx?raw";
import verletSource from "./patch-bay-verlet.ts?raw";
import type { LabExperiment } from "../../data/labs.types";
import { PatchBayDemo } from "./patch-bay.demo";
import demoSource from "./patch-bay.demo.tsx?raw";

const VERLET = "patch-bay-verlet.ts";
const COMPONENT = "patch-bay.component.tsx";

export const patchBayExperiment: LabExperiment = {
  slug: "patch-bay",
  title: "Patch Bay",
  description:
    "Three patch cables that hang, swing and replug: Verlet points under gravity, held together by distance constraints and drawn as one smoothed SVG path each.",
  tags: ["SVG", "Verlet", "constraints", "Bézier", "pointer events"],
  group: "SVG",
  accent: "secondary",
  engine: "SVG",
  xray: true,
  Demo: PatchBayDemo,
  sources: [
    {
      label: VERLET,
      code: verletSource,
      lang: "ts",
      path: "app/features/labs/experiments/patch-bay/patch-bay-verlet.ts",
      role: "technique",
    },
    {
      label: COMPONENT,
      code: componentSource,
      lang: "tsx",
      path: "app/features/labs/experiments/patch-bay/patch-bay.component.tsx",
      role: "technique",
    },
    {
      label: "patch-bay.css.ts",
      code: componentCss,
      lang: "ts",
      path: "app/features/labs/experiments/patch-bay/patch-bay.css.ts",
      role: "styles",
    },
    {
      label: "patch-bay.demo.tsx",
      code: demoSource,
      lang: "tsx",
      path: "app/features/labs/experiments/patch-bay/patch-bay.demo.tsx",
      role: "demo",
    },
  ],
  manual: {
    name: "three patch cables you unplug, swing and replug, in SVG.",
    how: [
      {
        lead: "No velocity stored.",
        body: "Each cable is a chain of 16 points integrated with Verlet: a point's velocity is its last displacement, times the damping, plus gravity.",
        refs: [
          {
            source: VERLET,
            from: "for (let index = 0; index <= last; index += 1) {",
            to: "point.y += vy + gravity;",
          },
        ],
      },
      {
        lead: "Constraints, not springs.",
        body: "Every step, `passes` rounds pull each pair of neighbours back to one link length (rest length ÷ 15); a plugged end is pinned to its jack, a held one to the pointer.",
        refs: [
          {
            source: VERLET,
            from: "for (let pass = 0; pass < params.passes; pass += 1) {",
            to: "b.y -= dy * share * wb;",
          },
        ],
      },
      {
        lead: "One path per cable.",
        body: "The points become one SVG path of cubic Béziers whose handles are Catmull-Rom tangents (a sixth of the chord), stroked four times — shadow, outline, sheath, highlight — like the footer's cable.",
        refs: [
          { source: VERLET, from: "export function cableHandles", to: "export function cablePath" },
          { source: COMPONENT, from: '{(["shadow", "outline", "sheath", "highlight"] as const)' },
        ],
      },
      {
        lead: "Plugs snap, or hang.",
        body: "A plug dropped within 56 px of a free jack the cable can reach plugs in, and the jack's LED takes the cable's colour; anywhere else, it hangs.",
        refs: [
          {
            source: VERLET,
            from: "export function isJackFree",
            to: "export function nearestFreeJack",
          },
        ],
      },
    ],
    cost: [
      {
        lead: "No render per frame.",
        body: "The loop writes each path's `d` and each plug's position straight to the DOM; React only renders what plugging changes (LEDs, labels, the announcement).",
        refs: [{ source: COMPONENT, from: "const draw = () => {", to: "const loop = () => {" }],
      },
      {
        lead: "Asleep when still.",
        body: "Once no point has moved more than 0.02 px for 20 frames, no frame is asked for until a hand wakes it; under `prefers-reduced-motion` every change is solved to rest at once.",
        refs: [
          { source: COMPONENT, from: "const loop = () => {", to: "wakeRef.current = () => {" },
        ],
      },
    ],
    seeAlso: [{ slug: "server-unit-3d", text: "the rack the footer's cable leaves from." }],
  },
};
