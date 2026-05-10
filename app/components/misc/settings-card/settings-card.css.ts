import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const settingsCard = style({
  position: "absolute",
  top: vars.spacing.md,
  right: vars.spacing.md,
  backgroundImage: `linear-gradient(to bottom right, color-mix(in srgb, ${vars.colors.foreground} 50%, transparent), color-mix(in srgb, ${vars.colors.foreground} 40%, transparent))`,
  borderRadius: vars.radius.lg,
  padding: vars.spacing.md,
  minWidth: "280px",
  zIndex: 1000,
  border: `1px solid ${vars.colors.border}`,
  boxShadow: vars.boxShadow.lg,
  fontSize: vars.fontSize.sm,
  color: vars.colors.background,
  selectors: {
    ':global([data-quality="high"]) &': {
      backdropFilter: "blur(10px)",
    },
  },
});

export const settingsCardHeader = style({
  marginBottom: "16px",
});

export const settingsCardTitle = style({
  fontSize: vars.fontSize.xl,
  color: vars.colors.background,
  fontWeight: "600",
});

export const settingsCardContent = style({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

