import { motion } from "@styles/motion.css";
import { style } from "@vanilla-extract/css";

/**
 * Fills its positioned parent, over the screen's content: it only adds light (screen blend), so
 * the parent should isolate itself (`isolation: isolate`) to keep the blend on the glass.
 */
export const crtCanvas = style({
  position: "absolute",
  inset: 0,
  display: "block",
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  mixBlendMode: "screen",
  opacity: 0,
  transition: `opacity ${motion.duration.slow} ${motion.easing.out}`,
  selectors: {
    '&[data-ready="true"]': {
      opacity: 1,
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});
