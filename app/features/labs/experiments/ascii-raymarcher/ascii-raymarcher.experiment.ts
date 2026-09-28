import componentCss from "./ascii-raymarcher.css.ts?raw";
import componentSource from "./ascii-raymarcher.component.tsx?raw";
import sceneSource from "./ascii-raymarcher-scene.ts?raw";
import type { LabExperiment } from "../../data/labs.types";
import { AsciiRaymarcherDemo } from "./ascii-raymarcher.demo";
import demoSource from "./ascii-raymarcher.demo.tsx?raw";

const SCENE = "ascii-raymarcher-scene.ts";
const COMPONENT = "ascii-raymarcher.component.tsx";

export const asciiRaymarcherExperiment: LabExperiment = {
  slug: "ascii-raymarcher",
  title: "ASCII Raymarcher",
  description:
    "A signed-distance scene raymarched once per character cell and printed as real text: each cell's brightness picks a Doto glyph from a ramp.",
  tags: ["raymarching", "SDF", "ASCII", "Doto", "text"],
  group: "Shaders",
  accent: "secondary",
  engine: "JS · DOM text",
  xray: true,
  Demo: AsciiRaymarcherDemo,
  sources: [
    {
      label: SCENE,
      code: sceneSource,
      lang: "ts",
      path: "app/features/labs/experiments/ascii-raymarcher/ascii-raymarcher-scene.ts",
      role: "technique",
    },
    {
      label: COMPONENT,
      code: componentSource,
      lang: "tsx",
      path: "app/features/labs/experiments/ascii-raymarcher/ascii-raymarcher.component.tsx",
      role: "technique",
    },
    {
      label: "ascii-raymarcher.css.ts",
      code: componentCss,
      lang: "ts",
      path: "app/features/labs/experiments/ascii-raymarcher/ascii-raymarcher.css.ts",
      role: "styles",
    },
    {
      label: "ascii-raymarcher.demo.tsx",
      code: demoSource,
      lang: "tsx",
      path: "app/features/labs/experiments/ascii-raymarcher/ascii-raymarcher.demo.tsx",
      role: "demo",
    },
  ],
  manual: {
    name: "a fragment shader's loop, run once per character and printed as text.",
    how: [
      {
        lead: "One ray per cell.",
        body: "A cell is 0.6 wide for 1 tall (Doto's advance), so the rays are spaced 0.6 apart across and 1 down: the grid is the resolution, 92 × 29 rays at 14 px.",
        refs: [
          { source: SCENE, from: "export const CELL_ASPECT" },
          { source: SCENE, from: "const u = ((col + 0.5", to: "const [dx, dy, dz]" },
        ],
      },
      {
        lead: "Marching a distance field.",
        body: "Each ray steps by the scene's signed distance (a rounded box or a torus, turned by the clock) until it lands within `0.0015` of the surface, 48 steps at most, and only inside the scene's bounding sphere.",
        refs: [
          { source: SCENE, from: "function sdBox", to: "return outside" },
          { source: SCENE, from: "for (let step = 0; step < MAX_STEPS", to: "t += distance;" },
        ],
      },
      {
        lead: "Light, then a bucket.",
        body: "The normal comes from six more samples of the field; a key light, a faint headlight, a highlight and a rim give a luminance between 0 and 1, and the ramp cuts it into buckets.",
        refs: [{ source: SCENE, from: "if (distance < HIT) {", to: "lum = Math.min(" }],
      },
      {
        lead: "The fastfetch logo, live.",
        body: "The `netoun` ramp cuts at 0.1, 0.3 and 0.62, the thresholds `generate-logo-ascii.ts` bakes the Skills logo with at build: above 0.62 a cell prints the next letter of netoun.",
        refs: [{ source: SCENE, from: "netoun: [", to: "]," }],
      },
    ],
    cost: [
      {
        lead: "About a millisecond.",
        body: "2 668 rays a frame at 14 px, capped at 20 frames a second; the loop runs only while the screen is visible and the piece plays.",
        refs: [{ source: COMPONENT, from: "const FRAME_MS", to: "const FRAME_MS" }],
      },
      {
        lead: "Text, not pixels.",
        body: "Each frame writes one string per row straight into its `<span>`; React renders the rows once per grid size, and the page prerenders a frame without JS.",
        refs: [{ source: COMPONENT, from: "rowRefs.current.forEach((row, index) => {", to: "});" }],
      },
    ],
    seeAlso: [
      { slug: "grain-shader", text: "the same idea on the GPU: a function evaluated per pixel." },
    ],
  },
};
