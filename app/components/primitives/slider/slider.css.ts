import { vars } from "@styles/theme.css";
import { createVar, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

// Variables CSS pour le slider
const sliderTrackHeight = createVar();
const sliderThumbSize = createVar();

export const sliderRecipe = recipe({
  base: {
    display: "flex",
    flexDirection: "column",
    gap: vars.spacing.xs,
    width: "100%",
  },

  variants: {
    orientation: {
      horizontal: {
        flexDirection: "column",
      },
      vertical: {
        flexDirection: "row",
        height: "200px",
      },
    },

    size: {
      small: {
        vars: {
          [sliderTrackHeight]: "4px",
          [sliderThumbSize]: "16px",
        },
      },
      medium: {
        vars: {
          [sliderTrackHeight]: "6px",
          [sliderThumbSize]: "20px",
        },
      },
      large: {
        vars: {
          [sliderTrackHeight]: "8px",
          [sliderThumbSize]: "24px",
        },
      },
    },

    disabled: {
      true: {
        opacity: 0.5,
        cursor: "not-allowed",
      },
      false: {},
    },
  },

  defaultVariants: {
    orientation: "horizontal",
    size: "medium",
    disabled: false,
  },
});

// Styles pour les éléments du slider utilisant les variables
export const sliderTrackStyle = style({
  height: sliderTrackHeight,
  backgroundColor: vars.colors.muted,
  borderRadius: vars.radius.xs,
});

export const sliderThumbStyle = style({
  width: sliderThumbSize,
  height: sliderThumbSize,
  backgroundColor: vars.colors.primary,
  borderRadius: vars.radius.full,
  border: `2px solid ${vars.colors.background}`,
  boxShadow: vars.boxShadow.sm,
  marginTop: `calc(${vars.spacing.xs} * 0.625)`,
});
