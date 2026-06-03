import { useState } from "react";
import { ServerUnitRack } from "@/components/misc/server-unit/server-unit.component";
import { LabsDemoLayout } from "../../components/labs-experiment-frame/labs-experiment-frame.component";
import {
  ButtonGroupControl,
  ControlGroup,
  ControlPanel,
  ResetButton,
  SliderControl,
} from "../../components/labs-control/labs-control.component";
import * as styles from "./server-unit-3d.demo.css";

type ServerUnitSize = "xs" | "sm" | "md" | "lg";

const SIZE_OPTIONS: readonly ServerUnitSize[] = ["xs", "sm", "md", "lg"];
const DEFAULT_ROTATE = { x: 4, y: -24, z: 0 };

export function ServerUnit3dDemo() {
  const [rotate, setRotate] = useState(DEFAULT_ROTATE);
  const [scale, setScale] = useState(1);
  const [seed, setSeed] = useState(42);
  const [size, setSize] = useState<ServerUnitSize>("md");

  const reset = () => {
    setRotate(DEFAULT_ROTATE);
    setScale(1);
    setSeed(42);
    setSize("md");
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
            <ServerUnitRack seed={seed} size={size} />
          </div>
        </div>
      }
      controls={
        <ControlPanel>
          <ControlGroup title="Size">
            <ButtonGroupControl
              options={SIZE_OPTIONS}
              value={size}
              onChange={setSize}
              formatOption={(option) => option.toUpperCase()}
            />
          </ControlGroup>

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

          <ControlGroup title="LEDs">
            <SliderControl
              label="Seed"
              value={seed}
              min={0}
              max={100}
              onChange={setSeed}
              format={(value) => `#${value}`}
            />
          </ControlGroup>

          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
