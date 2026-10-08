import { describe, expect, it } from "vitest";
import {
  formatCtaSpec,
  formatHeadingSpec,
  formatLaptopTilt,
  formatLeadSpec,
} from "./use-welcome-hero-spec.hook";

// Computed styles as the browser reports them for the hero at 1440px.
const style = (overrides: Partial<CSSStyleDeclaration>) =>
  ({
    borderTopLeftRadius: "0px",
    fontFamily: "PPNeueMontreal, system-ui, sans-serif",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "400",
    letterSpacing: "normal",
    lineHeight: "normal",
    maxWidth: "none",
    textTransform: "none",
    ...overrides,
  }) as CSSStyleDeclaration;

describe("formatHeadingSpec", () => {
  it("prints size, leading and tracking relative to the font size", () => {
    expect(
      formatHeadingSpec(
        style({
          fontSize: "96px",
          fontStyle: "italic",
          fontWeight: "700",
          lineHeight: "76.8px",
          letterSpacing: "-4.32px",
          maxWidth: "1056px",
        }),
      ),
    ).toEqual([
      "H1 · DISPLAY",
      "PPNeueMontreal Italic 700",
      "96 / 0.8 · −0.045em",
      "max 11em · breaks on &",
    ]);
  });

  it("drops the measure line when there is no max width", () => {
    expect(formatHeadingSpec(style({ lineHeight: "16px" }))).toHaveLength(3);
  });
});

describe("formatLeadSpec", () => {
  it("prints the measure in rem and the leading as a ratio", () => {
    expect(
      formatLeadSpec(style({ fontSize: "24px", lineHeight: "33px", maxWidth: "640px" }), 16),
    ).toEqual(["40rem · 24 / 1.375"]);
  });

  it("drops the measure when there is no max width", () => {
    expect(formatLeadSpec(style({ fontSize: "24px", lineHeight: "33px" }), 16)).toEqual([
      "24 / 1.375",
    ]);
  });
});

describe("formatCtaSpec", () => {
  it("names the first font family only", () => {
    expect(
      formatCtaSpec(
        style({
          fontFamily: '"Doto", system-ui, sans-serif',
          fontSize: "24px",
          fontWeight: "900",
          textTransform: "uppercase",
          borderTopLeftRadius: "24px",
        }),
      ),
    ).toEqual(["CTA · MACHINE VOICE", "Doto 900 · 24 · uppercase", "radius 24 · glowPrimary"]);
  });
});

describe("formatLaptopTilt", () => {
  it("rounds to a tenth of a degree with a true minus sign", () => {
    expect(formatLaptopTilt(5.4, -5.4)).toBe("rotateY 5.4° · rotateX −5.4°");
    expect(formatLaptopTilt(0.04, -0.04)).toBe("rotateY 0° · rotateX 0°");
  });
});
