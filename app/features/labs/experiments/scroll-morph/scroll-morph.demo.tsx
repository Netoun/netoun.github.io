import { useState } from "react";
import { LabsDemoLayout } from "../../components/labs-experiment-frame/labs-experiment-frame.component";
import {
  ControlGroup,
  ControlPanel,
  ResetButton,
  SliderControl,
} from "../../components/labs-control/labs-control.component";
import * as styles from "./scroll-morph.demo.css";

// Same easing the hero uses to map scroll progress (0..1) onto the morph.
const easeInOutQuad = (t: number): number => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

const MIN_SCALE = 0.62;
const MAX_TRANSLATE_PX = 80;

export function ScrollMorphDemo() {
  const [percent, setPercent] = useState(0);

  const progress = percent / 100;
  const eased = easeInOutQuad(progress);
  const scale = 1 - eased * (1 - MIN_SCALE);
  const translateY = eased * MAX_TRANSLATE_PX;

  return (
    <LabsDemoLayout
      stage={
        <div className={styles.stageInner}>
          <div
            className={styles.morphCard}
            style={{ transform: `translateY(${translateY}px) scale(${scale})` }}
          >
            {percent}%
          </div>
        </div>
      }
      controls={
        <ControlPanel>
          <ControlGroup title="Scroll progress">
            <SliderControl
              label="Progress"
              value={percent}
              min={0}
              max={100}
              step={1}
              onChange={setPercent}
              format={(value) => `${value}%`}
            />
          </ControlGroup>

          <ResetButton onReset={() => setPercent(0)} />
        </ControlPanel>
      }
    />
  );
}
