import { useState } from "react";
import { MeshBackgroundCanvas } from "@/components/misc/mesh-background/mesh-background-canvas.component";
import { LabsDemoLayout } from "../../components/labs-experiment-frame/labs-experiment-frame.component";
import {
  ButtonGroupControl,
  ControlGroup,
  ControlPanel,
  ResetButton,
  SliderControl,
} from "../../components/labs-control/labs-control.component";
import * as styles from "./mesh-background.demo.css";

const STATES = ["paused", "running"] as const;
type PlayState = (typeof STATES)[number];

const DEFAULT_QUALITY = 0.45;

export function MeshBackgroundDemo() {
  const [quality, setQuality] = useState(DEFAULT_QUALITY);
  const [state, setState] = useState<PlayState>("running");

  const reset = () => {
    setQuality(DEFAULT_QUALITY);
    setState("running");
  };

  return (
    <LabsDemoLayout
      stage={
        <div className={styles.stageInner}>
          <div className={styles.meshBox}>
            <MeshBackgroundCanvas quality={quality} animate={state === "running"} />
          </div>
        </div>
      }
      controls={
        <ControlPanel>
          <ControlGroup title="Animation">
            <ButtonGroupControl
              options={STATES}
              value={state}
              onChange={setState}
              formatOption={(option) => option[0].toUpperCase() + option.slice(1)}
            />
          </ControlGroup>

          <ControlGroup title="Film grain">
            <SliderControl
              label="Quality"
              value={quality}
              min={0}
              max={0.75}
              step={0.05}
              onChange={setQuality}
              format={(value) => value.toFixed(2)}
            />
          </ControlGroup>

          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
