import { keyframes, style } from "@vanilla-extract/css";
import { buttonRecipe } from "@/components/primitives/button/button.css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";
import {
  heroColumnGutter,
  heroLaptopAspect,
  heroPanelPadding,
  heroPanelPaddingTop,
  heroSideBySide2kMedia,
  heroSideBySideMedia,
  heroStackedLaptopWidth,
} from "./welcome-hero-layout.css";

export const welcomeSectionStyles = style({
  position: "relative",
  flex: 1,
  display: "flex",
  // Dark panel: every focus ring inside it is gold.
  vars: { [vars.colors.ring]: vars.colors.primary },
});

// Stacked layout (narrow or short viewports): the laptop sits under the text,
// in space reserved at the bottom of the panel, so the two never overlap and
// the frame grows with the content instead of clipping it.
const stackedLaptopReserve = (laptopWidth: string) =>
  `calc(${laptopWidth} * ${heroLaptopAspect} + ${vars.spacing.lg})`;

export const welcomeContainerStyle = style({
  position: "relative",
  zIndex: 10,
  flex: 1,
  display: "flex",
  overflow: "hidden",
  borderRadius: vars.radius.md,
  width: "100%",
  backgroundColor: `color-mix(in srgb, ${vars.colors.foreground} 98%, ${vars.colors.accent})`,
  backgroundSize: "calc(0.5rem - 1px) calc(0.5rem - 1px)",
  backgroundPosition: "-5px -5px",
  padding: vars.spacing.md,
  // Clears the spec header strip along the top edge.
  paddingTop: heroPanelPaddingTop.base,
  paddingBottom: stackedLaptopReserve(heroStackedLaptopWidth.base),
  boxShadow: `
    inset 0 0 200px color-mix(in srgb, ${vars.colors.foreground} 80%, transparent),
    inset 0 0 40px color-mix(in srgb, ${vars.colors.foreground} 60%, transparent)
  `,
  contain: "layout style paint",

  ":after": {
    content: "",
    position: "absolute",
    inset: 0,
    zIndex: 10,
    opacity: 0.2,
    backgroundImage: `
            radial-gradient(at 0% 10%, ${vars.colors.foreground} 0, transparent 50%),
            radial-gradient(at 0% 1%, ${vars.colors.foreground} 0, transparent 50%);
        `,
  },

  "@media": {
    // From md the text sits on the page's content column (gutter + panel
    // padding): when the frame tightens onto that column, nothing is clipped.
    [breakpoints.md]: {
      borderRadius: vars.radius.xl,
      paddingInline: `calc(${heroColumnGutter} + ${heroPanelPadding.md})`,
      paddingBottom: stackedLaptopReserve(heroStackedLaptopWidth.md),
    },
    [breakpoints.lg]: {
      paddingTop: heroPanelPaddingTop.lg,
      paddingInline: `calc(${heroColumnGutter} + ${heroPanelPadding.lg})`,
    },
    [heroSideBySideMedia]: {
      paddingBottom: vars.spacing["3xl"],
    },
    [heroSideBySide2kMedia]: {
      paddingBlock: heroPanelPaddingTop.sideBySide2k,
    },
  },
});

export const welcomeButtonStyles = style([
  buttonRecipe({
    variant: "secondary",
    size: "large",
  }),
  {
    textTransform: "uppercase",
    fontFamily: vars.fontFamily.doto,
    maxWidth: "300px",
    fontSize: vars.fontSize.xl,
    fontWeight: "900",

    marginTop: vars.spacing.sm,
    textShadow: vars.textShadow.glowPrimary,

    ":hover": {
      textShadow: vars.textShadow.glowPrimary,
    },

    // Sits on the dark hero: buttonRecipe's default focus ring is `foreground`
    // (near-black), invisible here. Dark surfaces use `primary` per DESIGN.md.
    ":focus-visible": {
      outlineColor: vars.colors.primary,
    },

    "@media": {
      [breakpoints.md]: {
        fontSize: vars.fontSize["2xl"],
      },
      [breakpoints["2k"]]: {
        maxWidth: "360px",
        fontSize: vars.fontSize["3xl"],
      },
    },
  },
]);

const welcomeButtonArrowKeyframes = keyframes({
  "0%": {
    transform: "translateX(2px)",
  },
  "50%": {
    color: vars.colors.primary,
    transform: "translateX(-1px)",
  },
  "100%": {
    transform: "translateX(2px)",
  },
});

export const welcomeButtonArrowStyles = style({
  marginLeft: vars.spacing.xs,
  transition: "color 200ms ease-in-out",
  selectors: {
    [`${welcomeButtonStyles}:hover &`]: {
      animation: `${welcomeButtonArrowKeyframes} 800ms ease-in-out infinite`,
    },
  },
});

export const welcomeButtonLabelStyles = style({});
