import { Button } from "react-aria-components";
import { type Bay, BAY_COUNT, OPERATORS } from "../../../../data/not-found-puzzle";
import type { BayLed, GamePhase } from "../../../../hooks/use-not-found-game.hook";
import * as styles from "./not-found-game-server.css";

export interface NotFoundGameServerProps {
  numbers: readonly number[];
  bays: readonly Bay[];
  leds: readonly BayLed[];
  /** The accumulator's display: live while building, the printed total during a run. */
  acc: number | null;
  /** The live total after each number bay (`null` elsewhere). */
  totals: readonly (number | null)[];
  /** The bays already make 404. */
  isReady: boolean;
  /** A division in the bays does not fall exact. */
  liveFault: boolean;
  phase: GamePhase;
  /** Runs so far on this draw. */
  tries: number;
  onEject: (bay: number) => void;
  onPower: () => void;
}

const operatorOf = (id: string) => OPERATORS.find((op) => op.id === id) ?? OPERATORS[0];
// What a scored bay adds to its name, for the ear.
const SCORE_WORDS: Partial<Record<BayLed, string>> = {
  right: ", right bay",
  won: ", right bay",
  elsewhere: ", in the solution but another bay",
  absent: ", not in the solution",
};
const U_LABELS = Array.from({ length: BAY_COUNT }, (_, bay) => `U${bay + 1}`);

function display(acc: number | null, fault = false) {
  if (fault) return " Err";
  if (acc === null) return "----";
  const digits = String(Math.abs(acc)).padStart(acc < 0 ? 3 : 4, "0");
  return (acc < 0 ? `-${digits}` : digits).slice(-4);
}

/**
 * RACK 404: a black server in CSS perspective, nine cartridge bays read from U1 to U9, its
 * accumulator, its status LEDs and the power button. A plugged cartridge ejects on press.
 */
export function NotFoundGameServer({
  numbers,
  bays,
  leds,
  acc,
  totals,
  isReady,
  liveFault,
  phase,
  tries,
  onEject,
  onPower,
}: NotFoundGameServerProps) {
  const isOn = phase !== "idle";

  return (
    <div className={styles.stageStyle}>
      <div className={styles.bodyStyle}>
        <div className={styles.lidStyle} aria-hidden="true">
          <span className={styles.engravingStyle}>RACK 404</span>
        </div>

        <div className={styles.chassisStyle}>
          <div className={styles.baysStyle}>
            {bays.map((bay, index) => {
              const u = U_LABELS[index];
              if (bay === null) {
                return (
                  <span key={u} className={styles.emptyBayStyle} aria-hidden="true">
                    <span className={styles.emptyLabelStyle}>
                      {index % 2 === 0 ? "NUMBER" : "OPERATOR"}
                    </span>
                  </span>
                );
              }
              const operator = bay.kind === "operator" ? operatorOf(bay.operator) : null;
              const value = bay.kind === "number" ? String(numbers[bay.index]) : "";
              return (
                <Button
                  key={u}
                  className={styles.cartridgeStyle}
                  data-kind={bay.kind}
                  data-led={leds[index]}
                  aria-label={`Eject ${operator ? operator.label : value} from ${u}${SCORE_WORDS[leds[index]] ?? ""}`}
                  isDisabled={phase === "running"}
                  onPress={() => onEject(index)}
                >
                  <span className={styles.ledStyle} data-led={leds[index]} aria-hidden="true" />
                  {operator ? (
                    <span className={styles.symbolStyle} aria-hidden="true">
                      {operator.symbol}
                    </span>
                  ) : (
                    <span className={styles.windowStyle} aria-hidden="true">
                      <span className={styles.numberStyle}>{value}</span>
                    </span>
                  )}
                  <span className={styles.handleStyle} aria-hidden="true" />
                </Button>
              );
            })}
          </div>

          {/* The rack's tape: the total so far under each number, as it is plugged. */}
          <div className={styles.totalsStyle} aria-hidden="true">
            {U_LABELS.map((u, index) => (
              <span key={u} className={styles.totalStyle}>
                {totals[index] ?? ""}
              </span>
            ))}
          </div>

          <div className={styles.labelsStyle} aria-hidden="true">
            {U_LABELS.map((u) => (
              <span key={u} className={styles.labelStyle}>
                {u}
              </span>
            ))}
          </div>

          <div className={styles.controlStyle}>
            <div className={styles.accStyle} aria-hidden="true">
              <span className={styles.silkStyle}>ACC</span>
              <span className={styles.lcdStyle}>
                <span
                  className={styles.accValueStyle}
                  data-phase={phase}
                  data-ready={isReady || undefined}
                  data-fault={(phase !== "running" && liveFault) || undefined}
                >
                  {display(acc, phase !== "running" && liveFault)}
                </span>
              </span>
            </div>
            <div className={styles.statusStyle} aria-hidden="true">
              <span className={styles.statusItemStyle}>
                <span className={styles.statusLedStyle} data-lit={isOn ? "pwr" : undefined} />
                PWR
              </span>
              <span className={styles.statusItemStyle}>
                <span
                  className={styles.statusLedStyle}
                  data-lit={phase === "failed" ? "err" : undefined}
                />
                ERR
              </span>
            </div>
            <span className={styles.nameStyle} aria-hidden="true">
              {tries > 0 ? `TRY ${String(tries).padStart(2, "0")}` : "RACK 404"}
            </span>
            <Button
              className={styles.powerStyle}
              data-phase={phase}
              data-ready={isReady || undefined}
              aria-label="Power on"
              onPress={onPower}
            >
              <svg
                className={styles.powerIconStyle}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M12 3v8" />
                <path d="M6.34 6.84a8 8 0 1 0 11.32 0" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
