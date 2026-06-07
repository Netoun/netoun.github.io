import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const landing = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

// Lightweight index header — the "LABS" brand already lives in the sidebar /
// mobile app-bar, so the content leads with a contextual "Experiments" heading
// instead of duplicating it.
export const header = style({
  marginBottom: vars.spacing["2xl"],
  "@media": {
    // Mobile: the title is hidden, so keep the same uniform rhythm before the grid
    "screen and (max-width: 1023.98px)": {
      marginBottom: vars.spacing.lg,
    },
  },
});

export const title = style({
  display: "flex",
  alignItems: "center",

  margin: 0,
  marginBottom: vars.spacing.md,
  fontSize: vars.fontSize["2xl"],
  fontWeight: vars.fontWeight.extrabold,
  color: vars.colors.mutedForeground,
  fontFamily: vars.fontFamily.doto,
});

export const titlePrompt = style({
  fontFamily: vars.fontFamily.doto,
  fontWeight: vars.fontWeight.bold,
  color: vars.colors.primary,
  textShadow: `0 0 18px color-mix(in oklch, ${vars.colors.primary} 60%, transparent)`,
});

// Experiment count chip — Doto, sits inline after the title.
export const titleCount = style({
  alignSelf: "center",
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  letterSpacing: "0.08em",
  color: vars.colors.mutedForeground,
  padding: "0.1rem 0.55rem",
  borderRadius: vars.radius.full,
  border: `1px solid ${vars.colors.cardBorder}`,
  background: "oklch(1 0 0 / 0.4)",
});

export const intro = style({
  maxWidth: "44rem",
  margin: 0,
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.relaxed,
  color: vars.colors.mutedForeground,
});

export const grid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(17rem, 1fr))",
  gap: vars.spacing.lg,
});

// ── Card — "bracket frame" ───────────────────────────────────────────────────
// Monochrome at rest; the accent (corner brackets + icon + group label) lights
// up on hover. Neo-retro terminal frame that echoes the console sidebar.
export const card = style({
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
  padding: "1.65rem 1.5rem",
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.colors.cardBorder}`,
  background: "oklch(1 0 0 / 0.6)",
  color: vars.colors.foreground,
  textDecoration: "none",
  transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
  selectors: {
    "&:hover": { transform: "translateY(-4px)" },
    "&[data-accent='primary']:hover": {
      borderColor: `color-mix(in oklch, ${vars.colors.primary} 55%, ${vars.colors.cardBorder})`,
      boxShadow: `0 16px 34px -16px color-mix(in oklch, ${vars.colors.primary} 60%, transparent)`,
    },
    "&[data-accent='secondary']:hover": {
      borderColor: `color-mix(in oklch, ${vars.colors.secondary} 55%, ${vars.colors.cardBorder})`,
      boxShadow: `0 16px 34px -16px color-mix(in oklch, ${vars.colors.secondary} 60%, transparent)`,
    },
    "&[data-accent='tertiary']:hover": {
      borderColor: `color-mix(in oklch, ${vars.colors.tertiary} 55%, ${vars.colors.cardBorder})`,
      boxShadow: `0 16px 34px -16px color-mix(in oklch, ${vars.colors.tertiary} 60%, transparent)`,
    },
  },
});

// Decorative bracket corners — faint ink at rest, accent-colored on hover.
const cornerBase = {
  position: "absolute",
  width: "14px",
  height: "14px",
  color: vars.colors.mutedForeground,
  opacity: 0.35,
  borderColor: "currentColor",
  borderStyle: "solid",
  borderWidth: 0,
  pointerEvents: "none",
  transition: "color 0.2s ease, opacity 0.2s ease",
} as const;

const cornerHover = {
  [`${card}[data-accent='primary']:hover &`]: {
    color: vars.colors.primary,
    opacity: 1,
  },
  [`${card}[data-accent='secondary']:hover &`]: {
    color: vars.colors.secondary,
    opacity: 1,
  },
  [`${card}[data-accent='tertiary']:hover &`]: {
    color: vars.colors.tertiary,
    opacity: 1,
  },
};

export const cardCornerTL = style({
  ...cornerBase,
  top: "9px",
  left: "9px",
  borderTopWidth: "1.5px",
  borderLeftWidth: "1.5px",
  borderTopLeftRadius: "5px",
  selectors: cornerHover,
});

export const cardCornerBR = style({
  ...cornerBase,
  bottom: "9px",
  right: "9px",
  borderBottomWidth: "1.5px",
  borderRightWidth: "1.5px",
  borderBottomRightRadius: "5px",
  selectors: cornerHover,
});

// Header row: icon chip + group label
export const cardHead = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
});

// Icon chip — accent-tinted tile; `color` drives the SVG's `currentColor`.
export const cardIcon = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "42px",
  height: "42px",
  padding: "7px",
  flexShrink: 0,
  borderRadius: vars.radius.sm,
  transition: "filter 0.2s ease, transform 0.2s ease",
  selectors: {
    [`${card}[data-accent='primary'] &`]: {
      color: vars.colors.primary,
      background: `color-mix(in oklch, ${vars.colors.primary} 12%, transparent)`,
    },
    [`${card}[data-accent='secondary'] &`]: {
      color: vars.colors.secondary,
      background: `color-mix(in oklch, ${vars.colors.secondary} 12%, transparent)`,
    },
    [`${card}[data-accent='tertiary'] &`]: {
      color: vars.colors.tertiary,
      background: `color-mix(in oklch, ${vars.colors.tertiary} 14%, transparent)`,
    },
    [`${card}:hover &`]: {
      filter: "drop-shadow(0 0 6px currentColor)",
      transform: "translateY(-1px)",
    },
  },
});

// Group label — Doto terminal type; muted at rest, accent on hover.
export const cardGroup = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize["2xs"],
  fontWeight: vars.fontWeight.semibold,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: vars.colors.mutedForeground,
  transition: "color 0.2s ease",
  selectors: {
    [`${card}[data-accent='primary']:hover &`]: { color: vars.colors.primary },
    [`${card}[data-accent='secondary']:hover &`]: {
      color: vars.colors.secondary,
    },
    [`${card}[data-accent='tertiary']:hover &`]: {
      color: vars.colors.tertiary,
    },
  },
});

export const cardTitle = style({
  margin: 0,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  letterSpacing: "-0.01em",
});

export const cardDesc = style({
  margin: 0,
  flex: 1,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.relaxed,
  color: vars.colors.mutedForeground,
});

// Terminal-style CTA — arrow slides in on hover.
export const cardCta = style({
  display: "flex",
  alignItems: "center",
  gap: "0.45rem",
  marginTop: vars.spacing.xs,
  paddingTop: vars.spacing.sm,
  borderTop: `1px solid ${vars.colors.cardBorder}`,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize["2xs"],
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: vars.colors.mutedForeground,
});

export const cardCtaPrompt = style({
  selectors: {
    [`${card}[data-accent='primary'] &`]: { color: vars.colors.primary },
    [`${card}[data-accent='secondary'] &`]: { color: vars.colors.secondary },
    [`${card}[data-accent='tertiary'] &`]: { color: vars.colors.tertiary },
  },
});

export const cardCtaArrow = style({
  marginLeft: "auto",
  opacity: 0,
  transform: "translateX(-4px)",
  transition: "opacity 0.18s ease, transform 0.18s ease, color 0.18s ease",
  selectors: {
    [`${card}:hover &`]: {
      opacity: 1,
      transform: "translateX(0)",
    },
    [`${card}[data-accent='primary'] &`]: { color: vars.colors.primary },
    [`${card}[data-accent='secondary'] &`]: { color: vars.colors.secondary },
    [`${card}[data-accent='tertiary'] &`]: { color: vars.colors.tertiary },
  },
});
