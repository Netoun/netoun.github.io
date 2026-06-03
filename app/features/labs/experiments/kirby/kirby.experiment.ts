import kirbyCss from "@/components/misc/kirby/kirby.css.ts?raw";
import kirbySource from "@/components/misc/kirby/kirby.component.tsx?raw";
import type { LabExperiment } from "../../data/labs.types";
import { KirbyDemo } from "./kirby.demo";
import demoSource from "./kirby.demo.tsx?raw";

export const kirbyExperiment: LabExperiment = {
  slug: "kirby",
  title: "Kirby",
  description:
    "A hand-built decorative SVG character rendered as a pure-CSS animated illustration — no raster assets, no external library.",
  tags: ["SVG", "illustration", "decorative"],
  group: "SVG",
  accent: "primary",
  icon: "🌸",
  Demo: KirbyDemo,
  sources: [
    { label: "kirby.demo.tsx", code: demoSource, lang: "tsx" },
    { label: "kirby.component.tsx", code: kirbySource, lang: "tsx" },
    { label: "kirby.css.ts", code: kirbyCss, lang: "ts" },
  ],
};
