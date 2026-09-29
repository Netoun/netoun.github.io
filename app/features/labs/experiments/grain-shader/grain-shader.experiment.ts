import grainCanvasSource from "@/components/misc/grain-canvas/grain-canvas.component.tsx?raw";
import grainShaderSource from "@/components/misc/shaders/grain/grain.shader.ts?raw";
import type { LabExperiment } from "../../data/labs.types";
import { GrainShaderDemo } from "./grain-shader.demo";
import demoSource from "./grain-shader.demo.tsx?raw";

const SHADER = "grain.shader.ts";
const CANVAS = "grain-canvas.component.tsx";

export const grainShaderExperiment: LabExperiment = {
  slug: "grain-shader",
  title: "Film Grain Shader",
  description:
    "The paper's film grain — one signed hash per physical pixel — drawn live in WebGL beside the 128 px tile the site bakes from the same function.",
  tags: ["WebGL", "GLSL", "film grain", "hash", "baked tile"],
  group: "Shaders",
  accent: "primary",
  engine: "WebGL",
  xray: true,
  Demo: GrainShaderDemo,
  sources: [
    {
      label: SHADER,
      code: grainShaderSource,
      lang: "ts",
      path: "app/components/misc/shaders/grain/grain.shader.ts",
      role: "technique",
    },
    {
      label: CANVAS,
      code: grainCanvasSource,
      lang: "tsx",
      path: "app/components/misc/grain-canvas/grain-canvas.component.tsx",
      role: "technique",
    },
    {
      label: "grain-shader.demo.tsx",
      code: demoSource,
      lang: "tsx",
      path: "app/features/labs/experiments/grain-shader/grain-shader.demo.tsx",
      role: "demo",
    },
  ],
  manual: {
    name: "the site's paper grain, drawn live and compared with the tile it ships as.",
    how: [
      {
        lead: "One cell per physical pixel.",
        body: "Each pixel hashes its own integer coordinates (`hash12`, no texture, no time) into `n` in [−0.5, 0.5): above zero it lightens the paper, below it darkens it. Any resampling would average neighbours into grey, so the canvas renders at the native pixel ratio, never above.",
        refs: [
          { source: SHADER, from: "export const FILM_GRAIN_FRAGMENT_SHADER", to: "gl_FragColor" },
          { source: SHADER, from: "// Le buffer doit correspondre", to: "maxRenderScale:" },
        ],
      },
      {
        lead: "Mostly silent.",
        body: "The weight is `|2n|^1.5`, rounded to five levels, times 0.05: with a gamma above 1, 44 % of a tile's cells sit at 0 or 0.2 and only 7 % strike at full weight — film grain rather than an even grey sand. The xray counts the levels.",
        refs: [
          { source: SHADER, from: "export function grainCell", to: "return { lighten: n > 0" },
        ],
      },
      {
        lead: "Baked, not run.",
        body: "The page does not run this shader: `generate-grain-tile` computes the same cells in TypeScript (`grainHash12`, operation for operation) into a 128 px WebP tile, @1x and @2x, that the body repeats once the page has loaded. Live and baked panes above match pixel for pixel at the defaults.",
        refs: [
          { source: SHADER, from: "export function grainHash12", to: "return fract((a + b) * c);" },
          { source: SHADER, from: "export const GRAIN_TILE", to: "} as const;" },
        ],
      },
      {
        lead: "The loupe.",
        body: "Both panes are drawn at one cell per device pixel, then scaled by the same `transform: scale(N)` with `image-rendering: pixelated`: each grain dot grows into a block you can count, and live and baked stay comparable at every zoom.",
        refs: [
          {
            source: "grain-shader.demo.tsx",
            from: "<div className={styles.magnify}>",
            to: "</div>",
          },
        ],
      },
    ],
    cost: [
      {
        lead: "On the page, a picture.",
        body: "The tile weighs a few kilobytes and runs no shader and no loop; it is switched on after `load`, so it never competes with the first paint.",
        refs: [
          {
            source: SHADER,
            from: "// The page's signed film grain",
            to: "`bun run generate-grain-tile`.",
          },
        ],
      },
      {
        lead: "Here, one draw per change.",
        body: "The Lab's canvas does not animate: it draws once, then again only when a uniform changes or it is resized.",
        refs: [{ source: CANVAS, from: "useShaderCanvas(canvasRef, grainShader, {", to: "});" }],
      },
    ],
    seeAlso: [{ slug: "mesh-background", text: "a grain that moves, over a gradient." }],
  },
};
