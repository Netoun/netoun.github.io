import { useState } from "react";
import { SystemMetricsPanel } from "@/components/misc/system-metrics-panel/system-metrics-panel.component";
import { LabsDemoLayout } from "../../components/labs-experiment-frame/labs-experiment-frame.component";
import {
  ButtonGroupControl,
  ControlGroup,
  ControlPanel,
  ResetButton,
} from "../../components/labs-control/labs-control.component";
import { LabsScreen } from "../../components/labs-screen/labs-screen.component";

const STATES = ["paused", "running"] as const;
type PlayState = (typeof STATES)[number];

export function SystemMetricsDemo() {
  const [state, setState] = useState<PlayState>("running");

  return (
    <LabsDemoLayout
      stage={
        <LabsScreen>
          <SystemMetricsPanel isAnimating={state === "running"} />
        </LabsScreen>
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
          <ResetButton onReset={() => setState("running")} />
        </ControlPanel>
      }
    />
  );
}
