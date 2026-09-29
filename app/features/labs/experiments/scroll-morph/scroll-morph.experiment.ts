import type { LabExperiment } from "../../data/labs.types";
import { ScrollMorphDemo } from "./scroll-morph.demo";
import techniqueCss from "./scroll-morph.css.ts?raw";
import demoCss from "./scroll-morph.demo.css.ts?raw";
import demoSource from "./scroll-morph.demo.tsx?raw";

const TECHNIQUE = "scroll-morph.css.ts";
const DEMO_CSS = "scroll-morph.demo.css.ts";
const DEMO = "scroll-morph.demo.tsx";

export const scrollMorphExperiment: LabExperiment = {
  slug: "scroll-morph",
  title: "Scroll Morph",
  description:
    "The hero's frame closing in on the content column as the page scrolls — one clip-path keyframe on a scroll timeline, no scroll listener.",
  tags: ["CSS", "scroll-driven animations", "animation-timeline", "clip-path", "sticky"],
  group: "Scroll",
  accent: "tertiary",
  engine: "CSS",
  xray: true,
  Demo: ScrollMorphDemo,
  sources: [
    {
      label: TECHNIQUE,
      code: techniqueCss,
      lang: "ts",
      path: "app/features/labs/experiments/scroll-morph/scroll-morph.css.ts",
      role: "technique",
    },
    {
      label: DEMO_CSS,
      code: demoCss,
      lang: "ts",
      path: "app/features/labs/experiments/scroll-morph/scroll-morph.demo.css.ts",
      role: "styles",
    },
    {
      label: DEMO,
      code: demoSource,
      lang: "tsx",
      path: "app/features/labs/experiments/scroll-morph/scroll-morph.demo.tsx",
      role: "demo",
    },
  ],
  manual: {
    name: "a frame that tightens onto the page's column as it scrolls, in CSS alone.",
    how: [
      {
        lead: "The scroll is the clock.",
        body: "The scroller names a timeline (`scroll-timeline: --lab-morph block`); the frame's animation reads it (`animation-timeline: --lab-morph`) instead of time, over `animation-range: 0 160px`. The home's hero does the same on the page itself, `scroll(root block)`, landed after half a screen.",
        refs: [
          { source: TECHNIQUE, from: "export const scroller = style({", to: "scrollTimeline:" },
          { source: TECHNIQUE, from: "animationName: frameTighten,", to: "animationRange:" },
        ],
      },
      {
        lead: "Only the edges move.",
        body: "One keyframe, `inset(0 0)` to `inset(0 gutter)` on `clip-path`: the sides close in on the content column and nothing scales, so the text inside never reflows. `linear`, because the hand on the scroll is the easing.",
        refs: [{ source: TECHNIQUE, from: "const frameTighten = keyframes({", to: "});" }],
      },
      {
        lead: "Pinned while it lands.",
        body: "The frame's stage is `position: sticky` and a spacer as tall as the range follows it, so the first scroll tightens the frame before the page moves on.",
        refs: [
          { source: TECHNIQUE, from: "export const pin = style({", to: "});" },
          { source: DEMO_CSS, from: "export const spacer" },
        ],
      },
      {
        lead: "The xray's bar is the same timeline.",
        body: "The gold bar under the page is a second animation on `--lab-morph` with the same range, `scaleX(0 → 1)`: it shows the timeline's progress without a line of script.",
        refs: [
          { source: DEMO_CSS, from: "export const timelineFill = style({", to: "animationRange:" },
        ],
      },
    ],
    cost: [
      {
        lead: "No listener, no measure.",
        body: "The browser advances the animation as it scrolls, on the compositor where it can: no `scroll` event, no `getBoundingClientRect`, the same frame before and after hydration. This Lab's slider and readout do listen, to print the numbers; the frame never does.",
        refs: [
          {
            source: DEMO,
            from: "// The Lab's slider and readout follow the scroll",
            to: "onScroll=",
          },
        ],
      },
      {
        lead: "Opt-in.",
        body: "Behind `@supports (animation-timeline: scroll())` and `prefers-reduced-motion: no-preference`: elsewhere the frame stays open, as the home's does.",
        refs: [
          { source: TECHNIQUE, from: "export const morphSupports", to: "export const morphMotion" },
          { source: DEMO_CSS, from: "export const note = style({", to: "});" },
        ],
      },
    ],
    seeAlso: [{ slug: "mesh-background", text: "the gradient that fills the hero's frame." }],
  },
};
