import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Glyph } from "./glyph.component";

describe("Glyph", () => {
  it("keeps the terminal glyphs out of the accessible name", () => {
    render(
      <h2>
        <Glyph>_❯</Glyph>
        Projects
        <Glyph>▐</Glyph>
      </h2>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveAccessibleName("Projects");
  });

  it("still paints the glyph", () => {
    render(<Glyph className="prompt">⤘</Glyph>);
    const glyph = screen.getByText("⤘");
    expect(glyph).toHaveAttribute("aria-hidden", "true");
    expect(glyph).toHaveClass("prompt");
  });
});
