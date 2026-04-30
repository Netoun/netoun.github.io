import { createTheme } from "@vanilla-extract/css";
import "@/styles/fonts.css";

export const colors = {
  // Couleurs sémantiques avec OKLCH
  background: "oklch(0.96 0.015 80)",
  foreground: "oklch(0.07 0 0)",

  // Couleurs d'interface
  muted: "oklch(0.96 0 0)",
  mutedForeground: "oklch(0.45 0 0)",

  // Bordures
  border: "oklch(0.9 0 0)",
  input: "oklch(0.9 0 0)",

  // Couleurs primaires
  primary: "oklch(0.8858 0.182 95.69)",
  primaryForeground: "oklch(0.09 0 0)",

  // Couleurs secondaires
  secondary: "oklch(0.7906 0.1573 166.87)",
  secondaryForeground: "oklch(0.15 0 0)",

  // Couleurs tertiaires
  tertiary: "oklch(0.5548 0.2575 312.98)",
  tertiaryForeground: "oklch(0.15 0 0)",

  // Couleurs destructives
  destructive: "oklch(0.55 0.22 29)",
  destructiveForeground: "oklch(0.98 0 0)",

  // Couleur de kirby
  kirby: "oklch(0.8455 0.0872 355.09)",
  kirbyForeground: "oklch(0.15 0 0)",

  // Couleurs d'accent
  accent: "oklch(0.96 0 0)",
  accentForeground: "oklch(0.15 0 0)",

  // États
  success: "oklch(0.7 0.15 142)",
  warning: "oklch(0.8 0.15 85)",
  error: "oklch(0.55 0.22 29)",

  // Ring (focus)
  ring: "oklch(0.7 0.15 264)",
};

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
};

export const radius = {
  none: "0",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  full: "9999px",
};

export const fontSize = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3.5rem",
  "6xl": "4.75rem",
  "7xl": "6rem",
  "8xl": "7.5rem",
  "9xl": "9rem",
  "10xl": "10.5rem",
};

export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

export const lineHeight = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
};

export const fontFamily = {
  inter: "Inter, system-ui, sans-serif",
  doto: "Doto, system-ui, sans-serif",
  ppNeueMontreal: "PPNeueMontreal, system-ui, sans-serif",
  ttAlientzGrotesk: "TTAlientzGrotesk, system-ui, sans-serif",
  mabeoVintage: "MabeoVintage, system-ui, sans-serif",
};

export const boxShadow = {
  innerSm: "inset 0 0 2px 0 oklch(0 0 0 / 0.05)",
  innerMd: "inset 0 0 4px 0 oklch(0 0 0 / 0.05)",
  innerLg: "inset 0 0 6px 0 oklch(0 0 0 / 0.05)",
  sm: "0 1px 2px 0 oklch(0 0 0 / 0.05)",
  md: "0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px oklch(0 0 0 / 0.1), 0 8px 10px -6px oklch(0 0 0 / 0.1)",
  glow: `
	  0 0 7px color-mix(in srgb, ${colors.background} 40%, transparent),
	  0 0 10px color-mix(in srgb, ${colors.background} 30%, transparent),
	  0 0 21px color-mix(in srgb, ${colors.background} 20%, transparent),
	  0 0 42px color-mix(in srgb, ${colors.primary} 20%, transparent),
	  0 0 82px color-mix(in srgb, ${colors.secondary} 20%, transparent);
	`,
  glowXl: `
	  0 0 7px color-mix(in srgb, ${colors.background} 40%, transparent),
	  0 0 10px color-mix(in srgb, ${colors.primary} 30%, transparent),
	  0 0 21px color-mix(in srgb, ${colors.primary} 20%, transparent),
	  0 0 42px color-mix(in srgb, ${colors.primary} 20%, transparent),
	  0 0 82px color-mix(in srgb, ${colors.secondary} 20%, transparent);
	`,
  glow2xl: `
	  0 0 7px color-mix(in srgb, ${colors.background} 50%, transparent),
	  0 0 10px color-mix(in srgb, ${colors.primary} 40%, transparent),
	  0 0 21px color-mix(in srgb, ${colors.primary} 30%, transparent),
	  0 0 42px color-mix(in srgb, ${colors.primary} 30%, transparent),
	  0 0 82px color-mix(in srgb, ${colors.secondary} 30%, transparent),
	  0 0 130px color-mix(in srgb, ${colors.secondary} 20%, transparent),
	  0 0 170px color-mix(in srgb, ${colors.secondary} 10%, transparent)
	`,
};

export const textShadow = {
  glowSm: `
    0 0 7px color-mix(in srgb, ${colors.background} 40%, transparent),
    0 0 10px color-mix(in srgb, ${colors.background} 30%, transparent),
    0 0 21px color-mix(in srgb, ${colors.primary} 20%, transparent),
    0 0 42px color-mix(in srgb, ${colors.secondary} 20%, transparent);
  `,
  glow: `
    0 0 7px color-mix(in srgb, ${colors.background} 40%, transparent),
    0 0 10px color-mix(in srgb, ${colors.background} 30%, transparent),
    0 0 21px color-mix(in srgb, ${colors.background} 20%, transparent),
    0 0 42px color-mix(in srgb, ${colors.primary} 20%, transparent),
    0 0 82px color-mix(in srgb, ${colors.secondary} 20%, transparent);
  `,
  glowPrimary: `
    0 0 7px color-mix(in srgb, ${colors.primary} 40%, transparent),
    0 0 10px color-mix(in srgb, ${colors.primary} 30%, transparent),
    0 0 21px color-mix(in srgb, ${colors.secondary} 20%, transparent),
    0 0 42px color-mix(in srgb, ${colors.secondary} 20%, transparent),
    0 0 82px color-mix(in srgb, ${colors.secondary} 20%, transparent);
  `,
};

export const [theme, vars] = createTheme({
  colors,
  spacing,
  radius,
  fontSize,
  fontWeight,
  lineHeight,
  fontFamily,
  boxShadow,
  textShadow,
});
