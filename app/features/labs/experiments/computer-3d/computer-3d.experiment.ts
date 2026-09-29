import computerCss from "@/components/misc/computer/computer.css.ts?raw";
import computerSource from "@/components/misc/computer/computer.component.tsx?raw";
import type { LabExperiment } from "../../data/labs.types";
import { Computer3dDemo } from "./computer-3d.demo";
import demoSource from "./computer-3d.demo.tsx?raw";

const COMPONENT = "computer.component.tsx";
const CSS = "computer.css.ts";
const DEMO = "computer-3d.demo.tsx";

export const computer3dExperiment: LabExperiment = {
  slug: "computer-3d",
  title: "3D Computer",
  description:
    "A retro computer workstation built entirely with CSS 3D transforms — no WebGL, just perspective and transform-style: preserve-3d.",
  tags: ["CSS 3D", "3D computer", "transforms", "no-WebGL", "retro"],
  group: "3D CSS",
  accent: "secondary",
  engine: "CSS 3D",
  xray: true,
  Demo: Computer3dDemo,
  sources: [
    {
      label: COMPONENT,
      code: computerSource,
      lang: "tsx",
      path: "app/components/misc/computer/computer.component.tsx",
      role: "technique",
    },
    {
      label: CSS,
      code: computerCss,
      lang: "ts",
      path: "app/components/misc/computer/computer.css.ts",
      role: "styles",
    },
    {
      label: DEMO,
      code: demoSource,
      lang: "tsx",
      path: "app/features/labs/experiments/computer-3d/computer-3d.demo.tsx",
      role: "demo",
    },
  ],
  manual: {
    name: "a laptop made of two CSS boxes, with the home's four widgets live on its screen.",
    how: [
      {
        lead: "Two boxes, twelve faces.",
        body: "The lid and the chassis are each a `preserve-3d` frame of six faces, 10 px deep: the back sits at `translateZ(-10px)`, the four edges are 10 px strips turned 90°.",
        refs: [{ source: CSS, from: "export const computerFaceTransforms = {", to: "} as const;" }],
      },
      {
        lead: "One camera.",
        body: "The container holds `perspective: 2000px` from its top left corner; the lid leans at `rotateY(-45deg) rotateX(15deg)`, the chassis lies flat at `rotateX(90deg)`.",
        refs: [
          { source: CSS, from: "export const computerStyle = style({", to: "perspectiveOrigin:" },
          { source: CSS, from: "export const computerFrameTransforms = {", to: "} as const;" },
        ],
      },
      {
        lead: "A real screen inside.",
        body: "The lid's front face is the only one left in the accessibility tree: it hosts the four widgets on a 3 × 3 grid, each one its own Lab. Every other face is `aria-hidden` and `inert`.",
        refs: [
          { source: COMPONENT, from: "{/* Front face stays in the a11y tree", to: "{children}" },
          { source: DEMO, from: "const ZONES: ", to: "];" },
        ],
      },
      {
        lead: "Keys sized by their face.",
        body: "The chassis face is a size container (`container-type: inline-size`): the keyboard and the trackpad are measured in `cqi`, so they scale with the laptop instead of the page.",
        refs: [
          {
            source: CSS,
            from: "export const computerFrameChassisFrontStyle",
            to: 'containerType: "inline-size",',
          },
          { source: CSS, from: "export const computerTrackpadStyle", to: "borderRadius:" },
        ],
      },
      {
        lead: "Exploded, not rebuilt.",
        body: "The xray appends one `translateZ(±n px)` to each face's own transform. In a turned face's frame local Z is its normal, so the same step pushes every face outward.",
        refs: [
          { source: CSS, from: "const faceNormal: ", to: "const explodedTransform" },
          { source: CSS, from: "for (const face of Object.keys(", to: "transition:" },
        ],
      },
    ],
    cost: [
      {
        lead: "No canvas for the machine.",
        body: "The laptop is DOM faces and CSS. Only the four widgets on its screen draw, and they stop when the stage leaves the viewport or the screen is paused.",
        refs: [{ source: DEMO, from: "const animating = " }],
      },
      {
        lead: "Transforms only.",
        body: "Rotation, zoom and the explode change `transform` alone: no layout runs while a slider moves.",
        refs: [
          { source: DEMO, from: "style={assignInlineVars({", to: "})}" },
          { source: COMPONENT, from: "[styles.computerExplode]:" },
        ],
      },
    ],
    seeAlso: [
      { slug: "fake-console", text: "zone 1 of the screen." },
      { slug: "glitch-signal-map", text: "zone 2." },
      { slug: "cybernetic-glyph-grid", text: "zone 3." },
      { slug: "system-metrics", text: "zone 4." },
    ],
  },
};
