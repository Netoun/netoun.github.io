import { useState } from "react";
import { Kirby } from "@/components/misc/kirby/kirby.component";
import { LabsDemoLayout } from "../../components/labs-experiment-frame/labs-experiment-frame.component";
import {
  ControlGroup,
  ControlPanel,
  ResetButton,
  SliderControl,
} from "../../components/labs-control/labs-control.component";
import * as styles from "./kirby.demo.css";

const DEFAULT_SCALE = 1;
const DEFAULT_ROTATION = 0;

export function KirbyDemo() {
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [rotation, setRotation] = useState(DEFAULT_ROTATION);

  const reset = () => {
    setScale(DEFAULT_SCALE);
    setRotation(DEFAULT_ROTATION);
  };

  return (
    <LabsDemoLayout
      stage={
        <div className={styles.stageInner}>
          <div
            className={styles.kirbyWrapper}
            style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
          >
            <Kirby />
          </div>
        </div>
      }
      controls={
        <ControlPanel>
          <ControlGroup title="Scale">
            <SliderControl
              label="Size"
              value={scale}
              min={0.5}
              max={4}
              step={0.1}
              onChange={setScale}
              format={(v) => `${v.toFixed(1)}x`}
            />
          </ControlGroup>

          <ControlGroup title="Rotation">
            <SliderControl
              label="Angle"
              value={rotation}
              min={-180}
              max={180}
              onChange={setRotation}
              format={(v) => `${v}°`}
            />
          </ControlGroup>

          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
