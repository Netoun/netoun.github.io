import serverUnitCss from "@/components/misc/server-unit/server-unit.css.ts?raw";
import serverUnitSource from "@/components/misc/server-unit/server-unit.component.tsx?raw";
import type { LabExperiment } from "../../data/labs.types";
import { ServerUnit3dDemo } from "./server-unit-3d.demo";
import demoSource from "./server-unit-3d.demo.tsx?raw";

const COMPONENT = "server-unit.component.tsx";
const CSS = "server-unit.css.ts";

export const serverUnit3dExperiment: LabExperiment = {
  slug: "server-unit-3d",
  title: "3D Server Rack",
  description:
    "A stacked server rack in CSS 3D with deterministic, seed-driven status LEDs — resize it, reseed it, spin it around.",
  tags: ["CSS 3D", "transforms", "LED seed", "deterministic"],
  group: "3D CSS",
  accent: "secondary",
  engine: "CSS 3D",
  xray: true,
  Demo: ServerUnit3dDemo,
  sources: [
    {
      label: COMPONENT,
      code: serverUnitSource,
      lang: "tsx",
      path: "app/components/misc/server-unit/server-unit.component.tsx",
      role: "technique",
    },
    {
      label: CSS,
      code: serverUnitCss,
      lang: "ts",
      path: "app/components/misc/server-unit/server-unit.css.ts",
      role: "styles",
    },
    {
      label: "server-unit-3d.demo.tsx",
      code: demoSource,
      lang: "tsx",
      path: "app/features/labs/experiments/server-unit-3d/server-unit-3d.demo.tsx",
      role: "demo",
    },
  ],
  manual: {
    name: "a server rack in CSS 3D whose status LEDs are drawn from one seed.",
    how: [
      {
        lead: "Three boxes in a cabinet.",
        body: "Each server is a `preserve-3d` box of six faces, 96 px deep; the rack stacks three of them in a flex column and closes them in two side panels and two caps.",
        refs: [
          { source: CSS, from: "const serverDepth = ", to: "const serverHalfDepth" },
          {
            source: CSS,
            from: "export const serverFaceBackStyle",
            to: "export const serverFaceRightStyle",
          },
          {
            source: COMPONENT,
            from: "{RACK_UNITS.map(",
            to: '<span className={styles.cabinetCapStyle} data-edge="bottom" />',
          },
        ],
      },
      {
        lead: "Hardware without DOM.",
        body: "Behind each bezel, the drive caddies, the grille and the tape slots are stacked CSS gradients on one panel; the drive LEDs flicker on a `steps(1)` keyframe.",
        refs: [
          {
            source: CSS,
            from: "// Each unit shows its own hardware",
            to: "export const ledGridVariantBStyle",
          },
        ],
      },
      {
        lead: "One seed, twelve LEDs.",
        body: "The rack's seed `s` gives its units `s`, `s + 7` and `s + 13`; each unit's four LEDs take the phase `fract(sin(n·127.1 + 311.7)·43758.5453)` of `n = seed × 110…140`. The same seed always lights the same rack.",
        refs: [
          {
            source: COMPONENT,
            from: "function pseudoRandom",
            to: "export function serverUnitCode",
          },
        ],
      },
      {
        lead: "The phase sets the breath.",
        body: "An LED breathes over `1.4 s + phase × 1.9 s` and starts `phase × 3 s` into its cycle, so no two blink together; the phase is the one value each LED gets inline.",
        refs: [
          { source: CSS, from: "export const serverLedTiming", to: "export const serverPull" },
          { source: COMPONENT, from: "style={assignInlineVars({ [styles.serverLedSeed]:" },
        ],
      },
    ],
    cost: [
      {
        lead: "CSS animations only.",
        body: "No script runs once the rack is drawn: every blink is a CSS animation, all paused (`animation-play-state`) while the rack is off screen and dropped under `prefers-reduced-motion`.",
        refs: [
          {
            source: COMPONENT,
            from: "const { ref, isIntersecting } = useIntersectionObserver",
            to: "data-server-rack-paused=",
          },
          { source: CSS, from: "export const statusLedStyle", to: "export const statusLabelStyle" },
        ],
      },
    ],
    seeAlso: [
      { slug: "patch-bay", text: "cables that plug into jacks like the footer's." },
      { slug: "computer-3d", text: "the same six-face box, as a laptop." },
    ],
  },
};
