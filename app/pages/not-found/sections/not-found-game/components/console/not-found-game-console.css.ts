import { motion } from "@styles/motion.css";
import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";
import { createVar, style, styleVariants } from "@vanilla-extract/css";

/** One typing step per character of the line, and how long the line takes to type. */
export const lineSteps = createVar();
export const lineDuration = createVar();

const machine = {
  fontFamily: vars.fontFamily.doto,
  ...weight(vars.fontWeight.extrabold),
  fontVariantNumeric: "tabular-nums",
} as const;

// A black ssh window on the paper, like the Skills terminal: an object, not a third dark panel.
export const windowStyle = style({
  display: "flex",
  flexDirection: "column",
  minHeight: "15.75rem",
  borderRadius: vars.radius.md,
  overflow: "hidden",
  background: "linear-gradient(180deg, #111114, #070708)",
  border: `1px solid color-mix(in srgb, ${vars.colors.background} 12%, transparent)`,
  boxShadow: `${vars.boxShadow.restCard}, 0 30px 60px -30px rgba(0, 0, 0, 0.45)`,
});

export const barStyle = style({
  ...machine,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  gap: "0.875rem",
  height: "2.25rem",
  paddingInline: "0.875rem",
  background: "linear-gradient(180deg, #1b1b1f, #121215)",
  borderBottom: `1px solid color-mix(in srgb, ${vars.colors.background} 8%, transparent)`,
  fontSize: "0.6875rem",
  letterSpacing: "0.12em",
  color: vars.colors.mutedForegroundOnDark,
});

// Scanlines and the hero mesh's lights, held still on the glass.
export const screenStyle = style({
  ...machine,
  position: "relative",
  flexGrow: 1,
  padding: "0.75rem 1rem",
  fontSize: "0.75rem",
  lineHeight: "1.1875rem",
  letterSpacing: "0.02em",
  color: vars.colors.background,
  transition: `opacity ${motion.duration.base} ease`,
  selectors: {
    "&[data-stale]": { opacity: 0.45 },
  },
  "::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background: `repeating-linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0 1px, transparent 1px 3px), radial-gradient(120% 90% at 18% 0%, color-mix(in srgb, ${vars.colors.secondary} 7%, transparent), transparent 60%), radial-gradient(90% 70% at 100% 100%, color-mix(in srgb, ${vars.colors.tertiary} 8%, transparent), transparent 70%)`,
  },
  "@media": {
    [breakpoints.md]: { fontSize: "0.8125rem", lineHeight: "1.25rem" },
  },
});

export const lineStyle = style({
  whiteSpace: "pre-wrap",
  animation: `rack-type calc(${lineDuration} * 1ms) steps(${lineSteps}) both`,
  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
});

// An earlier run, dimmed a little under the one printing now.
export const historyStyle = style({
  whiteSpace: "pre-wrap",
  opacity: 0.8,
});

export const tone = styleVariants({
  paper: { color: vars.colors.background },
  muted: { color: vars.colors.mutedForegroundOnDark },
  gold: { color: vars.colors.primary },
  mint: { color: vars.colors.secondary },
  fault: { color: `color-mix(in oklab, ${vars.colors.destructive} 72%, white)` },
});

export const cursorStyle = style({
  color: vars.colors.primary,
  animation: "blink 1s step-end infinite",
  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
});
