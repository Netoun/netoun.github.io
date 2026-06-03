import serverUnitCss from "@/components/misc/server-unit/server-unit.css.ts?raw";
import serverUnitSource from "@/components/misc/server-unit/server-unit.component.tsx?raw";
import type { LabExperiment } from "../../data/labs.types";
import { ServerUnit3dDemo } from "./server-unit-3d.demo";
import demoSource from "./server-unit-3d.demo.tsx?raw";

export const serverUnit3dExperiment: LabExperiment = {
  slug: "server-unit-3d",
  title: "3D Server Rack",
  description:
    "A stacked server rack in CSS 3D with deterministic, seed-driven status LEDs — resize it, reseed it, spin it around.",
  tags: ["CSS 3D", "transforms", "LED seed", "deterministic"],
  group: "3D CSS",
  accent: "secondary",
  icon: "🗄",
  Demo: ServerUnit3dDemo,
  sources: [
    { label: "server-unit-3d.demo.tsx", code: demoSource, lang: "tsx" },
    { label: "server-unit.component.tsx", code: serverUnitSource, lang: "tsx" },
    { label: "server-unit.css.ts", code: serverUnitCss, lang: "ts" },
  ],
};
