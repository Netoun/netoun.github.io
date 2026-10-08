import clsx from "clsx";
import type { ReactNode } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-aria-components";
import { Button } from "@/components/primitives/button/button.component";
import { Slider } from "@/components/primitives/slider/slider.component";
import * as styles from "./labs-control.css";

interface ControlPanelProps {
  children: ReactNode;
}

/** Vertical stack wrapping a set of control groups. */
export function ControlPanel({ children }: ControlPanelProps) {
  return <div className={styles.controlPanel}>{children}</div>;
}

interface ControlGroupProps {
  title: string;
  children: ReactNode;
}

/** A titled group of related controls. */
export function ControlGroup({ title, children }: ControlGroupProps) {
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

interface ControlButtonProps {
  onPress: () => void;
  isDisabled?: boolean;
  children: string;
}

/** A full-width action of the controls panel (step, reseed…). */
export function ControlButton({ onPress, isDisabled, children }: ControlButtonProps) {
  return (
    <Button onPress={onPress} isDisabled={isDisabled} className={styles.resetButton}>
      {children}
    </Button>
  );
}

interface ControlReadoutProps {
  children: string;
}

/** A value printed on the panel's LCD, e.g. a seed. */
export function ControlReadout({ children }: ControlReadoutProps) {
  return <span className={styles.controlValue}>{children}</span>;
}

interface ResetButtonProps {
  onReset: () => void;
  label?: string;
}

/** Full-width reset button, styled for the controls panel. */
export function ResetButton({ onReset, label = "Reset" }: ResetButtonProps) {
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
      <ToggleButtonGroup
        aria-label={label ?? "Options"}
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[value]}
        onSelectionChange={(keys) => {
          const next = options.find((option) => keys.has(option));
          if (next !== undefined) onChange(next);
        }}
        className={clsx(styles.buttonRow, styles.controlSlider)}
      >
        {options.map((option) => (
          <ToggleButton key={option} id={option} className={styles.optionButton}>
            {formatOption ? formatOption(option) : option}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
