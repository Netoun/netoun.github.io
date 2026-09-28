import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

const ACCENT_MAP = {
  primary: vars.colors.primary,
  secondary: vars.colors.secondary,
  tertiary: vars.colors.tertiary,
} as const;

// Visible by default: page headers are faded in by anime (which applies its own
// opacity from-value), section headers by the [data-reveal] system. A CSS
// opacity: 0 here would leave headers invisible without JS or with reduced motion.
export const containerStyle = recipe({
  base: {
    willChange: "transform, opacity",
    contain: "layout paint",
  },
  variants: {
    variant: {
      section: {
        marginBottom: vars.spacing["xl"],
      },
      page: {
        marginBottom: vars.spacing["2xl"],
      },
    },
  },
  defaultVariants: {
    variant: "section",
  },
});

export const titleStyle = recipe({
  base: {
    color: vars.colors.foreground,
    marginBottom: vars.spacing.sm,
    lineHeight: vars.lineHeight.tight,
  },
  variants: {
    // Mobile-first: display sizes step down one notch on small screens so
    // long titles (EXPERIENCE) don't wrap awkwardly at 375px.
    size: {
      sm: {
        fontSize: vars.fontSize["2xl"],
        "@media": { [breakpoints.md]: { fontSize: vars.fontSize["3xl"] } },
      },
      md: {
        fontSize: vars.fontSize["3xl"],
        "@media": { [breakpoints.md]: { fontSize: vars.fontSize["4xl"] } },
      },
      lg: {
        fontSize: vars.fontSize["4xl"],
        "@media": { [breakpoints.md]: { fontSize: vars.fontSize["5xl"] } },
      },
    },
    // Paper does not glow. The section accent now lives only in the `_❯`
    // prefix — a small deliberate mark instead of a coloured haze spread
    // behind the headline. Glows stay a dark-world
    // (hero / footer) vocabulary.
    variant: {
      primary: {},
      secondary: {},
      tertiary: {},
    },
  },
  defaultVariants: {
    size: "lg",
    variant: "primary",
  },
});

export const prefixStyle = recipe({
  base: {
    marginRight: vars.spacing.sm,
  },
  variants: {
    variant: {
      primary: {
        color: `color-mix(in srgb, ${ACCENT_MAP.primary} 50%, ${vars.colors.foreground})`,
      },
      secondary: {
        color: `color-mix(in srgb, ${ACCENT_MAP.secondary} 50%, ${vars.colors.foreground})`,
      },
      tertiary: {
        color: `color-mix(in srgb, ${ACCENT_MAP.tertiary} 50%, ${vars.colors.foreground})`,
      },
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

// Doto read at 14px: weight 800 is the floor (DESIGN.md › The Legible Dot-Matrix Rule).
export const descriptionStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.sm,
  fontWeight: 800,
  color: vars.colors.mutedForeground,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
});

// Terminal section numbering (`_01 /`) — eyebrow above the title, same Doto
// vocabulary as the description line.
export const indexStyle = style({
  display: "block",
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.sm,
  fontWeight: 800,
  color: vars.colors.mutedForeground,
  letterSpacing: "0.14em",
  marginBottom: vars.spacing.xs,
});
