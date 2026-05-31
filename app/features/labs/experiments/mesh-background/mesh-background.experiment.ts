import meshCanvasSource from "@/components/misc/mesh-background/mesh-background-canvas.component.tsx?raw";
import meshShaderSource from "@/components/misc/shaders/mesh-background/mesh-background.shader.ts?raw";
import type { LabExperiment } from "../../data/labs.types";
import { MeshBackgroundDemo } from "./mesh-background.demo";
import demoSource from "./mesh-background.demo.tsx?raw";

export const meshBackgroundExperiment: LabExperiment = {
  slug: "mesh-background",
  title: "Mesh Gradient",
  description:
    "An animated mesh-gradient background: three drifting colour blobs, a vignette and optional film grain, all in one fragment shader.",
  tags: ["WebGL", "GLSL", "gradient", "blobs", "vignette"],
  group: "Shaders",
  accent: "tertiary",
  icon: "🌈",
  Demo: MeshBackgroundDemo,
  sources: [
    { label: "mesh-background.demo.tsx", code: demoSource, lang: "tsx" },
    { label: "mesh-background-canvas.component.tsx", code: meshCanvasSource, lang: "tsx" },
    { label: "mesh-background.shader.ts", code: meshShaderSource, lang: "ts" },
  ],
};
