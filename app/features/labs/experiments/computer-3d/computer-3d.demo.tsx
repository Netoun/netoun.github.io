import { useState } from "react";
import { Computer } from "@/components/misc/computer/computer.component";
import { LabsDemoLayout } from "../../components/labs-experiment-frame/labs-experiment-frame.component";
import {
  ControlGroup,
  ControlPanel,
  ResetButton,
  SliderControl,
} from "../../components/labs-control/labs-control.component";
import * as styles from "./computer-3d.demo.css";

const DEFAULT_ROTATE = { x: 0, y: 0, z: 0 };
const DEFAULT_SCALE = 1;

export function Computer3dDemo() {
  const [rotate, setRotate] = useState(DEFAULT_ROTATE);
  const [scale, setScale] = useState(DEFAULT_SCALE);

  const reset = () => {
    setRotate(DEFAULT_ROTATE);
    setScale(DEFAULT_SCALE);
  };

  return (
    <LabsDemoLayout
      stage={
        <div className={styles.stageInner} style={{ transform: `scale(${scale})` }}>
          <div
            className={styles.wrapper3d}
            style={{
              transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) rotateZ(${rotate.z}deg)`,
            }}
          >
            <Computer />
          </div>
        </div>
      }
      controls={
        <ControlPanel>
          <ControlGroup title="Rotation">
            <SliderControl
              label="X"
              value={rotate.x}
              min={-180}
              max={180}
              onChange={(value) => setRotate((prev) => ({ ...prev, x: value }))}
              format={(value) => `${value}°`}
            />
            <SliderControl
              label="Y"
              value={rotate.y}
              min={-180}
              max={180}
              onChange={(value) => setRotate((prev) => ({ ...prev, y: value }))}
              format={(value) => `${value}°`}
            />
            <SliderControl
              label="Z"
              value={rotate.z}
              min={-180}
              max={180}
              onChange={(value) => setRotate((prev) => ({ ...prev, z: value }))}
              format={(value) => `${value}°`}
            />
          </ControlGroup>

          <ControlGroup title="Scale">
            <SliderControl
              label="Zoom"
              value={scale}
              min={0.1}
              max={3}
              step={0.1}
              onChange={setScale}
              format={(value) => `${value.toFixed(2)}x`}
            />
          </ControlGroup>

          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
