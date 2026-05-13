import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const miscPageLayout = style({
  display: "flex",
  minHeight: "100vh",
});

export const miscPageSidebar = style({
  width: "72px",
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
  padding: vars.spacing.md,
  borderRight: `1px solid ${vars.colors.border}`,
  backgroundColor: vars.colors.card,
  zIndex: 10,
});

export const miscPageTab = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  padding: `${vars.spacing.sm} ${vars.spacing.xs}`,
  border: "none",
  borderRadius: vars.radius.sm,
  cursor: "pointer",
  fontSize: vars.fontSize["2xs"],
  fontWeight: vars.fontWeight.medium,
  color: vars.colors.mutedForeground,
  background: "transparent",
  transition: "all 0.2s ease",
  selectors: {
    "&:hover": {
      color: vars.colors.foreground,
      background: vars.colors.accent,
    },
    "&[data-active='true']": {
      color: vars.colors.primary,
      background: vars.colors.accent,
    },
  },
});

export const miscPageTabIcon = style({
  fontSize: vars.fontSize.lg,
});

export const miscPageContent = style({
  flex: 1,
  overflow: "auto",
});
