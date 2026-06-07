import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Slider } from "./slider.component";

describe("Slider", () => {
  it("renders", () => {
    render(<Slider label="Test Slider" />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });
});
