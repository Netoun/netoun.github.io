import meshCanvasSource from "@/components/misc/mesh-background/mesh-background-canvas.component.tsx?raw";
import meshShaderSource from "@/components/misc/shaders/mesh-background/mesh-background.shader.ts?raw";
import type { LabExperiment } from "../../data/labs.types";
import { MeshBackgroundDemo } from "./mesh-background.demo";
import demoSource from "./mesh-background.demo.tsx?raw";

const SHADER = "mesh-background.shader.ts";
const CANVAS = "mesh-background-canvas.component.tsx";

export const meshBackgroundExperiment: LabExperiment = {
  slug: "mesh-background",
  title: "Mesh Gradient",
  description:
    "An animated mesh-gradient background: three drifting colour blobs, a vignette and optional film grain, all in one fragment shader.",
  tags: ["WebGPU", "WebGL", "GLSL", "gradient", "blobs", "vignette"],
  group: "Shaders",
  accent: "tertiary",
  engine: "WebGPU / WebGL",
  xray: true,
  Demo: MeshBackgroundDemo,
  sources: [
    {
      label: SHADER,
      code: meshShaderSource,
      lang: "ts",
      path: "app/components/misc/shaders/mesh-background/mesh-background.shader.ts",
      role: "technique",
    },
    {
      label: CANVAS,
      code: meshCanvasSource,
      lang: "tsx",
      path: "app/components/misc/mesh-background/mesh-background-canvas.component.tsx",
      role: "technique",
    },
    {
      label: "mesh-background.demo.tsx",
      code: demoSource,
      lang: "tsx",
      path: "app/features/labs/experiments/mesh-background/mesh-background.demo.tsx",
      role: "demo",
    },
  ],
  manual: {
    name: "the footer's and the hero's gradient: three blobs, a vignette and a grain, in one pass.",
    how: [
      {
        lead: "Three soft blobs.",
        body: "Each blob is `x²` with `x = max(0, 1 − |(uv − c) / scale|² · softness · 0.12)`: no `exp`, no texture. Summed with their colours and intensities, they make the gradient; the xray draws where each one fades to half and to nothing.",
        refs: [
          { source: SHADER, from: "float blobFast(vec2 uv", to: "return x * x;" },
          { source: SHADER, from: "vec3 color =", to: "SHADER_CONFIG.blob3.intensity" },
        ],
      },
      {
        lead: "Centres move in the vertex shader.",
        body: "Each centre drifts on a sine and a cosine of `time × 0.06`, by 1 to 1.4 % of the frame: computed per vertex (six of them), not per pixel, and handed down as varyings.",
        refs: [
          { source: SHADER, from: "v_c1 = vec2(", to: "gl_Position = vec4(a_position, 0.0, 1.0);" },
        ],
      },
      {
        lead: "Vignette, dither, grain.",
        body: "A `smoothstep` between radius 0.38 and 0.92 dims the edges; a ±0.006 hash dither breaks 8-bit banding even with the grain off; the film grain mixes a fine and a coarse hash reseeded 18 times a second, scaled by `quality`.",
        refs: [
          {
            source: SHADER,
            from: "float vignette = 1.0 - smoothstep(",
            to: "color += ${glslVec3(SHADER_CONFIG.baseColor)};",
          },
          { source: SHADER, from: "if (u_quality > 0.001) {", to: "color += grain * flicker" },
        ],
      },
      {
        lead: "One config, two languages.",
        body: "`SHADER_CONFIG` is printed into both a GLSL and a WGSL source. The renderer tries WebGPU first and falls back to WebGL if it is missing or takes more than 250 ms to start; the readout names the one that won.",
        refs: [
          { source: SHADER, from: "export const buildMeshWebGPUShader", to: "struct Uniforms {" },
          { source: CANVAS, from: "webgpuTimeout: SHADER_CONFIG.webgpuInitTimeoutMs," },
        ],
      },
    ],
    cost: [
      {
        lead: "Only its window.",
        body: "A canvas that shows part of the composition (the hero's, the footer's) renders only that part: `compositionWindow` rescales `uv` in the shader instead of oversizing the canvas and clipping it.",
        refs: [
          {
            source: SHADER,
            from: "export interface MeshCompositionWindow",
            to: "const FULL_COMPOSITION",
          },
          { source: CANVAS, from: "const shader = useMemo(", to: "[compositionWindow]," },
        ],
      },
      {
        lead: "Armed late, capped.",
        body: "With `armMargin` the GPU session starts only when the canvas nears the viewport; the buffer stays at the device's pixel ratio, 3 at most.",
        refs: [
          {
            source: CANVAS,
            from: "const [armed, setArmed] = useState(",
            to: "}, [armed, armMargin]);",
          },
          { source: SHADER, from: "minRenderScale: 1,", to: "maxRenderScale: 3," },
        ],
      },
    ],
    seeAlso: [{ slug: "grain-shader", text: "the paper's still grain, baked into a tile." }],
  },
};
