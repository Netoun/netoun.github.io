import { vars } from "@styles/theme.css";
import { recipe } from "@vanilla-extract/recipes";

export type TagColor = "pink" | "green" | "purple" | "yellow" | "blue" | "default";
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
      pink: {
        backgroundColor: `color-mix(in srgb, ${vars.colors.primary} 18%, transparent)`,
        color: vars.colors.foreground,
      },
      green: {
        backgroundColor: `color-mix(in srgb, ${vars.colors.secondary} 18%, transparent)`,
        color: vars.colors.foreground,
      },
      purple: {
        backgroundColor: `color-mix(in srgb, ${vars.colors.tertiary} 18%, transparent)`,
        color: vars.colors.foreground,
      },
      yellow: {
        backgroundColor: `color-mix(in srgb, ${vars.colors.primary} 14%, transparent)`,
        color: vars.colors.foreground,
      },
      blue: {
        backgroundColor: `color-mix(in srgb, ${vars.colors.secondary} 8%, transparent)`,
        color: vars.colors.foreground,
      },
      default: {
        backgroundColor: `color-mix(in srgb, ${vars.colors.muted} 50%, transparent)`,
        color: vars.colors.foreground,
      },
    },
    size: {
      small: {
        fontSize: vars.fontSize["2xs"],
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
