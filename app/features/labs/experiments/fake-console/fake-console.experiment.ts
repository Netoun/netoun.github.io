import componentCss from "@/components/misc/fake-console/fake-console.css.ts?raw";
import componentSource from "@/components/misc/fake-console/fake-console.component.tsx?raw";
import type { LabExperiment } from "../../data/labs.types";
import { FakeConsoleDemo } from "./fake-console.demo";
import demoSource from "./fake-console.demo.tsx?raw";

const COMPONENT = "fake-console.component.tsx";

export const fakeConsoleExperiment: LabExperiment = {
  slug: "fake-console",
  title: "Fake Console",
  description:
    "A log reel that rolls in one seeded line every 500 ms — ten LCG draws a line, the DOM written by hand, no React render per line.",
  tags: ["DOM", "LCG", "reel", "console", "no re-render"],
  group: "HUD",
  accent: "secondary",
  engine: "DOM",
  xray: true,
  Demo: FakeConsoleDemo,
  sources: [
    {
      label: COMPONENT,
      code: componentSource,
      lang: "tsx",
      path: "app/components/misc/fake-console/fake-console.component.tsx",
      role: "technique",
    },
    {
      label: "fake-console.css.ts",
      code: componentCss,
      lang: "ts",
      path: "app/components/misc/fake-console/fake-console.css.ts",
      role: "styles",
    },
    {
      label: "fake-console.demo.tsx",
      code: demoSource,
      lang: "tsx",
      path: "app/features/labs/experiments/fake-console/fake-console.demo.tsx",
      role: "demo",
    },
  ],
  manual: {
    name: "a console that rolls in one generated log line at a time.",
    how: [
      {
        lead: "Ten draws a line.",
        body: "Each line comes from the previous line's seed: one draw `% 8` picks the process, one `% 8` its state, one `% 100` its load, and seven `% 16` its hash. The first seed is `0x1a2b3c4d`, so the log is the same on every load.",
        refs: [
          { source: COMPONENT, from: "const lcg = ", to: "const hexChunk" },
          { source: COMPONENT, from: "export const lineParts = ", to: "const formatLine" },
        ],
      },
      {
        lead: "High bits only.",
        body: "Every field reads `seed >>> 16`. An LCG's lowest bits repeat fast (the lowest three every 8 draws): read from them, `% 8` looped the log every four lines (this xray showed it).",
        refs: [
          {
            source: COMPONENT,
            from: "// Reads the draw's high bits",
            to: "return [(next >>> 16) % max, next];",
          },
        ],
      },
      {
        lead: "Drawn before it moves.",
        body: "The new line is painted at rest below the window; on the next frame the reel gets one line's height as `reelShift` and rolls up in 250 ms. Once it lands, the lines move up one slot and the reel snaps back to 0 — nothing moves on screen.",
        refs: [
          { source: COMPONENT, from: "const scheduleTick = () => {", to: "}, tickMsRef.current);" },
        ],
      },
      {
        lead: "Two rows to spare.",
        body: "The reel holds as many lines as the window shows plus two (6 to 30), counted from the measured line height whenever the console is resized, so a line never pops in at an edge.",
        refs: [
          { source: COMPONENT, from: "const updateRowsCountFromHeight", to: "const nextRowsCount" },
          { source: COMPONENT, from: "const measureLineMetrics = () => {", to: "shiftDistance = " },
        ],
      },
    ],
    cost: [
      {
        lead: "One render, ever.",
        body: "React renders 31 empty line nodes once; from then on the reel writes their text, `hidden` and `data-dim` itself, and only when a value changes.",
        refs: [
          { source: COMPONENT, from: "const syncLineNode = ", to: "const nextPending" },
          {
            source: COMPONENT,
            from: "// The reel is driven imperatively",
            to: "useEffect(() => {",
          },
        ],
      },
      {
        lead: "Timers, not frames.",
        body: "A `setTimeout` per line and one per roll, no `requestAnimationFrame` loop; paused or under `prefers-reduced-motion`, every timer is cleared and the reel rests.",
        refs: [
          {
            source: COMPONENT,
            from: "const stopAnimation = () => {",
            to: "const updateAnimationState",
          },
        ],
      },
    ],
    seeAlso: [
      { slug: "computer-3d", text: "this console is zone 1 of its screen." },
      { slug: "glitch-signal-map", text: "the same `lcg`, as a grid." },
    ],
  },
};
