import { keyframes, style } from "@vanilla-extract/css";
import { buttonRecipe } from "@/components/primitives/button/button.css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";

export const welcomeSectionStyles = style({
  height: "800px",
  position: "relative",
  minHeight: "min(100dvh, 68rem)",
});

export const welcomeContainerStyle = style({
  position: "relative",
  zIndex: 10,
  display: "flex",
  overflow: "hidden",
  borderRadius: vars.radius.md,
  height: "100%",
  backgroundColor: `color-mix(in srgb, ${vars.colors.foreground} 98%, ${vars.colors.accent})`,
  backgroundSize: "calc(0.5rem - 1px) calc(0.5rem - 1px)",
  backgroundPosition: "-5px -5px",
  padding: vars.spacing.md,
  paddingTop: vars.spacing.xl,
  boxShadow: `inset 0 0 200px color-mix(in srgb, ${vars.colors.foreground} 80%, transparent), inset 0 0 40px color-mix(in srgb, ${vars.colors.foreground} 60%, transparent)`,

  ":after": {
    content: "",
    position: "absolute",
    inset: 0,
    zIndex: 10,
    opacity: 0.2,
    backgroundImage: `
            radial-gradient(at 0% 10%, ${vars.colors.foreground} 0, transparent 50%),
            radial-gradient(at 0% 1%, ${vars.colors.foreground} 0, transparent 50%);
        `,
  },

  "@media": {
    [breakpoints.md]: {
      borderRadius: vars.radius.xl,
    },
    [breakpoints.lg]: {
      padding: "4rem",
    },
  },
});

export const welcomeContentStyle = style({
  position: "relative",
  zIndex: 20,
  color: vars.colors.background,
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,

  "@media": {
    [breakpoints.md]: {
      gap: vars.spacing["2xl"],
    },
  },
});

// Utilise les ligatures pour le titre principal
export const welcomeHeadingStyles = style({
  fontFeatureSettings: '"liga" 1, "clig" 1', // Active les ligatures standard et contextuelles
  fontStyle: "italic",
  fontWeight: vars.fontWeight.bold,

  // Responsive font size
  fontSize: vars.fontSize["4xl"],
  letterSpacing: "-0.035em",
  lineHeight: "0.9",

  textShadow: `
    0 0 10px color-mix(in srgb, ${vars.colors.background} 26%, transparent),
    0 0 22px color-mix(in srgb, ${vars.colors.background} 18%, transparent),
    0 0 42px color-mix(in srgb, ${vars.colors.secondary} 22%, transparent)
  `,

  "@media": {
    [breakpoints.sm]: {
      fontSize: vars.fontSize["5xl"],
    },
    [breakpoints.md]: {
      maxWidth: "75%",
      fontSize: vars.fontSize["6xl"],
      letterSpacing: "-0.04em",
      lineHeight: "0.9",
    },
    [breakpoints.lg]: {
      maxWidth: "85%",
      fontSize: vars.fontSize["7xl"],
      letterSpacing: "-0.045em",
      lineHeight: "0.8",
    },
  },
});

export const welcomeDescriptionStyles = style({
  fontSize: vars.fontSize.xl,
  maxWidth: "40rem",
  lineHeight: vars.lineHeight.tight,
  zIndex: 9999,
  position: "relative",
  textShadow: vars.textShadow.glowSm,

  "@media": {
    [breakpoints.md]: {
      fontSize: vars.fontSize["2xl"],
    },
  },
});

export const welcomeMetaStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
  marginTop: `-${vars.spacing.sm}`,
  color: `color-mix(in srgb, ${vars.colors.background} 88%, ${vars.colors.secondary} 12%)`,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.base,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  opacity: 0.86,
  textShadow: vars.textShadow.glowSm,
});

const welcomeDescriptionCursorKeyframes = keyframes({
  "0%": {
    opacity: 1,
  },
  "50%": {
    opacity: 0,
  },
  "100%": {
    opacity: 1,
  },
});

export const welcomeDescriptionCursorStyles = style({
  animation: `${welcomeDescriptionCursorKeyframes} 800ms steps(1) infinite`,
});

export const welcomeButtonStyles = style([
  buttonRecipe({
    variant: "secondary",
    size: "large",
  }),
  {
    textTransform: "uppercase",
    fontFamily: vars.fontFamily.doto,
    maxWidth: "300px",
    fontSize: vars.fontSize.xl,
    fontWeight: "900",

    marginTop: vars.spacing.sm,
    textShadow: vars.textShadow.glowPrimary,

    ":hover": {
      textShadow: vars.textShadow.glowPrimary,
    },

    "@media": {
      [breakpoints.md]: {
        fontSize: vars.fontSize["2xl"],
      },
    },
  },
]);

const welcomeButtonArrowKeyframes = keyframes({
  "0%": {
    transform: "translateX(2px)",
  },
  "50%": {
    color: vars.colors.primary,
    transform: "translateX(-1px)",
  },
  "100%": {
    transform: "translateX(2px)",
  },
});

export const welcomeButtonArrowStyles = style({
  marginLeft: vars.spacing.xs,
  transition: "color 200ms ease-in-out",
  selectors: {
    [`${welcomeButtonStyles}:hover &`]: {
      animation: `${welcomeButtonArrowKeyframes} 800ms ease-in-out infinite`,
    },
  },
});

export const welcomeButtonLabelStyles = style({
  selectors: {
    [`${welcomeButtonStyles}:hover &`]: {
      opacity: 0,
    },
  },
});

export const welcomeButtonHoverLabelStyles = style({
  display: "none",
  selectors: {
    [`${welcomeButtonStyles}:hover &`]: {
      display: "inline",
    },
  },
});

export const welcomeLinkStyles = style({
  color: vars.colors.primary,
  textDecoration: "underline",
  textShadow: vars.textShadow.glowPrimary,
});
