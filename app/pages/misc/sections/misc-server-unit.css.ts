import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const serverUnitSection = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundImage: `
        linear-gradient(color-mix(in srgb, ${vars.colors.secondary} 15%, transparent) .1rem, transparent .1rem),
        linear-gradient(90deg, color-mix(in srgb, ${vars.colors.secondary} 15%, transparent) .1rem, transparent .1rem)
    `,
  backgroundSize: "5rem 5rem",
  padding: vars.spacing.md,
});

export const serverUnitWrapperBase = style({});

export const serverUnitWrapper3D = style({
  transformStyle: "preserve-3d",
});

export const serverUnitSettingsSection = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
});

export const serverUnitSettingsLabel = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.md,
});

export const serverUnitSettingsLabelTitle = style({
  fontWeight: vars.fontWeight.bold,
});

export const serverUnitSettingsValue = style({
  width: "3.5rem",
});

export const serverUnitSettingsInput = style({
  width: "100%",
  color: vars.colors.foreground,
});

export const serverUnitSizeRow = style({
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: vars.spacing.xs,
});

export const serverUnitSizeButton = style({
  border: `1px solid color-mix(in srgb, ${vars.colors.border} 80%, transparent)`,
  borderRadius: vars.radius.sm,
  background: `color-mix(in srgb, ${vars.colors.background} 75%, transparent)`,
  color: vars.colors.foreground,
  fontWeight: vars.fontWeight.bold,
  fontSize: vars.fontSize.sm,
  padding: `${vars.spacing.xs} ${vars.spacing.sm}`,
  cursor: "pointer",
});

export const serverUnitSizeButtonActive = style({
  background: `color-mix(in srgb, ${vars.colors.primary} 24%, ${vars.colors.background})`,
  borderColor: vars.colors.primary,
  color: vars.colors.primary,
});
