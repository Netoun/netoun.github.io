import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderControl } from "../../__test-utils__/labs-test-helpers";
import {
  SliderControl,
  ButtonGroupControl,
  ResetButton,
} from "../../components/labs-control/labs-control.component";

describe("SliderControl", () => {
  it("renders label and formatted value", () => {
    const onChange = vi.fn();
    renderControl(
      <SliderControl
        label="Grain"
        value={0.18}
        min={0}
        max={0.4}
        step={0.005}
        onChange={onChange}
        format={(v) => v.toFixed(3)}
      />,
    );

    expect(screen.getByText("Grain")).toBeInTheDocument();
    expect(screen.getByText("0.180")).toBeInTheDocument();
  });

  it("propagates slider change", () => {
    const onChange = vi.fn();
    renderControl(<SliderControl label="Speed" value={50} min={0} max={100} onChange={onChange} />);

    const slider = screen.getByRole("slider");

    // Simulate value change — React Aria Slider exposes value via onChange
    fireEvent.change(slider, { target: { value: "75" } });
    expect(onChange).toHaveBeenCalled();
  });
});

describe("ButtonGroupControl", () => {
  it("renders all options with active state", () => {
    const onChange = vi.fn();
    renderControl(
      <ButtonGroupControl options={["paused", "running"]} value="running" onChange={onChange} />,
    );

    const pausedBtn = screen.getByRole("button", { name: "paused" });
    const runningBtn = screen.getByRole("button", { name: "running" });

    expect(pausedBtn).toHaveAttribute("aria-pressed", "false");
    expect(runningBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("fires onChange on click", () => {
    const onChange = vi.fn();
    renderControl(
      <ButtonGroupControl options={["left", "right"]} value="left" onChange={onChange} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "right" }));
    expect(onChange).toHaveBeenCalledWith("right");
  });

  it("renders formatted option labels", () => {
    const onChange = vi.fn();
    renderControl(
      <ButtonGroupControl
        options={["a", "b"]}
        value="a"
        onChange={onChange}
        formatOption={(v) => v.toUpperCase()}
      />,
    );

    expect(screen.getByRole("button", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "B" })).toBeInTheDocument();
  });
});

describe("ResetButton", () => {
  it("fires onReset on click", () => {
    const onReset = vi.fn();
    renderControl(<ResetButton onReset={onReset} />);

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it("renders custom label", () => {
    renderControl(<ResetButton onReset={vi.fn()} label="Restore Defaults" />);

    expect(screen.getByRole("button", { name: "Restore Defaults" })).toBeInTheDocument();
  });
});
