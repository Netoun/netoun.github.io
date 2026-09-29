import componentCss from "@/components/misc/cybernetic-glyph-grid/cybernetic-glyph-grid.css.ts?raw";
import componentSource from "@/components/misc/cybernetic-glyph-grid/cybernetic-glyph-grid.component.tsx?raw";
import type { LabExperiment } from "../../data/labs.types";
import { CyberneticGlyphGridDemo } from "./cybernetic-glyph-grid.demo";
import demoSource from "./cybernetic-glyph-grid.demo.tsx?raw";

const COMPONENT = "cybernetic-glyph-grid.component.tsx";

export const cyberneticGlyphGridExperiment: LabExperiment = {
  slug: "cybernetic-glyph-grid",
  title: "Cybernetic Glyph Grid",
  description:
    "A Canvas 2D grid of hex pairs and glitch glyphs that pulse, flicker and re-randomize on a deterministic timer.",
  tags: ["Canvas 2D", "glyphs", "hex", "glitch"],
  group: "HUD",
  accent: "secondary",
  engine: "Canvas 2D",
  xray: true,
  Demo: CyberneticGlyphGridDemo,
  sources: [
    {
      label: COMPONENT,
      code: componentSource,
      lang: "tsx",
      path: "app/components/misc/cybernetic-glyph-grid/cybernetic-glyph-grid.component.tsx",
      role: "technique",
    },
    {
      label: "cybernetic-glyph-grid.css.ts",
      code: componentCss,
      lang: "ts",
      path: "app/components/misc/cybernetic-glyph-grid/cybernetic-glyph-grid.css.ts",
      role: "styles",
    },
    {
      label: "cybernetic-glyph-grid.demo.tsx",
      code: demoSource,
      lang: "tsx",
      path: "app/features/labs/experiments/cybernetic-glyph-grid/cybernetic-glyph-grid.demo.tsx",
      role: "demo",
    },
  ],
  manual: {
    name: "a Canvas 2D grid of hex pairs that glitch and settle, drawn from a glyph atlas.",
    how: [
      {
        lead: "Text drawn once.",
        body: "A glowing `fillText` (`shadowBlur`) is the costly part, so each glyph is drawn once, per value, tone, font size and pixel ratio, on its own small canvas; every frame after that is one `drawImage` per cell. The xray prints the atlas as it grows.",
        refs: [
          { source: COMPONENT, from: "const makeGlyphKey = ", to: "return {" },
          { source: COMPONENT, from: "const getGlyph = (", to: "return bitmap;" },
        ],
      },
      {
        lead: "A scattered rewrite.",
        body: "Every 100 ms, 12 % of the cells are rewritten, picked at `(tick × 11 + i × 37 + 17) mod n`, each with a new hex pair from its own `lcg` seed.",
        refs: [
          {
            source: COMPONENT,
            from: "const updateCells = useEffectEvent(",
            to: "const shouldGlitch",
          },
          { source: COMPONENT, from: "const hexPair = ", to: "};" },
        ],
      },
      {
        lead: "Glitch, then settle.",
        body: "When `(seed >>> 1) & 0x1f ≤ 2` (3 rewrites in 32) the cell shows one of 37 block tokens (`▚▞`, `◢◣`…) for 92 ms, jittering sideways, then lands on the hex pair it drew in advance.",
        refs: [
          { source: COMPONENT, from: "const shouldGlitch", to: "cell.glitchUntil = 0;" },
          {
            source: COMPONENT,
            from: "if (cell.glitchUntil > 0 && now >= cell.glitchUntil) {",
            to: "offsetX = Math.sin(",
          },
        ],
      },
      {
        lead: "Fixed accents, a travelling pulse.",
        body: "One cell in 16 is pink for good (`((0x2f6a91c3 + i × 13) >>> 2) & 0xf == 0`); every cell's alpha breathes on a 2.9 s sine shifted by `(i × 17 mod 240) / 70` s.",
        refs: [
          { source: COMPONENT, from: "accent: (((BASE_SEED", to: "pulseDelay: ((index * 17)" },
        ],
      },
    ],
    cost: [
      {
        lead: "Capped.",
        body: "At most 30 draws a second, `devicePixelRatio` held at 1.25; the atlas is emptied only when the pixel ratio or the font size changes, or once the fonts have loaded.",
        refs: [
          { source: COMPONENT, from: "const MAX_DPR", to: "const UPDATE_RATIO" },
          { source: COMPONENT, from: "if (dprChanged || fontChanged) {", to: "}" },
        ],
      },
      {
        lead: "Idle when still.",
        body: "Paused, or under `prefers-reduced-motion`: one frame, then no `requestAnimationFrame`. The xray and Step draw by hand.",
        refs: [{ source: COMPONENT, from: "if (!isAnimating || reducedMotion) {", to: "return;" }],
      },
    ],
    seeAlso: [
      { slug: "glitch-signal-map", text: "the same generator, drawn as blocks." },
      { slug: "computer-3d", text: "this grid is zone 3 of its screen." },
    ],
  },
};
