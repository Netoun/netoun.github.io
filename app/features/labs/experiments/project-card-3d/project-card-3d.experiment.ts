import projectCardCss from "@/features/projects/components/project-card/project-card.css.ts?raw";
import projectCardSource from "@/features/projects/components/project-card/project-card.component.tsx?raw";
import type { LabExperiment } from "../../data/labs.types";
import { ProjectCard3dDemo } from "./project-card-3d.demo";
import demoSource from "./project-card-3d.demo.tsx?raw";

export const projectCard3dExperiment: LabExperiment = {
  slug: "project-card-3d",
  title: "Holographic Project Card",
  description:
    "A project card with mouse-driven CSS 3D tilt, holographic sheen, and image+tag parallax layers — no WebGL.",
  tags: ["CSS 3D", "tilt", "parallax", "holographic"],
  group: "3D CSS",
  accent: "tertiary",
  icon: "🪪",
  Demo: ProjectCard3dDemo,
  sources: [
    { label: "project-card-3d.demo.tsx", code: demoSource, lang: "tsx" },
    { label: "project-card.component.tsx", code: projectCardSource, lang: "tsx" },
    { label: "project-card.css.ts", code: projectCardCss, lang: "ts" },
  ],
};
