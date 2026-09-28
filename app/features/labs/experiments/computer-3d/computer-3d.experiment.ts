import computerCss from "@/components/misc/computer/computer.css.ts?raw";
import computerSource from "@/components/misc/computer/computer.component.tsx?raw";
import type { LabExperiment } from "../../data/labs.types";
import { Computer3dDemo } from "./computer-3d.demo";
import demoSource from "./computer-3d.demo.tsx?raw";

export const computer3dExperiment: LabExperiment = {
  slug: "computer-3d",
  title: "3D Computer",
  description:
    "A retro computer workstation built entirely with CSS 3D transforms — no WebGL, just perspective and transform-style: preserve-3d.",
  tags: ["CSS 3D", "3D computer", "transforms", "no-WebGL", "retro"],
  group: "3D CSS",
  accent: "secondary",
  engine: "CSS 3D",
  Demo: Computer3dDemo,
  sources: [
    {
      label: "computer.component.tsx",
      code: computerSource,
      lang: "tsx",
      path: "app/components/misc/computer/computer.component.tsx",
      role: "technique",
    },
    {
      label: "computer.css.ts",
      code: computerCss,
      lang: "ts",
      path: "app/components/misc/computer/computer.css.ts",
      role: "styles",
    },
    {
      label: "computer-3d.demo.tsx",
      code: demoSource,
      lang: "tsx",
      path: "app/features/labs/experiments/computer-3d/computer-3d.demo.tsx",
      role: "demo",
    },
  ],
};
