import captureCss from "@/components/misc/chrome-capture/chrome-capture.css.ts?raw";
import captureSource from "@/components/misc/chrome-capture/chrome-capture.component.tsx?raw";
import reflectionSource from "@/hooks/use-chrome-reflection.hook.ts?raw";
import type { LabExperiment } from "../../data/labs.types";
import { ChromeCaptureDemo } from "./chrome-capture.demo";
import demoSource from "./chrome-capture.demo.tsx?raw";

const CSS = "chrome-capture.css.ts";
const HOOK = "use-chrome-reflection.hook.ts";
const COMPONENT = "chrome-capture.component.tsx";

export const chromeCaptureExperiment: LabExperiment = {
  slug: "chrome-capture",
  title: "Chrome Capture",
  description:
    "The polished chrome bezel the process monitor and this index set their captures in — a conic-gradient bezel and a glint that follow the pointer, in CSS.",
  tags: ["CSS", "conic-gradient", "mix-blend-mode", "pointer", "custom properties"],
  group: "CSS",
  accent: "tertiary",
  engine: "CSS",
  xray: true,
  Demo: ChromeCaptureDemo,
  sources: [
    {
      label: CSS,
      code: captureCss,
      lang: "ts",
      path: "app/components/misc/chrome-capture/chrome-capture.css.ts",
      role: "technique",
    },
    {
      label: HOOK,
      code: reflectionSource,
      lang: "ts",
      path: "app/hooks/use-chrome-reflection.hook.ts",
      role: "technique",
    },
    {
      label: COMPONENT,
      code: captureSource,
      lang: "tsx",
      path: "app/components/misc/chrome-capture/chrome-capture.component.tsx",
      role: "technique",
    },
    {
      label: "chrome-capture.demo.tsx",
      code: demoSource,
      lang: "tsx",
      path: "app/features/labs/experiments/chrome-capture/chrome-capture.demo.tsx",
      role: "demo",
    },
  ],
  manual: {
    name: "a capture set in polished chrome that turns toward the pointer.",
    how: [
      {
        lead: "Silver from one angle.",
        body: "The bezel is a 5 px `conic-gradient` of nine silver stops, started at `x × 360deg`: moving across the capture turns the light around it.",
        refs: [{ source: CSS, from: "const BEZEL = ", to: "${silver.bright} 90%" }],
      },
      {
        lead: "Two numbers from the pointer.",
        body: "`useChromeReflection` turns the pointer into `x` and `y`, each 0–1 across the surface it listens on, and writes them as two custom properties.",
        refs: [{ source: HOOK, from: "const onMove = ", to: "};" }],
      },
      {
        lead: "The glint is a window on a gradient.",
        body: 'A 115° streak of white and a hair of mint, sized 260 %, slides by `background-position: x·100% y·100%` and lights the capture through `mix-blend-mode: screen`. It shows only while `data-chrome="on"`; on touch it rests at 45 %.',
        refs: [
          { source: CSS, from: "const GLINT = ", to: "transparent 62%)`;" },
          { source: CSS, from: "export const glintStyle", to: "globalStyle(`[data-chrome" },
        ],
      },
      {
        lead: "Glass, always.",
        body: "Over the capture the frame lays a faint top sheen and an inset shadow, so it sits behind glass even with the light still.",
        refs: [
          { source: CSS, from: "const GLASS = " },
          { source: CSS, from: '"::after": {', to: "boxShadow:" },
        ],
      },
      {
        lead: "One sweep per capture.",
        body: "A new capture is remounted (its `key` changes) and plays one 900 ms glint across it: the monitor does it on each project, this demo on Next and Sweep again.",
        refs: [
          { source: CSS, from: "export const sweepStyle", to: "});" },
          { source: "chrome-capture.demo.tsx", from: "key={`${project.slug}-${sweeps}`}" },
        ],
      },
    ],
    cost: [
      {
        lead: "No render per move.",
        body: "The hook writes the two vars at most once per animation frame, straight to the element; React never renders while the pointer moves. Nothing is listened to for touch or under `prefers-reduced-motion`.",
        refs: [
          {
            source: HOOK,
            from: 'if (!window.matchMedia("(hover: hover)',
            to: 'reduce)").matches) return;',
          },
          { source: HOOK, from: "const apply = () => {", to: "};" },
        ],
      },
      {
        lead: "Measured once.",
        body: "The surface's rectangle is read when the pointer enters and again only after a scroll, never on each move.",
        refs: [
          { source: HOOK, from: "const onEnter = () => {", to: "};" },
          { source: HOOK, from: "const onScroll = () => {", to: "};" },
        ],
      },
    ],
  },
};
