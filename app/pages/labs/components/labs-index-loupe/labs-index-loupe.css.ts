import { globalStyle, style } from "@vanilla-extract/css";
import { chromeScreen } from "@/components/misc/chrome-capture/chrome-capture.css";
import { motion } from "@styles/motion.css";
import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";

// The loupe is a window of the process monitor's family: lit paper stock, the strong border,
// the rest shadow, a lamp from the top-left, a command bar over a hairline. Not a target.
const rule = `1px solid color-mix(in srgb, ${vars.colors.cardBorder} 55%, transparent)`;

const machine = {
  fontFamily: vars.fontFamily.doto,
  ...weight(800),
  fontVariantNumeric: "tabular-nums",
} as const;

export const loupeStyle = style({
  position: "relative",
  overflow: "hidden",
  borderRadius: vars.radius.md,
  border: vars.border.strong,
  backgroundColor: vars.colors.card,
  backgroundImage: `
    radial-gradient(120% 70% at 0% 0%, color-mix(in srgb, white 55%, transparent), transparent 60%),
    linear-gradient(180deg, transparent 40%, color-mix(in srgb, ${vars.colors.cardBorder} 22%, transparent))
  `,
  boxShadow: vars.boxShadow.restCard,
  color: vars.colors.foreground,
});

export const barStyle = style({
  ...machine,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.md,
  minHeight: "3rem",
  padding: `0 ${vars.spacing.lg}`,
  borderBottom: rule,
  backgroundImage: `linear-gradient(180deg, color-mix(in srgb, white 45%, transparent), transparent)`,
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.06em",
});

export const commandStyle = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5em",
  minWidth: 0,
  whiteSpace: "nowrap",
});

export const commandTextStyle = style({
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const cursorStyle = style({
  marginLeft: "-0.25em",
  animation: "blink 1s step-end infinite",
});

export const statusStyle = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  flexShrink: 0,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: vars.colors.mutedForeground,
});

export const liveStyle = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4em",
  color: vars.colors.foreground,
});

// The one lit mark of the window: mint, on paper (a dot, not a glow).
export const liveDotStyle = style({
  width: "0.4rem",
  height: "0.4rem",
  borderRadius: vars.radius.full,
  backgroundColor: `color-mix(in oklab, ${vars.colors.secondary} 80%, ${vars.colors.foreground})`,
  animation: "pulse 2.4s ease-in-out infinite",
});

export const screenWrapStyle = style({
  padding: vars.spacing.lg,
  paddingBottom: vars.spacing.md,
});

// The screen's ground behind a cut-out capture: ink glass for the specimens that paint their
// own dark (HUDs, shaders), lamp-lit paper for the CSS-3D objects.
export const inkScreenStyle = style({
  vars: {
    [chromeScreen.color]: `color-mix(in srgb, ${vars.colors.foreground} 98%, ${vars.colors.muted})`,
    [chromeScreen.image]: `
      radial-gradient(70% 60% at 22% 18%, color-mix(in srgb, ${vars.colors.secondary} 12%, transparent), transparent 70%),
      radial-gradient(60% 60% at 82% 88%, color-mix(in srgb, ${vars.colors.tertiary} 14%, transparent), transparent 70%)
    `,
  },
});

export const paperScreenStyle = style({
  vars: {
    [chromeScreen.color]: vars.colors.card,
    [chromeScreen.image]: `
      radial-gradient(90% 80% at 18% 12%, color-mix(in srgb, white 70%, transparent), transparent 65%),
      linear-gradient(180deg, transparent 55%, color-mix(in srgb, ${vars.colors.cardBorder} 45%, transparent))
    `,
  },
});

export const demoStyle = style({
  position: "absolute",
  inset: 0,
});

// The live demo takes over from its capture; the capture stays under it, faded, as its face.
globalStyle(`:is(${inkScreenStyle}, ${paperScreenStyle}):has(> [data-labs-live]) > img`, {
  opacity: 0,
  transition: `opacity ${motion.duration.slow} ${motion.easing.out} ${motion.duration.base}`,
});

export const bodyStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  padding: `0 ${vars.spacing.lg} ${vars.spacing.lg}`,
});

export const kickerStyle = style({
  ...machine,
  margin: 0,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: vars.colors.mutedForeground,
});

export const titleStyle = style({
  margin: 0,
  fontSize: vars.fontSize["3xl"],
  ...weight(700),
  lineHeight: vars.lineHeight.tight,
  letterSpacing: "-0.015em",
  textWrap: "balance",
});

export const sentenceStyle = style({
  margin: 0,
  fontSize: vars.fontSize.base,
  lineHeight: "1.45",
  textWrap: "pretty",
});

export const tagsStyle = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.xs,
  marginTop: vars.spacing.xs,
});

// The experiment's own files, as `tree -h` prints one directory.
export const subtreeStyle = style({
  display: "flex",
  flexDirection: "column",
  marginTop: vars.spacing.md,
  paddingTop: vars.spacing.md,
  borderTop: rule,
});

const subtreeLine = {
  ...machine,
  margin: 0,
  display: "flex",
  alignItems: "baseline",
  minHeight: "1.5rem",
  fontSize: vars.fontSize.xs,
  lineHeight: "1.5rem",
  letterSpacing: "0.04em",
  whiteSpace: "pre",
} as const;

export const subtreeCommandStyle = style({
  ...subtreeLine,
  color: vars.colors.mutedForeground,
});

export const subtreeLineStyle = style(subtreeLine);

export const subtreeGlyphStyle = style({
  ...weight(900),
  color: `color-mix(in oklab, ${vars.colors.foreground} 72%, ${vars.colors.background})`,
});

export const subtreeSizeStyle = style({
  marginRight: "1.2em",
  color: vars.colors.mutedForeground,
});

export const subtreeNameStyle = style({
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const subtreeLinesStyle = style({
  marginLeft: "auto",
  paddingLeft: vars.spacing.md,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: vars.colors.mutedForeground,
});

export const subtreeClosingStyle = style({
  ...subtreeLine,
  marginTop: vars.spacing.sm,
  color: vars.colors.mutedForeground,
});

export const openStyle = style({
  ...machine,
  ...weight(900),
  alignSelf: "flex-start",
  display: "inline-flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  minHeight: "2.75rem",
  marginTop: vars.spacing.xs,
  fontSize: vars.fontSize.base,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  textDecoration: "none",
  color: vars.colors.foreground,
  selectors: {
    "&:hover": { textDecoration: "underline", textUnderlineOffset: "0.3em" },
  },
});

export const openArrowStyle = style({
  transition: `transform ${motion.duration.base} ${motion.easing.signature}`,
  selectors: {
    [`${openStyle}:hover &`]: { transform: "translateX(3px)" },
  },
});
