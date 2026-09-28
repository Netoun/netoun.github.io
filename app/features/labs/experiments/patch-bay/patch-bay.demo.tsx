import { useMemo, useState } from "react";
import {
  LabsDemoLayout,
  useLabsXray,
} from "../../components/labs-experiment-frame/labs-experiment-frame.component";
import {
  ControlButton,
  ControlGroup,
  ControlPanel,
  ResetButton,
  SliderControl,
} from "../../components/labs-control/labs-control.component";
import { DEFAULT_SOLVER, PatchBay } from "./patch-bay.component";
import * as styles from "./patch-bay.demo.css";

export function PatchBayDemo() {
  const xray = useLabsXray();
  const [gravity, setGravity] = useState(DEFAULT_SOLVER.gravity);
  const [damping, setDamping] = useState(DEFAULT_SOLVER.damping);
  const [slack, setSlack] = useState(DEFAULT_SOLVER.slack);
  const [passes, setPasses] = useState(DEFAULT_SOLVER.passes);
  const [shakeToken, setShakeToken] = useState(0);
  const [resetToken, setResetToken] = useState(0);
  const params = useMemo(
    () => ({ gravity, damping, slack, passes }),
    [gravity, damping, slack, passes],
  );

  const reset = () => {
    setGravity(DEFAULT_SOLVER.gravity);
    setDamping(DEFAULT_SOLVER.damping);
    setSlack(DEFAULT_SOLVER.slack);
    setPasses(DEFAULT_SOLVER.passes);
    setResetToken((token) => token + 1);
  };

  return (
    <LabsDemoLayout
      mounted={`<PatchBay params={{ gravity: ${gravity.toFixed(1)}, damping: ${damping.toFixed(3)}, slack: ${slack}, passes: ${passes} }} />`}
      stage={
        <div className={styles.stage}>
          <PatchBay params={params} xray={xray} shakeToken={shakeToken} resetToken={resetToken} />
          <p className={styles.hint}>Drag a plug · focus it, arrows move it, space unplugs it</p>
        </div>
      }
      controls={
        <ControlPanel>
          <ControlGroup title="World">
            <SliderControl
              label="Gravity"
              value={gravity}
              min={0}
              max={2}
              step={0.1}
              onChange={setGravity}
              format={(value) => `${value.toFixed(1)} g`}
            />
            <SliderControl
              label="Damping"
              value={damping}
              min={0.9}
              max={0.999}
              step={0.001}
              onChange={setDamping}
              format={(value) => value.toFixed(3)}
            />
          </ControlGroup>
          <ControlGroup title="Cable">
            <SliderControl
              label="Slack"
              value={slack}
              min={10}
              max={100}
              step={5}
              onChange={setSlack}
              format={(value) => `${value} %`}
            />
            <SliderControl
              label="Passes"
              value={passes}
              min={1}
              max={24}
              onChange={setPasses}
              format={(value) => String(value).padStart(2, "0")}
            />
          </ControlGroup>
          <ControlButton onPress={() => setShakeToken((token) => token + 1)}>Shake</ControlButton>
          <ResetButton onReset={reset} />
        </ControlPanel>
      }
    />
  );
}
