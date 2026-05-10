import { vars } from "@styles/theme.css";
import { globalKeyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

globalKeyframes("blink", {
  "0%": { opacity: 1 },
  "50%": { opacity: 1 },
  "51%": { opacity: 0 },
  "100%": { opacity: 0 },
});

const ACCENT_MAP = {
  primary: vars.colors.primary,
  secondary: vars.colors.secondary,
  tertiary: vars.colors.tertiary,
} as const;

export const containerStyle = recipe({
  base: {
    opacity: 0,
  },
  variants: {
    variant: {
      section: {
        marginBottom: vars.spacing["xl"],
      },
      page: {
        marginBottom: vars.spacing["2xl"],
      },
    },
  },
  defaultVariants: {
    variant: "section",
  },
});

export const titleStyle = recipe({
  base: {
    color: vars.colors.foreground,
    marginBottom: vars.spacing.sm,
  },
  variants: {
    size: {
      sm: { fontSize: vars.fontSize["3xl"] },
      md: { fontSize: vars.fontSize["4xl"] },
      lg: { fontSize: vars.fontSize["5xl"] },
    },
    variant: {
      primary: {
        textShadow: `0 0 40px color-mix(in srgb, ${ACCENT_MAP.primary} 25%, transparent)`,
      },
      secondary: {
        textShadow: `0 0 40px color-mix(in srgb, ${ACCENT_MAP.secondary} 30%, transparent)`,
      },
      tertiary: {
        textShadow: `0 0 40px color-mix(in srgb, ${ACCENT_MAP.tertiary} 25%, transparent)`,
      },
    },
  },
  defaultVariants: {
    size: "lg",
    variant: "primary",
  },
});

export const prefixStyle = recipe({
  base: {
    marginRight: vars.spacing.sm,
  },
  variants: {
    variant: {
      primary: {
        color: ACCENT_MAP.primary,
        filter: "brightness(0.75)",
      },
      secondary: {
        color: ACCENT_MAP.secondary,
        filter: "brightness(0.8)",
      },
      tertiary: {
        color: ACCENT_MAP.tertiary,
        filter: "brightness(0.8)",
      },
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export const cursorStyle = recipe({
  base: {
    animation: "blink 1s step-end infinite",
  },
  variants: {
    variant: {
      primary: { color: ACCENT_MAP.primary },
      secondary: { color: ACCENT_MAP.secondary },
      tertiary: { color: ACCENT_MAP.tertiary },
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export const descriptionStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.sm,
  fontWeight: 600,
  color: vars.colors.foreground,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
});
