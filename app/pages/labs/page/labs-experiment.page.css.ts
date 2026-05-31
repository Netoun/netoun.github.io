import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const labsNotFound = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.md,
  color: vars.colors.mutedForeground,
});

export const labsNotFoundLink = style({
  color: vars.colors.foreground,
  textDecoration: "underline",
  textUnderlineOffset: "0.2em",
});
