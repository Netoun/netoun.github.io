import { keyframes, style } from "@vanilla-extract/css";
import { buttonRecipe } from "@/components/primitives/button/button.css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";

export const welcomeSectionStyles = style({
  position: "relative",
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const welcomeContainerStyle = style({
  position: "relative",
  zIndex: 10,
  display: "flex",
  overflow: "hidden",
  borderRadius: vars.radius.md,
  height: "100%",
  width: "100%",
  backgroundColor: `color-mix(in srgb, ${vars.colors.foreground} 98%, ${vars.colors.accent})`,
  backgroundSize: "calc(0.5rem - 1px) calc(0.5rem - 1px)",
  backgroundPosition: "-5px -5px",
  padding: vars.spacing.md,
  paddingTop: vars.spacing.xl,
  boxShadow: `
    inset 0 0 200px color-mix(in srgb, ${vars.colors.foreground} 80%, transparent),
    inset 0 0 40px color-mix(in srgb, ${vars.colors.foreground} 60%, transparent)
  `,
  willChange: "transform",
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
    [breakpoints.md]: {
      borderRadius: vars.radius.xl,
    },
    [breakpoints.lg]: {
      padding: vars.spacing["3xl"],
    },
    [breakpoints["2k"]]: {
      padding: "6rem",
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
