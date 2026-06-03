import clsx from "clsx";
import type { ReactNode } from "react";
import { Button } from "@/components/primitives/button/button.component";
import { Slider } from "@/components/primitives/slider/slider.component";
import * as styles from "./labs-control.css";

/** Vertical stack wrapping a set of control groups. */
export function ControlPanel({ children }: { children: ReactNode }) {
  return <div className={styles.controlPanel}>{children}</div>;
}

/** A titled group of related controls. */
export function ControlGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.controlGroup}>
      <h3 className={styles.controlGroupTitle}>{title}</h3>
      {children}
    </div>
  );
}

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
}

/** Labelled slider row with a formatted value readout. */
export function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
}: SliderControlProps) {
  return (
    <div className={styles.controlRow}>
      <span className={styles.controlLabel}>{label}</span>
      <Slider
        aria-label={label}
        className={styles.controlSlider}
        minValue={min}
        maxValue={max}
        step={step}
        value={value}
        onChange={onChange}
      />
      <span className={styles.controlValue}>{format ? format(value) : value}</span>
    </div>
  );
}

interface ButtonGroupControlProps<T extends string> {
  label?: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  formatOption?: (value: T) => string;
}

/** Full-width reset button, styled for the controls panel. */
export function ResetButton({ onReset, label = "Reset" }: { onReset: () => void; label?: string }) {
  return (
    <Button onPress={onReset} className={styles.resetButton}>
      {label}
    </Button>
  );
}

/** Segmented button group for picking one option among a small set. */
export function ButtonGroupControl<T extends string>({
  label,
  options,
  value,
  onChange,
  formatOption,
}: ButtonGroupControlProps<T>) {
  return (
    <div className={styles.controlRow}>
      {label && <span className={styles.controlLabel}>{label}</span>}
      <div className={clsx(styles.buttonRow, styles.controlSlider)}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={styles.optionButton}
            data-active={value === option}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {formatOption ? formatOption(option) : option}
          </button>
        ))}
      </div>
    </div>
  );
}
