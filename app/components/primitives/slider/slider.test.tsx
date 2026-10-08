import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Slider } from "./slider.component";

describe("Slider", () => {
  it("names the slider from its label and applies the range defaults", () => {
    render(<Slider label="Test Slider" defaultValue={30} />);
    const slider = screen.getByRole("slider", { name: "Test Slider" });
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "100");
    expect(slider).toHaveValue("30");
  });

  it("disables the thumb when isDisabled is set", () => {
    render(<Slider label="Test Slider" isDisabled />);
    expect(screen.getByRole("slider", { name: "Test Slider" })).toBeDisabled();
  });
});
