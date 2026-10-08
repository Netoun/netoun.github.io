import { createVar, fallbackVar, globalKeyframes, globalStyle } from "@vanilla-extract/css";
import { motion } from "./motion.css";

/** Stagger slot of a `data-reveal-item`, set by useReveal. */
export const revealIndex = createVar();

// Global keyframes for the CSS animations
globalKeyframes("blink", {
  "0%": { opacity: 1 },
  "50%": { opacity: 1 },
  "51%": { opacity: 0 },
  "100%": { opacity: 0 },
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
  transitionDelay: `calc(${fallbackVar(revealIndex, "0")} * ${motion.staggerStep})`,
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

// Projects monitor (project-monitor.css.ts): one arrival pass, played when the section
// reveals — the command types, the meters light segment by segment, the rows print.
globalKeyframes("monitor-type", {
  from: { clipPath: "inset(0 100% 0 0)" },
  to: { clipPath: "inset(0 0 0 0)" },
});

globalKeyframes("monitor-lit", {
  from: { opacity: 0.12 },
  to: { opacity: 1 },
});

globalKeyframes("monitor-row", {
  from: { opacity: 0, transform: "translateY(-4px)" },
  to: { opacity: 1, transform: "none" },
});

// Projects monitor: a domain cube turns once on arrival (pose from project-monitor-box.css.ts).
globalKeyframes("monitor-cube-spin", {
  from: { transform: "rotateX(-24deg) rotateY(-35deg)" },
  to: { transform: "rotateX(-24deg) rotateY(325deg)" },
});

// Projects monitor: a chrome glint crosses a capture when it changes.
globalKeyframes("monitor-chrome-sweep", {
  "0%": { backgroundPosition: "150% 0%", opacity: 0 },
  "35%": { opacity: 0.9 },
  "100%": { backgroundPosition: "-50% 100%", opacity: 0 },
});

// Sections nav (welcome-sections-nav.css.ts): the current section's name types in when it
// changes, and the list's names type in when the capsule opens.
globalKeyframes("nav-type", {
  from: { clipPath: "inset(0 100% 0 0)" },
  to: { clipPath: "inset(0 0 0 0)" },
});

// Labs index (labs-index-tree.css.ts): the tree command types, then its lines print, at load.
globalKeyframes("labs-type", {
  from: { clipPath: "inset(0 100% 0 0)" },
  to: { clipPath: "inset(0 0 0 0)" },
});

globalKeyframes("labs-row", {
  from: { opacity: 0, transform: "translateY(-4px)" },
  to: { opacity: 1, transform: "none" },
});

// Work log (experience-log.css.ts): one arrival pass when the section reveals — the command
// types, the rows print one after the other, each employer's track draws out of its lane.
globalKeyframes("log-row", {
  from: { opacity: 0, transform: "translateY(-6px)" },
  to: { opacity: 1, transform: "none" },
});

globalKeyframes("log-draw", {
  from: { clipPath: "inset(0 100% 0 0)" },
  to: { clipPath: "inset(0 0 0 0)" },
});

// Work log: HEAD's `*` pulses, the one live mark of the section.
globalKeyframes("log-ping", {
  "0%": { transform: "scale(1)", opacity: 0.8 },
  "75%, 100%": { transform: "scale(2.4)", opacity: 0 },
});

// Fetch readout (skill-fetch.css.ts): one arrival pass when the Skills section reveals — the
// command types, the logo and the readout print line by line, the checks print, the stack's
// LED segments light one by one.
globalKeyframes("fetch-type", {
  from: { clipPath: "inset(0 100% 0 0)" },
  to: { clipPath: "inset(0 0 0 0)" },
});

globalKeyframes("fetch-print", {
  from: { opacity: 0 },
  to: { opacity: 1 },
});

globalKeyframes("fetch-check", {
  from: { opacity: 0, transform: "translateY(-4px)" },
  to: { opacity: 1, transform: "none" },
});

globalKeyframes("fetch-lit", {
  from: { opacity: 0.12 },
  to: { opacity: 1 },
});

// 404 game (pages/not-found): the console types each line of the run, a cartridge drops into
// its bay, the LED of the step being computed flickers, the idle power ring breathes.
globalKeyframes("rack-type", {
  from: { clipPath: "inset(0 100% 0 0)" },
  to: { clipPath: "inset(0 0 0 0)" },
});

globalKeyframes("rack-drop", {
  from: { opacity: 0.3, transform: "translateY(-12px)" },
  to: { opacity: 1, transform: "none" },
});

globalKeyframes("rack-activity", {
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0.25 },
});

globalKeyframes("rack-idle", {
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0.55 },
});

// Fetch readout: the logo's holo gradient drifts, as the favicon's does (logo.svg).
globalKeyframes("fetch-holo", {
  from: { backgroundPosition: "0% 50%" },
  to: { backgroundPosition: "100% 50%" },
});
