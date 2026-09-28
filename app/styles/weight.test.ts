import { globSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { weight } from "./weight";

describe("weight", () => {
  it("sets the weight, and pins the axis in WebKit only", () => {
    expect(weight(700)).toEqual({
      fontWeight: 700,
      "@supports": { "(font: -apple-system-body)": { fontVariationSettings: '"wght" 700' } },
    });
  });

  // The axis setting inherits: one weight set without it hands a child its parent's axis.
  it("is the only way the stylesheets set a weight", () => {
    const raw = globSync("app/**/*.css.ts")
      .filter(
        (file) => !file.endsWith("styles/theme.css.ts") && !file.endsWith("styles/fonts.css.ts"),
      )
      .filter((file) => /\bfontWeight\s*:/.test(readFileSync(file, "utf-8")));
    expect(raw).toEqual([]);
  });
});
