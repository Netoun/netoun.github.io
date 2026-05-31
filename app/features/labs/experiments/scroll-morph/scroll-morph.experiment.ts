import type { LabExperiment } from "../../data/labs.types";
import { ScrollMorphDemo } from "./scroll-morph.demo";
import demoCss from "./scroll-morph.demo.css.ts?raw";
import demoSource from "./scroll-morph.demo.tsx?raw";

export const scrollMorphExperiment: LabExperiment = {
  slug: "scroll-morph",
  title: "Scroll Morph",
  description:
    "A scroll-progress-driven scale & translate morph using an easeInOutQuad curve — scrub it here with the slider.",
  tags: ["scroll", "morph", "easing", "CSS"],
  group: "Scroll",
  accent: "tertiary",
  icon: "🌀",
  Demo: ScrollMorphDemo,
  sources: [
    { label: "scroll-morph.demo.tsx", code: demoSource, lang: "tsx" },
    { label: "scroll-morph.demo.css.ts", code: demoCss, lang: "ts" },
  ],
};
