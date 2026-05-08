import { vars } from "@styles/theme.css";
import { recipe } from "@vanilla-extract/recipes";

export type TagColor = "pink" | "green" | "purple" | "yellow" | "blue" | "default";

export const tagStyle = recipe({
  base: {
    fontFamily: vars.fontFamily.doto,
    fontSize: "9.5px",
    letterSpacing: "0.08em",
    padding: "3px 10px",
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
        backgroundColor: `color-mix(in srgb, #22c55e 18%, transparent)`,
        color: vars.colors.foreground,
      },
      purple: {
        backgroundColor: `color-mix(in srgb, ${vars.colors.tertiary} 18%, transparent)`,
        color: vars.colors.foreground,
      },
      yellow: {
        backgroundColor: `color-mix(in srgb, #eab308 18%, transparent)`,
        color: vars.colors.foreground,
      },
      blue: {
        backgroundColor: `color-mix(in srgb, #3b82f6 18%, transparent)`,
        color: vars.colors.foreground,
      },
      default: {
        backgroundColor: "oklch(0.92 0.02 80 / 0.5)",
        color: vars.colors.foreground,
      },
    },
  },
});
