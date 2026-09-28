import { vars } from "@styles/theme.css";
import { keyframes, style } from "@vanilla-extract/css";
import { motion } from "@/styles/motion.css";
import { breakpoints } from "@/styles/responsive.css";
import { serverRackVars } from "@/components/misc/server-unit/server-unit.css";

const paper = (percent: number) =>
  `color-mix(in srgb, ${vars.colors.background} ${percent}%, transparent)`;

// The panel is the bottom bookend of the hero: full-bleed, inset by the same 0.5rem. Its
// content stays on the page column (Container), padded like the hero's text.
export const footerStyle = style({
  paddingTop: vars.spacing["3xl"],
  paddingBottom: vars.spacing.sm,
  backgroundColor: "transparent",
});

export const footerVisualContainerStyle = style({
  // Dark panel: every focus ring inside it is gold.
  vars: { [vars.colors.ring]: vars.colors.primary },
  position: "relative",
  overflow: "hidden",
  marginInline: vars.spacing.sm,
  borderRadius: vars.radius.md,
  backgroundColor: `color-mix(in srgb, ${vars.colors.foreground} 98%, ${vars.colors.accent})`,
  paddingTop: vars.spacing.xl,
  paddingBottom: vars.spacing.md,
  boxShadow: `
    inset 0 0 200px color-mix(in srgb, ${vars.colors.foreground} 80%, transparent),
    inset 0 0 40px color-mix(in srgb, ${vars.colors.foreground} 60%, transparent),
    inset 0 1px 0 ${paper(8)}
  `,

  ":after": {
    content: "",
    position: "absolute",
    inset: 0,
    zIndex: 10,
    opacity: 0.2,
    pointerEvents: "none",
    backgroundImage: `
      radial-gradient(at 0% 10%, ${vars.colors.foreground} 0, transparent 50%),
      radial-gradient(at 0% 1%, ${vars.colors.foreground} 0, transparent 50%)
    `,
  },

  "@media": {
    [breakpoints.md]: {
      borderRadius: vars.radius.xl,
      paddingBlock: vars.spacing["3xl"],
    },
  },
});

// Stacked below xl (rack, contact, status); from xl the rack takes the left column and the
// faceplate the right one, which is where the patch cable can hang between them.
export const footerContentStyle = style({
  position: "relative",
  zIndex: 20,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gridTemplateAreas: '"rack" "contact" "status"',
  rowGap: vars.spacing.xl,
  paddingInline: vars.spacing.sm,

  "@media": {
    [breakpoints.md]: { paddingInline: vars.spacing["3xl"] },
    [breakpoints.xl]: {
      gridTemplateColumns: "24.5rem minmax(0, 1fr)",
      gridTemplateAreas: '"rack contact" "status status"',
      columnGap: vars.spacing["2xl"],
      rowGap: "2.75rem",
      alignItems: "start",
    },
  },
});

export const rackColumnStyle = style({
  gridArea: "rack",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: vars.spacing.md,

  "@media": {
    [breakpoints.xl]: {
      alignItems: "flex-start",
      paddingTop: vars.spacing.md,
      paddingLeft: vars.spacing.sm,
    },
  },
});

// The rack sizes itself from these (ServerUnitRack size="inherit").
export const rackWrapperStyle = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transformStyle: "preserve-3d",
  transform: "rotateX(4deg) rotateY(24deg)",
  vars: {
    [serverRackVars.width]: "13rem",
    [serverRackVars.unitHeight]: "60px",
    [serverRackVars.gap]: "8px",
    [serverRackVars.patchHeight]: "76px",
  },

  "@media": {
    [breakpoints.md]: {
      vars: {
        [serverRackVars.width]: "15rem",
        [serverRackVars.unitHeight]: "84px",
        [serverRackVars.gap]: "10px",
        [serverRackVars.patchHeight]: "80px",
      },
    },
    [breakpoints.xl]: {
      justifyContent: "flex-start",
      vars: {
        [serverRackVars.width]: "15.625rem",
        [serverRackVars.unitHeight]: "100px",
        [serverRackVars.patchHeight]: "84px",
      },
    },
  },
});

export const rackCaptionStyle = style({
  display: "inline-flex",
  alignItems: "center",
  minHeight: "2.75rem",
  fontFamily: vars.fontFamily.doto,
  fontWeight: vars.fontWeight.extrabold,
  fontSize: "0.9375rem",
  letterSpacing: "0.08em",
  // Brighter than mutedForegroundOnDark: it sits over the mesh's gold bloom, where the
  // muted tone fell to 3.8:1.
  color: `color-mix(in oklab, ${vars.colors.background} 82%, ${vars.colors.foreground})`,
  textDecoration: "none",
  borderRadius: vars.radius.xs,
  outline: "2px solid transparent",
  outlineOffset: "2px",
  transition: `color ${motion.duration.fast} ${motion.easing.out}`,

  selectors: {
    "&:hover": { color: vars.colors.primary },
    "&:focus-visible": { color: vars.colors.primary, outlineColor: vars.colors.primary },
  },

  "@media": {
    [breakpoints.xl]: { marginLeft: "2.25rem" },
  },
});

export const rackCaptionArrowStyle = style({
  marginRight: "0.5em",
});

export const contactColumnStyle = style({
  gridArea: "contact",
  display: "flex",
  flexDirection: "column",
  gap: "1.25rem",
  minWidth: 0,
});

export const headingStyle = style({
  display: "flex",
  alignItems: "center",
  margin: 0,
  fontFamily: vars.fontFamily.doto,
  fontWeight: vars.fontWeight.extrabold,
  fontSize: vars.fontSize["2xl"],
  lineHeight: 1.2,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: vars.colors.background,

  "@media": {
    [breakpoints.md]: { fontSize: "1.75rem" },
    [breakpoints.xl]: { fontSize: "2rem" },
  },
});

export const promptStyle = style({
  marginRight: "0.75rem",
  color: vars.colors.primary,
});

const cursorBlink = keyframes({
  "0%, 49%": { opacity: 1 },
  "50%, 100%": { opacity: 0 },
});

export const cursorStyle = style({
  marginLeft: "0.375rem",
  color: vars.colors.primary,
  animation: `${cursorBlink} 1.2s step-end infinite`,

  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
});

export const statusRowStyle = style({
  gridArea: "status",
  minWidth: 0,
});
