import {
  Slider as AriaSlider,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
  Label,
  type SliderProps as AriaSliderProps,
} from "react-aria-components";
import { sliderRecipe, sliderThumbStyle, sliderTrackStyle } from "./slider.css";

export interface SliderProps extends Omit<
  AriaSliderProps<number>,
  "children" | "className" | "style"
> {
  label?: string;
  className?: string;
}

export function Slider({
  label,
  minValue = 0,
  maxValue = 100,
  step = 1,
  isDisabled = false,
  orientation = "horizontal",
  className,
  ...props
}: SliderProps) {
  return (
    <AriaSlider
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      isDisabled={isDisabled}
      orientation={orientation}
      className={
        sliderRecipe({ orientation, disabled: isDisabled }) + (className ? ` ${className}` : "")
      }
      {...props}
    >
      {label && <Label>{label}</Label>}
      <AriaSliderTrack className={sliderTrackStyle}>
        <AriaSliderThumb className={sliderThumbStyle} />
      </AriaSliderTrack>
    </AriaSlider>
  );
}
