import { useState } from "react";
import { MeshBackgroundCanvas } from "@/components/misc/mesh-background/mesh-background-canvas.component";
import { SHADER_CONFIG } from "@/components/misc/shaders/mesh-background/mesh-background.shader";
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

const DEFAULT_QUALITY = SHADER_CONFIG.defaultQuality;

export function MeshBackgroundDemo() {
  const [quality, setQuality] = useState<number>(DEFAULT_QUALITY);
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
              max={1}
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
