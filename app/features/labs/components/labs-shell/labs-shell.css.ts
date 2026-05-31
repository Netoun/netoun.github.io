import { breakpoints } from "@styles/responsive.css";
import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const shell = style({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  "@media": {
    [breakpoints.lg]: {
      flexDirection: "row",
    },
  },
});

export const sidebar = style({
  position: "sticky",
  top: 0,
  zIndex: 20,
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
  padding: vars.spacing.md,
  backgroundColor: vars.colors.card,
  borderBottom: `1px solid ${vars.colors.border}`,
  backdropFilter: "blur(8px)",
  "@media": {
    [breakpoints.lg]: {
      width: "16rem",
      flexShrink: 0,
      height: "100vh",
      overflowY: "auto",
      borderBottom: "none",
      borderRight: `1px solid ${vars.colors.border}`,
    },
  },
});

export const brandRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
});

export const brand = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "0.18em",
  color: vars.colors.foreground,
  textDecoration: "none",
});

export const brandMark = style({
  color: vars.colors.primary,
});

export const menuButton = style({
  padding: `${vars.spacing.xs} ${vars.spacing.sm}`,
  border: `1px solid ${vars.colors.border}`,
  borderRadius: vars.radius.sm,
  background: "transparent",
  color: vars.colors.foreground,
  fontSize: vars.fontSize.xs,
  cursor: "pointer",
  "@media": {
    [breakpoints.lg]: {
      display: "none",
    },
  },
});

export const nav = style({
  flexDirection: "column",
  gap: vars.spacing.lg,
  display: "none",
  selectors: {
    "&[data-open='true']": {
      display: "flex",
    },
  },
  "@media": {
    [breakpoints.lg]: {
      display: "flex",
    },
  },
});

export const navGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
});

export const navGroupTitle = style({
  margin: 0,
  marginBottom: vars.spacing.xs,
  padding: `0 ${vars.spacing.sm}`,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize["2xs"],
  fontWeight: vars.fontWeight.semibold,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: vars.colors.mutedForeground,
});

export const navLink = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  padding: `${vars.spacing.sm} ${vars.spacing.sm}`,
  borderRadius: vars.radius.sm,
  color: vars.colors.mutedForeground,
  textDecoration: "none",
  fontSize: vars.fontSize.sm,
  transition: "color 0.15s ease, background 0.15s ease",
  selectors: {
    "&:hover": {
      color: vars.colors.foreground,
      background: vars.colors.accent,
    },
    "&[aria-current='page']": {
      color: vars.colors.foreground,
      background: vars.colors.accent,
      fontWeight: vars.fontWeight.medium,
    },
  },
});

export const navIcon = style({
  fontSize: vars.fontSize.base,
  lineHeight: 1,
});

export const navText = style({
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const navDot = style({
  width: "0.4rem",
  height: "0.4rem",
  borderRadius: vars.radius.full,
  flexShrink: 0,
  opacity: 0,
  transition: "opacity 0.15s ease",
  selectors: {
    [`${navLink}[aria-current='page'] &`]: {
      opacity: 1,
    },
    "&[data-accent='primary']": { background: vars.colors.primary },
    "&[data-accent='secondary']": { background: vars.colors.secondary },
    "&[data-accent='tertiary']": { background: vars.colors.tertiary },
  },
});

export const content = style({
  flex: 1,
  minWidth: 0,
  padding: vars.spacing.lg,
  "@media": {
    [breakpoints.lg]: {
      padding: vars.spacing["2xl"],
    },
  },
});
