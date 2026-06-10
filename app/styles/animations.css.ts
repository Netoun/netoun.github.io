import { globalKeyframes, globalStyle } from "@vanilla-extract/css";
import { motion } from "./motion.css";

// Animations globales pour les keyframes CSS
globalKeyframes("blink", {
  "0%": { opacity: 1 },
  "50%": { opacity: 1 },
  "51%": { opacity: 0 },
  "100%": { opacity: 0 },
});

globalKeyframes("float", {
  "0%": {
    transform: "translateY(100vh) rotate(0deg)",
    opacity: 0,
  },
  "10%": { opacity: 0.3 },
  "90%": { opacity: 0.3 },
  "100%": {
    transform: "translateY(-100vh) rotate(360deg)",
    opacity: 0,
  },
});

globalKeyframes("bounce", {
  "0%, 20%, 50%, 80%, 100%": {
    transform: "translateY(0)",
  },
  "40%": {
    transform: "translateY(-10px)",
  },
  "60%": {
    transform: "translateY(-5px)",
  },
});

globalKeyframes("glow", {
  "0%": {
    boxShadow: "0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor",
  },
  "50%": {
    boxShadow: "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor",
  },
  "100%": {
    boxShadow: "0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor",
  },
});

globalKeyframes("glowPulse", {
  "0%": {
    boxShadow: "0 0 0 0 currentColor",
  },
  "70%": {
    boxShadow: "0 0 0 10px transparent",
  },
  "100%": {
    boxShadow: "0 0 0 0 transparent",
  },
});

// Status dot pulse for the labs console sidebar
globalKeyframes("pulse", {
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0.35 },
});

// Scroll reveals (use-reveal.hook) — the hidden state only ever exists under a
// JS-set data-reveal attribute, so prerendered HTML stays visible without JS.
globalStyle("[data-reveal] [data-reveal-item]", {
  transitionProperty: "opacity, transform",
  transitionDuration: motion.duration.slow,
  transitionTimingFunction: motion.easing.signature,
  transitionDelay: `calc(var(--reveal-index, 0) * ${motion.staggerStep})`,
});

globalStyle('[data-reveal="idle"] [data-reveal-item]', {
  opacity: 0,
  transform: "translateY(16px)",
});

globalStyle("[data-reveal] [data-reveal-item]", {
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});
