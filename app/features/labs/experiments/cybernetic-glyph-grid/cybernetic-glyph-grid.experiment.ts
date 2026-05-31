import componentCss from "@/components/misc/cybernetic-glyph-grid/cybernetic-glyph-grid.css.ts?raw";
import componentSource from "@/components/misc/cybernetic-glyph-grid/cybernetic-glyph-grid.component.tsx?raw";
import type { LabExperiment } from "../../data/labs.types";
import { CyberneticGlyphGridDemo } from "./cybernetic-glyph-grid.demo";
import demoSource from "./cybernetic-glyph-grid.demo.tsx?raw";

export const cyberneticGlyphGridExperiment: LabExperiment = {
  slug: "cybernetic-glyph-grid",
  title: "Cybernetic Glyph Grid",
  description:
    "A Canvas 2D grid of hex pairs and glitch glyphs that pulse, flicker and re-randomize on a deterministic timer.",
  tags: ["Canvas 2D", "glyphs", "hex", "glitch"],
  group: "HUD",
  accent: "secondary",
  icon: "🔡",
  Demo: CyberneticGlyphGridDemo,
  sources: [
    { label: "cybernetic-glyph-grid.demo.tsx", code: demoSource, lang: "tsx" },
    { label: "cybernetic-glyph-grid.component.tsx", code: componentSource, lang: "tsx" },
    { label: "cybernetic-glyph-grid.css.ts", code: componentCss, lang: "ts" },
  ],
};
