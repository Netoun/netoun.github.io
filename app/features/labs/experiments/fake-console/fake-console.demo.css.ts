import { style } from "@vanilla-extract/css";
import { swatch } from "../../components/labs-readout/labs-readout.css";
import { vars } from "@/styles/theme.css";

export const stage = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  gap: `${vars.spacing.lg} 2.75rem`,
});

// The console's xray colours (app/components/misc/fake-console), as swatches.
export const swatches = {
  window: style([swatch, { boxShadow: `inset 0 0 0 1px ${vars.colors.primary}` }]),
  pending: style([
    swatch,
    { backgroundColor: `color-mix(in srgb, ${vars.colors.primary} 40%, transparent)` },
  ]),
  field: style([swatch, { backgroundColor: vars.colors.secondary }]),
};
