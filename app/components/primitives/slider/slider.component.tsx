import {
  Slider as AriaSlider,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
  Label,
} from "react-aria-components";
import { sliderRecipe, sliderThumbStyle, sliderTrackStyle } from "./slider.css";

export interface SliderProps {
  label?: string;
  value?: number;
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  orientation?: "horizontal" | "vertical";
  formatOptions?: Intl.NumberFormatOptions;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  defaultValue,
  minValue = 0,
  maxValue = 100,
  step = 1,
  isDisabled = false,
  orientation = "horizontal",
  formatOptions,
  onChange,
  onChangeEnd,
  className,
  ...props
}) => {
  return (
    <AriaSlider
      value={value}
      defaultValue={defaultValue}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      isDisabled={isDisabled}
      orientation={orientation}
      formatOptions={formatOptions}
      onChange={onChange}
      onChangeEnd={onChangeEnd}
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
};
