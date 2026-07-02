import { breakpoints } from "@styles/responsive.css";
import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

// Film grain svg as data-uri (feTurbulence fractalNoise, 160×160 tile)
const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// ── Shell ──────────────────────────────────────────────────────────────────
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

// ── Sidebar ────────────────────────────────────────────────────────────────
export const sidebar = style({
  // Stacking context so all absolute layers are confined to the sidebar
  position: "sticky",
  inset: vars.spacing.sm,
  zIndex: 9999,
  isolation: "isolate",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  borderRadius: vars.radius.md,
  marginInline: vars.spacing.md,
  "@media": {
    // Mobile/tablet app-bar: symmetric 16px float (top = sides) so it doesn't
    // hug the top edge tighter than the sides.
    "screen and (max-width: 1023.98px)": {
      top: vars.spacing.md,
      marginBlockStart: vars.spacing.md,
    },
    [breakpoints.lg]: {
      width: "17rem",
      flexShrink: 0,
      height: `calc(100vh - ${vars.spacing.sm} * 2)`,
      overflowY: "auto",
      borderBottom: "none",
      marginInline: 0,
    },
  },
});

// Absolutely-positioned canvas layer (z -2, behind scrim and grain)
export const sidebarMeshCanvas = style({
  position: "absolute",
  inset: 0,
  zIndex: -2,
  pointerEvents: "none",
  width: "100%",
  height: "100%",
});

// Dark vertical scrim: keeps the sidebar a deep, legible console base so light
// text reads — colored glows show through on top, but it never goes flat black.
export const sidebarScrim = style({
  position: "absolute",
  inset: 0,
  zIndex: -1,
  pointerEvents: "none",
  background:
    "linear-gradient(180deg, oklch(0.16 0.014 90 / 0.55) 0%, oklch(0.12 0.012 90 / 0.7) 100%)",
  "@media": {
    // Sticky app-bar on mobile/tablet: make the base near-opaque so content
    // scrolling underneath doesn't bleed through (halos above still glow).
    "screen and (max-width: 1023.98px)": {
      background:
        "linear-gradient(180deg, oklch(0.16 0.014 90 / 0.94) 0%, oklch(0.12 0.012 90 / 0.97) 100%)",
    },
  },
});

// Mesh color halos (gold / cyan / violet) blended additively — subtle glows
// that carry the accent identity without washing out the text.
export const sidebarHalos = style({
  position: "absolute",
  inset: 0,
  zIndex: 0,
  pointerEvents: "none",
  mixBlendMode: "screen",
  background: [
    "radial-gradient(120% 55% at 0% 0%, oklch(0.8858 0.182 95.69 / 0.28) 0%, transparent 55%)",
    "radial-gradient(120% 55% at 0% 100%, oklch(0.7906 0.1573 166.87 / 0.24) 0%, transparent 55%)",
    "radial-gradient(120% 65% at 100% 18%, oklch(0.64 0.235 312.98 / 0.28) 0%, transparent 55%)",
  ].join(", "),
});

// Film-grain texture overlay (mix-blend-mode overlay, non-interactive)
export const sidebarGrain = style({
  position: "absolute",
  inset: 0,
  zIndex: 0,
  pointerEvents: "none",
  opacity: 0.4,
  mixBlendMode: "overlay",
  backgroundImage: GRAIN_SVG,
});

// All real content sits above the layers above (z 1)
export const sidebarContent = style({
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  flex: 1,
  // Inherit overflow so the nav can scroll on desktop
  "@media": {
    [breakpoints.lg]: {
      overflowY: "auto",
      height: "100%",
    },
  },
});

// ── Header / brand ─────────────────────────────────────────────────────────
export const conHead = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  paddingInline: vars.spacing.lg,
  paddingBlock: vars.spacing.md,
  zIndex: 50,
  "@media": {
    // Mobile: collapse the header into a slim app-bar row (brand ↔ menu);
    // the full nav lives in the overlay so the console chrome isn't needed here.
    "screen and (max-width: 1023.98px)": {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  },
});

// Back-to-homepage link sitting above the brand (console-style, muted → cyan)
export const homeLink = style({
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
  gap: "0.4rem",
  fontFamily: vars.fontFamily.doto,
  fontSize: "0.7rem",
  letterSpacing: "0.08em",
  whiteSpace: "nowrap",
  textDecoration: "none",
  color: vars.colors.muted,
  transition: "color 0.16s ease",
  selectors: {
    "&:hover": {
      color: vars.colors.secondary,
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
  gap: "0.6rem",
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize["2xl"],
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "0.22em",
  textDecoration: "none",
  color: vars.colors.primary,
  textShadow: vars.textShadow.glowPrimary,
});

export const brandMark = style({
  fontSize: "1.35rem",
  filter: "drop-shadow(0 0 6px oklch(0.8858 0.182 95.69 / 0.6))",
});

export const verBadge = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize["2xs"],
  fontWeight: vars.fontWeight.medium,
  letterSpacing: "0.12em",
  borderRadius: vars.radius.full,
  padding: "0.15rem 0.5rem",
  whiteSpace: "nowrap",
  "@media": {
    // Hidden in the slim mobile app-bar to free room for home link + menu
    "screen and (max-width: 1023.98px)": {
      display: "none",
    },
  },
});

// ── Status line ────────────────────────────────────────────────────────────
export const statusLine = style({
  display: "flex",
  alignItems: "center",
  gap: "0.45rem",
  fontFamily: vars.fontFamily.doto,
  color: vars.colors.secondary,
  fontSize: "0.7rem",
  letterSpacing: "0.08em",
  "@media": {
    // Hidden in the slim mobile app-bar
    "screen and (max-width: 1023.98px)": {
      display: "none",
    },
  },
});

export const statusPrompt = style({
  color: vars.colors.secondary,
});

export const statusDot = style({
  width: "0.4rem",
  height: "0.4rem",
  borderRadius: vars.radius.full,
  flexShrink: 0,
  background: vars.colors.secondary,
  boxShadow: `0 0 7px ${vars.colors.secondary}`,
  animation: "pulse 2.4s ease-in-out infinite",
});

export const blinkCursor = style({
  color: vars.colors.primary,
  animation: "blink 1.1s step-end infinite",
});

// ── Mobile menu button ─────────────────────────────────────────────────────
export const menuButton = style({
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
  borderRadius: vars.radius.sm,
  background: "transparent",
  color: vars.colors.primary,
  fontFamily: vars.fontFamily.doto,
  fontSize: "0.7rem",
  letterSpacing: "0.1em",
  whiteSpace: "nowrap",
  cursor: "pointer",
  border: "1px solid transparent",
  transition: "border-color 0.15s ease, color 0.15s ease, background 0.15s ease",
  padding: vars.spacing.xs,
  borderColor: `color-mix(in oklch, ${vars.colors.primary} 50%, transparent)`,
  selectors: {
    "&:hover": {
      borderColor: vars.colors.primary,
      color: vars.colors.primary,
    },
    // When the overlay is open, float the toggle above it as the close control.
    "&[aria-expanded='true']": {
      zIndex: 50,
    },
  },
  "@media": {
    "screen and (max-width: 1023.98px)": {
      marginTop: 0,
    },
    [breakpoints.lg]: {
      display: "none",
    },
  },
});

// ── Nav ────────────────────────────────────────────────────────────────────
export const nav = style({
  flexDirection: "column",
  gap: "1.4rem",
  padding: "1.1rem 0.75rem 0.5rem",
  display: "none",
  selectors: {
    "&[data-open='true']": {
      display: "flex",
    },
  },
  "@media": {
    // Mobile/tablet: when opened the nav becomes a full-screen console overlay
    // (max-width keeps these rules out of the desktop sidebar layout).
    "screen and (max-width: 1023.98px)": {
      position: "fixed",
      inset: 0,
      zIndex: 40,
      gap: "1.25rem",
      padding: `4.75rem ${vars.spacing.lg} 2rem`,
      overflowY: "auto",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      background: [
        "radial-gradient(120% 50% at 0% 0%, oklch(0.8858 0.182 95.69 / 0.2) 0%, transparent 55%)",
        "radial-gradient(120% 50% at 100% 100%, oklch(0.64 0.235 312.98 / 0.2) 0%, transparent 55%)",
        "radial-gradient(120% 50% at 0% 100%, oklch(0.7906 0.1573 166.87 / 0.16) 0%, transparent 55%)",
        "linear-gradient(180deg, oklch(0.14 0.014 90 / 0.96) 0%, oklch(0.1 0.012 90 / 0.99) 100%)",
      ].join(", "),
    },
    [breakpoints.lg]: {
      display: "flex",
    },
  },
});

export const navGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "1px",
});

// Group title: `// GROUP` + gradient rule
export const navGroupTitle = style({
  display: "flex",
  alignItems: "center",
  gap: "0.45rem",
  margin: 0,
  marginBottom: "0.4rem",
  padding: `0 ${vars.spacing.sm}`,
  fontFamily: vars.fontFamily.doto,
  fontSize: "0.62rem",
  fontWeight: vars.fontWeight.semibold,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: vars.colors.primary,
  selectors: {
    // `//` prefix in faint border color
    "&::before": {
      content: '"//"',
      color: vars.colors.border,
      flexShrink: 0,
    },
    // Trailing gradient rule fills remaining width
    "&::after": {
      content: '""',
      flex: 1,
      height: "1px",
      background: `linear-gradient(90deg, ${vars.colors.border}, transparent)`,
    },
  },
});

// ── Nav link ───────────────────────────────────────────────────────────────
export const navLink = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  padding: "0.5rem 0.6rem",
  borderRadius: vars.radius.sm,
  color: vars.colors.muted,
  textDecoration: "none",
  fontSize: vars.fontSize.sm,
  transition: "color 0.16s ease, background 0.16s ease",
  // Left accent bar (grows to 60% height on active)
  selectors: {
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: "50%",
      height: 0,
      width: "2px",
      borderRadius: "2px",
      transform: "translateY(-50%)",
      transition: "height 0.18s ease",
    },
    // Hover state
    "&:hover": {
      background: "oklch(1 0 0 / 0.04)",
    },
    // Active state base (aria-current from NavLink)
    "&[aria-current='page']": {
      color: vars.colors.background,
      background: "oklch(1 0 0 / 0.05)",
    },
    "&[aria-current='page']::before": {
      height: "60%",
    },
    // ── primary (gold) active ──
    "&[data-accent='primary'][aria-current='page']": {
      background: "linear-gradient(90deg, oklch(0.8858 0.182 95.69 / 0.14), transparent 80%)",
    },
    "&[data-accent='primary'][aria-current='page']::before": {
      background: vars.colors.primary,
      boxShadow: `0 0 8px ${vars.colors.primary}`,
    },
    // ── secondary (cyan) active ──
    "&[data-accent='secondary'][aria-current='page']": {
      background: "linear-gradient(90deg, oklch(0.7906 0.1573 166.87 / 0.14), transparent 80%)",
    },
    "&[data-accent='secondary'][aria-current='page']::before": {
      background: vars.colors.secondary,
      boxShadow: `0 0 8px ${vars.colors.secondary}`,
    },
    // ── tertiary (violet) active ──
    "&[data-accent='tertiary'][aria-current='page']": {
      background: "linear-gradient(90deg, oklch(0.64 0.235 312.98 / 0.15), transparent 80%)",
    },
    "&[data-accent='tertiary'][aria-current='page']::before": {
      background: vars.colors.tertiary,
      boxShadow: `0 0 8px ${vars.colors.tertiary}`,
    },
  },
});

// ❯ prompt character (Doto, faint; accent-colored on active)
export const navPrompt = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: "0.8rem",
  color: vars.colors.mutedForeground,
  flexShrink: 0,
  transition: "color 0.16s ease",
  selectors: {
    // Hover: slightly brighter
    [`${navLink}:hover &`]: {
      color: vars.colors.muted,
    },
    // Active per accent
    [`${navLink}[data-accent='primary'][aria-current='page'] &`]: {
      color: vars.colors.primary,
    },
    [`${navLink}[data-accent='secondary'][aria-current='page'] &`]: {
      color: vars.colors.secondary,
    },
    [`${navLink}[data-accent='tertiary'][aria-current='page'] &`]: {
      color: vars.colors.tertiary,
    },
  },
});

// Isometric icon cell (fixed width so text aligns across rows).
// `color` drives the SVG's `currentColor` faces — tinted per accent.
export const navIcon = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "22px",
  height: "22px",
  flexShrink: 0,
  opacity: 0.82,
  transition: "opacity 0.16s ease, filter 0.16s ease, transform 0.16s ease",
  selectors: {
    [`${navLink}[data-accent='primary'] &`]: { color: vars.colors.primary },
    [`${navLink}[data-accent='secondary'] &`]: { color: vars.colors.secondary },
    [`${navLink}[data-accent='tertiary'] &`]: { color: vars.colors.tertiary },
    [`${navLink}:hover &`]: {
      opacity: 1,
    },
    [`${navLink}[aria-current='page'] &`]: {
      opacity: 1,
      filter: "drop-shadow(0 0 5px currentColor)",
      transform: "translateY(-1px)",
    },
  },
});

// Title text (ellipsis on overflow)
export const navText = style({
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  letterSpacing: "0.01em",

  selectors: {
    [`${navLink}:hover &`]: {
      opacity: 1,
      color: vars.colors.background,
    },
    // Arrow color matches accent on active
    [`${navLink}[data-accent='primary'][aria-current='page'] &`]: {
      color: vars.colors.primary,
    },
    [`${navLink}[data-accent='secondary'][aria-current='page'] &`]: {
      color: vars.colors.secondary,
    },
    [`${navLink}[data-accent='tertiary'][aria-current='page'] &`]: {
      color: vars.colors.tertiary,
    },
  },
});

// ⤘ trailing arrow: hidden by default, slides in on active
export const navArrow = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: "0.85rem",
  flexShrink: 0,
  opacity: 0,
  transform: "translateX(-4px)",
  transition: "opacity 0.16s ease, transform 0.16s ease, color 0.16s ease",
  selectors: {
    [`${navLink}[aria-current='page'] &`]: {
      opacity: 1,
      transform: "translateX(0)",
    },
    // Arrow color matches accent on active
    [`${navLink}[data-accent='primary'][aria-current='page'] &`]: {
      color: vars.colors.primary,
    },
    [`${navLink}[data-accent='secondary'][aria-current='page'] &`]: {
      color: vars.colors.secondary,
    },
    [`${navLink}[data-accent='tertiary'][aria-current='page'] &`]: {
      color: vars.colors.tertiary,
    },
  },
});

// ── Console footer ─────────────────────────────────────────────────────────
export const conFoot = style({
  marginTop: "auto",
  padding: "0.85rem 1.15rem 1.1rem",
  fontFamily: vars.fontFamily.doto,
  fontSize: "0.66rem",
  letterSpacing: "0.06em",
  color: vars.colors.foreground,
  display: "flex",
  alignItems: "center",
  gap: "0.3rem",
  "@media": {
    // Hidden in the slim mobile app-bar
    "screen and (max-width: 1023.98px)": {
      display: "none",
    },
  },
});

export const footPrompt = style({
  color: vars.colors.secondary,
});

// ── Content area ───────────────────────────────────────────────────────────
export const content = style({
  flex: 1,
  minWidth: 0,
  paddingInline: vars.spacing.md,
  "@media": {
    // Breathing room under the sticky app-bar so the page title isn't jammed
    // against it (sides stay 16px, aligned with the header).
    "screen and (max-width: 1023.98px)": {
      paddingBlock: vars.spacing.lg,
    },
    [breakpoints.lg]: {
      paddingBlock: vars.spacing.lg,
    },
  },
});
