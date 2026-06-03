import { useState } from "react";
import { GrainCanvas } from "@/components/misc/grain-canvas/grain-canvas.component";
import { LabsDemoLayout } from "../../components/labs-experiment-frame/labs-experiment-frame.component";
import {
  ControlGroup,
  ControlPanel,
  ResetButton,
  SliderControl,
} from "../../components/labs-control/labs-control.component";
import * as styles from "./grain-shader.demo.css";

const DEFAULT_GRAIN = 0.18;
const DEFAULT_BASE = 0.04;

export function GrainShaderDemo() {
  const [grainAlpha, setGrainAlpha] = useState(DEFAULT_GRAIN);
  const [baseAlpha, setBaseAlpha] = useState(DEFAULT_BASE);

  const reset = () => {
    setGrainAlpha(DEFAULT_GRAIN);
    setBaseAlpha(DEFAULT_BASE);
  };

  return (
    <LabsDemoLayout
      stage={
        <div className={styles.stageInner}>
          <div className={styles.grainBox}>
            <GrainCanvas grainAlpha={grainAlpha} baseAlpha={baseAlpha} />
          </div>
        </div>
      }
      controls={
        <ControlPanel>
          <ControlGroup title="Grain">
            <SliderControl
              label="Grain"
              value={grainAlpha}
              min={0}
              max={0.4}
              step={0.005}
              onChange={setGrainAlpha}
              format={(value) => value.toFixed(3)}
            />
            <SliderControl
              label="Base"
              value={baseAlpha}
              min={0}
              max={0.15}
              step={0.005}
              onChange={setBaseAlpha}
              format={(value) => value.toFixed(3)}
            />
          </ControlGroup>

          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
