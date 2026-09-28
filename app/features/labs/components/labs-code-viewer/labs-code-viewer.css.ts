import { style } from "@vanilla-extract/css";
import { motion } from "@styles/motion.css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

const MONO = '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace';

// The editor is an ink window: paper-coloured text at set strengths, gold for what is chosen.
const paper = (percent: number) =>
  `color-mix(in srgb, ${vars.colors.background} ${percent}%, transparent)`;
const hairline = `1px solid ${paper(10)}`;

const machine = {
  fontFamily: vars.fontFamily.doto,
  ...weight(900),
  letterSpacing: "0.1em",
  textTransform: "uppercase",
} as const;

export const codeViewer = style({
  // Ink surface: its tabs and copy button ring gold.
  vars: { [vars.colors.ring]: vars.colors.primary },
  display: "flex",
  flexDirection: "column",
  borderRadius: vars.radius.md,
  border: `1px solid ${paper(12)}`,
  background: `color-mix(in srgb, ${vars.colors.foreground} 98%, ${vars.colors.muted})`,
  boxShadow: `${vars.boxShadow.restCard}, 0 30px 60px -30px oklch(0 0 0 / 0.35)`,
  color: vars.colors.background,
  overflow: "hidden",
  minHeight: 0,
  scrollMarginBlock: vars.spacing.lg,
});

export const codeHeader = style({
  display: "flex",
  alignItems: "stretch",
  minHeight: "2.75rem",
  borderBottom: hairline,
  backgroundImage: `linear-gradient(180deg, ${paper(7)}, transparent)`,
});

// Three window lights, drawn by one element.
export const lights = style({
  flexShrink: 0,
  width: "4.5rem",
  backgroundImage: `
    radial-gradient(circle at 1.3rem 50%, color-mix(in srgb, ${vars.colors.destructive} 75%, ${vars.colors.primary}) 0.3rem, transparent 0.32rem),
    radial-gradient(circle at 2.25rem 50%, color-mix(in srgb, ${vars.colors.primary} 68%, ${vars.colors.secondary}) 0.3rem, transparent 0.32rem),
    radial-gradient(circle at 3.2rem 50%, color-mix(in srgb, ${vars.colors.secondary} 72%, ${vars.colors.primary}) 0.3rem, transparent 0.32rem)
  `,
});

export const tabRow = style({
  display: "flex",
  flex: 1,
  minWidth: 0,
  overflowX: "auto",
  scrollbarWidth: "thin",
});

export const tab = style({
  position: "relative",
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6rem",
  padding: `0 ${vars.spacing.md}`,
  border: "none",
  background: "transparent",
  color: paper(55),
  fontFamily: MONO,
  fontSize: vars.fontSize.xs,
  cursor: "pointer",
  whiteSpace: "nowrap",
  transition: `color ${motion.duration.fast} ${motion.easing.out}`,
  selectors: {
    "&:hover": { color: vars.colors.background },
    "&[data-active='true']": {
      color: vars.colors.background,
      backgroundColor: paper(5),
    },
    "&[data-active='true']::after": {
      content: "",
      position: "absolute",
      insetInline: vars.spacing.md,
      bottom: 0,
      height: "2px",
      borderRadius: "2px",
      backgroundColor: vars.colors.primary,
    },
  },
});

export const tabRole = style({
  ...machine,
  ...weight(800),
  fontSize: "0.6875rem",
  color: paper(50),
  selectors: {
    [`${tab}[data-active='true'] &`]: {
      color: `color-mix(in srgb, ${vars.colors.primary} 80%, transparent)`,
    },
  },
});

export const copyButton = style({
  ...machine,
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  padding: `0 ${vars.spacing.md}`,
  border: "none",
  borderLeft: hairline,
  background: "transparent",
  color: paper(82),
  fontSize: vars.fontSize.xs,
  cursor: "pointer",
  transition: `color ${motion.duration.fast} ${motion.easing.out}`,
  selectors: {
    "&:hover": { color: vars.colors.primary },
    "&[data-copied='true']": { color: vars.colors.secondary },
  },
});

export const codeScroll = style({
  overflow: "auto",
  height: "min(60vh, 36rem)",
  minHeight: "16rem",
  scrollbarWidth: "thin",
  scrollbarColor: `${paper(22)} transparent`,
  backgroundImage: `radial-gradient(90% 60% at 0% 0%, color-mix(in srgb, white 4%, transparent), transparent 60%)`,
});

export const pre = style({
  margin: 0,
  padding: `${vars.spacing.sm} 0`,
  minWidth: "max-content",
  fontFamily: MONO,
  fontSize: vars.fontSize.xs,
  lineHeight: vars.lineHeight.relaxed,
  background: "transparent !important",
  tabSize: 2,
});

export const plain = style({
  display: "block",
  paddingLeft: "3.25rem",
  whiteSpace: "pre",
  color: paper(82),
});

export const line = style({
  display: "flex",
  paddingRight: vars.spacing.lg,
  selectors: {
    "&[data-lit]": {
      backgroundColor: `color-mix(in srgb, ${vars.colors.primary} 11%, transparent)`,
      boxShadow: `inset 2px 0 0 ${vars.colors.primary}`,
    },
  },
});

export const lineNumber = style({
  flexShrink: 0,
  width: "3.25rem",
  paddingRight: "1.125rem",
  boxSizing: "border-box",
  userSelect: "none",
  textAlign: "right",
  color: paper(50),
  fontVariantNumeric: "tabular-nums",
  selectors: {
    [`${line}[data-lit] &`]: { color: vars.colors.primary },
  },
});

export const lineContent = style({
  whiteSpace: "pre",
});

export const statusBar = style({
  ...machine,
  ...weight(800),
  textTransform: "none",
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
  minHeight: "2.25rem",
  padding: `0 ${vars.spacing.md}`,
  borderTop: hairline,
  fontSize: "0.75rem",
  letterSpacing: "0.06em",
  color: paper(64),
  whiteSpace: "nowrap",
});

export const statusFile = style({
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const statusRange = style({
  flexShrink: 0,
  paddingLeft: vars.spacing.md,
  borderLeft: `1px solid ${paper(14)}`,
  color: vars.colors.primary,
});

export const sourceLink = style({
  ...machine,
  flexShrink: 0,
  marginLeft: "auto",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4em",
  minHeight: "2.25rem",
  color: paper(82),
  textDecoration: "none",
  transition: `color ${motion.duration.fast} ${motion.easing.out}`,
  selectors: {
    "&:hover": { color: vars.colors.primary },
  },
});
