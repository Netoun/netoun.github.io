import boardCss from "./split-flap-board.css.ts?raw";
import boardSource from "./split-flap-board.component.tsx?raw";
import drumSource from "./split-flap-drum.ts?raw";
import type { LabExperiment } from "../../data/labs.types";
import { SplitFlapDemo } from "./split-flap.demo";
import demoSource from "./split-flap.demo.tsx?raw";

const BOARD = "split-flap-board.component.tsx";
const BOARD_CSS = "split-flap-board.css.ts";
const DRUM_FILE = "split-flap-drum.ts";
const DEMO = "split-flap.demo.tsx";

export const splitFlapExperiment: LabExperiment = {
  slug: "split-flap",
  title: "Split-Flap Board",
  description:
    "A departure board in CSS 3D: every flap turns forward through its drum until it lands on its letter, four half-cards and two hinged leaves per character.",
  tags: ["CSS 3D", "rotateX", "backface-visibility", "keyframes", "stagger"],
  group: "3D CSS",
  accent: "primary",
  engine: "CSS 3D",
  xray: true,
  Demo: SplitFlapDemo,
  sources: [
    {
      label: BOARD,
      code: boardSource,
      lang: "tsx",
      path: "app/features/labs/experiments/split-flap/split-flap-board.component.tsx",
      role: "technique",
    },
    {
      label: BOARD_CSS,
      code: boardCss,
      lang: "ts",
      path: "app/features/labs/experiments/split-flap/split-flap-board.css.ts",
      role: "styles",
    },
    {
      label: DRUM_FILE,
      code: drumSource,
      lang: "ts",
      path: "app/features/labs/experiments/split-flap/split-flap-drum.ts",
      role: "technique",
    },
    {
      label: DEMO,
      code: demoSource,
      lang: "tsx",
      path: "app/features/labs/experiments/split-flap/split-flap.demo.tsx",
      role: "demo",
    },
  ],
  manual: {
    name: "a departure board where every character is four half-cards on one hinge.",
    how: [
      {
        lead: "A drum, not a font.",
        body: "Each flap owns a drum of 42 glyphs (blank, A–Z, 0–9, `. / - _ ❯`) that only turns forward: its step count is its distance to the target on that drum, wrapping past the end.",
        refs: [
          { source: DRUM_FILE, from: "export const DRUM" },
          { source: DRUM_FILE, from: "export function drumDistance", to: "}" },
        ],
      },
      {
        lead: "Four half-cards.",
        body: "Two static halves show the new glyph on top and the old one below; two leaves hinged on the middle line carry the halves in motion, each with `backface-visibility: hidden`, so a leaf seen edge-on disappears.",
        refs: [
          {
            source: BOARD,
            from: '<Half glyph={next} half="top" className={styles.staticTop} />',
            to: "<span className={styles.hinge} />",
          },
        ],
      },
      {
        lead: "Half a flip each.",
        body: "The top leaf falls from 0 to −90° in the first half of the flip time, the bottom leaf lands from 90° to 0 in the second. Every step swaps the flap between two identical pairs of keyframes, and a new animation name restarts the animation.",
        refs: [
          {
            source: BOARD_CSS,
            from: "const leafFallA = keyframes",
            to: "const shadeB = keyframes",
          },
          { source: BOARD, from: "const parity = ", to: "const parity = " },
        ],
      },
      {
        lead: "A ripple, not a wall.",
        body: "Columns start one stagger apart and the second line two columns later, so a new message ripples across the board.",
        refs: [{ source: DRUM_FILE, from: "export function startDelay", to: "}" }],
      },
    ],
    cost: [
      {
        lead: "Transforms only.",
        body: "Only the two leaves and a shade animate, on `transform` and `opacity`; a flap re-renders only when its own glyph changes (`memo`).",
        refs: [{ source: BOARD, from: "const Flap = memo(" }],
      },
      {
        lead: "Stops when it lands.",
        body: "One timer for the whole board, and none once every flap shows its target; under `prefers-reduced-motion` the letters are set at once.",
        refs: [{ source: DEMO, from: "// One timer for the whole board", to: "}, [running" }],
      },
    ],
    seeAlso: [{ slug: "computer-3d", text: "the same CSS 3D, twelve faces instead of four." }],
  },
};
