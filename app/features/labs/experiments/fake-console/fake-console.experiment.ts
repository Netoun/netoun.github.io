import componentCss from "@/components/misc/fake-console/fake-console.css.ts?raw";
import componentSource from "@/components/misc/fake-console/fake-console.component.tsx?raw";
import type { LabExperiment } from "../../data/labs.types";
import { FakeConsoleDemo } from "./fake-console.demo";
import demoSource from "./fake-console.demo.tsx?raw";

export const fakeConsoleExperiment: LabExperiment = {
  slug: "fake-console",
  title: "Fake Console",
  description:
    "A faux boot console that types out streaming log lines with a blinking caret and an auto-scrolling viewport.",
  tags: ["typewriter", "console", "animation"],
  group: "HUD",
  accent: "secondary",
  icon: "⌨️",
  Demo: FakeConsoleDemo,
  sources: [
    { label: "fake-console.demo.tsx", code: demoSource, lang: "tsx" },
    { label: "fake-console.component.tsx", code: componentSource, lang: "tsx" },
    { label: "fake-console.css.ts", code: componentCss, lang: "ts" },
  ],
};
