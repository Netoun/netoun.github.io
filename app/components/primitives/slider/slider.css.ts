import { vars } from "@styles/theme.css";
import { createVar, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

// CSS variables for the slider
const sliderTrackHeight = createVar();
const sliderThumbSize = createVar();

export const sliderRecipe = recipe({
  base: {
    display: "flex",
    flexDirection: "column",
    gap: vars.spacing.xs,
    width: "100%",
    vars: {
      [sliderTrackHeight]: "6px",
      [sliderThumbSize]: "20px",
    },
  },

  variants: {
    orientation: {
      horizontal: {},
      vertical: {
        flexDirection: "row",
        height: "200px",
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
    disabled: false,
  },
});

// Styles for the slider elements, using the variables
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
