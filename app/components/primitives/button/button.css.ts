import { motion } from "@styles/motion.css";
import { vars } from "@styles/theme.css";
import { recipe } from "@vanilla-extract/recipes";

export const buttonRecipe = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: vars.radius.lg,
    fontWeight: vars.fontWeight.medium,
    fontSize: vars.fontSize.sm,
    lineHeight: vars.lineHeight.tight,
    border: "1px solid transparent",
    cursor: "pointer",
    transitionProperty: "box-shadow, transform",
    transitionDuration: `${motion.duration.base}, ${motion.duration.fast}`,
    transitionTimingFunction: motion.easing.signature,
    textDecoration: "none",
    outline: "2px solid transparent",
    outlineOffset: "2px",

    ":hover": {
      transform: "translateY(-2px)",
    },

    ":active": {
      transform: "translateY(0) scale(0.98)",
      transitionDuration: motion.duration.fast,
    },

    // foreground plutôt que primary : le ring doit rester visible sur le fond beige
    // (primary gold ≈ même luminance que le background, contraste < 3:1)
    ":focus-visible": {
      outlineColor: vars.colors.foreground,
    },

    ":disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
      transform: "none",
    },
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: vars.colors.primary,
        color: vars.colors.primaryForeground,
        boxShadow: vars.boxShadow.glow,
        ":hover": {
          backgroundColor: `color-mix(in srgb, ${vars.colors.primary} 90%, transparent)`, // primary darker
        },
      },
      secondary: {
        backgroundColor: vars.colors.background,
        color: vars.colors.foreground,
        borderColor: vars.colors.border,
        boxShadow: vars.boxShadow.glowXl,
        ":hover": {
          boxShadow: vars.boxShadow.glow2xl,
          backgroundColor: vars.colors.muted,
        },
      },
      ghost: {
        backgroundColor: "transparent",
        color: vars.colors.mutedForeground,
        borderColor: "transparent",

        ":hover": {
          backgroundColor: vars.colors.muted,
        },
      },
      danger: {
        backgroundColor: vars.colors.destructive,
        color: vars.colors.destructiveForeground,

        ":hover": {
          backgroundColor: `color-mix(in srgb, ${vars.colors.destructive} 90%, transparent)`, // destructive darker
        },
      },
    },

    size: {
      small: {
        padding: `${vars.spacing.xs} ${vars.spacing.sm}`,
        fontSize: vars.fontSize.xs,
      },
      medium: {
        padding: `${vars.spacing.sm} ${vars.spacing.md}`,
        fontSize: vars.fontSize.sm,
      },
      large: {
        padding: `${vars.spacing.md} ${vars.spacing.lg}`,
        fontSize: vars.fontSize.lg,
      },
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
});
