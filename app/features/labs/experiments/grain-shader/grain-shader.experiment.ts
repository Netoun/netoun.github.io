import grainCanvasSource from "@/components/misc/grain-canvas/grain-canvas.component.tsx?raw";
import grainShaderSource from "@/components/misc/shaders/grain/grain.shader.ts?raw";
import type { LabExperiment } from "../../data/labs.types";
import { GrainShaderDemo } from "./grain-shader.demo";
import demoSource from "./grain-shader.demo.tsx?raw";

export const grainShaderExperiment: LabExperiment = {
  slug: "grain-shader",
  title: "Film Grain Shader",
  description:
    "Procedural multi-octave value-noise film grain in WebGL, supersampled to stay fine on high-DPI screens.",
  tags: ["WebGL", "GLSL", "film grain", "noise"],
  group: "Shaders",
  accent: "primary",
  engine: "WebGL",
  Demo: GrainShaderDemo,
  sources: [
    {
      label: "grain.shader.ts",
      code: grainShaderSource,
      lang: "ts",
      path: "app/components/misc/shaders/grain/grain.shader.ts",
      role: "technique",
    },
    {
      label: "grain-canvas.component.tsx",
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
};
