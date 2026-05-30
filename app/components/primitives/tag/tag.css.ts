import { vars } from "@styles/theme.css";
import { recipe } from "@vanilla-extract/recipes";

// Three intentional tech domains, one per brand accent. Keep in sync with the
// skills section colour legend.
export type TagColor = "frontend" | "backend" | "creative" | "default";
export type TagSize = "small" | "medium" | "large";

export const tagStyle = recipe({
  base: {
    fontFamily: vars.fontFamily.doto,
    letterSpacing: "0.08em",
    borderRadius: vars.radius.full,
    fontWeight: 500,
  },
  variants: {
    color: {
      // Teal — frontend & UI
      frontend: {
        backgroundColor: `color-mix(in srgb, ${vars.colors.secondary} 18%, transparent)`,
        color: vars.colors.foreground,
      },
      // Purple — backend & infra
      backend: {
        backgroundColor: `color-mix(in srgb, ${vars.colors.tertiary} 18%, transparent)`,
        color: vars.colors.foreground,
      },
      // Gold — creative & systems
      creative: {
        backgroundColor: `color-mix(in srgb, ${vars.colors.primary} 18%, transparent)`,
        color: vars.colors.foreground,
      },
      // Neutral — tooling, process, meta
      default: {
        backgroundColor: `color-mix(in srgb, ${vars.colors.muted} 50%, transparent)`,
        color: vars.colors.foreground,
      },
    },
    size: {
      small: {
        fontSize: vars.fontSize.xs,
        padding: `calc(${vars.spacing.xs} * 0.5) calc(${vars.spacing.sm} * 0.75)`,
      },
      medium: {
        fontSize: vars.fontSize["xs"],
        padding: `calc(${vars.spacing.xs} * 0.75) calc(${vars.spacing.sm} * 1.25)`,
      },
      large: {
        fontSize: vars.fontSize.sm,
        padding: `${vars.spacing.xs} calc(${vars.spacing.sm} * 1.5)`,
      },
    },
  },
  defaultVariants: {
    size: "small",
  },
});
