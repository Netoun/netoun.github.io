import { Button, Toolbar } from "react-aria-components";
import { type Feedback, OPERATORS, type OperatorId } from "../../../../data/not-found-puzzle";
import * as styles from "./not-found-game-spares.css";

export interface NotFoundGameSparesProps {
  numbers: readonly number[];
  /** For each number, the bay it sits in, or -1. */
  placedAt: readonly number[];
  /** What the runs so far say about each spare, like Tusmo's keyboard. */
  numberKnowledge: readonly (Feedback | null)[];
  operatorKnowledge: (id: OperatorId) => Feedback | null;
  /** Plugs left for an operator (three of one at most in the bays). */
  operatorsLeft: (id: OperatorId) => number;
  numbersFull: boolean;
  operatorsFull: boolean;
  /** Draws this visit, from 1. */
  draw: number;
  isBusy: boolean;
  onPlugNumber: (index: number) => void;
  onPlugOperator: (operator: OperatorId) => void;
  onEjectAll: () => void;
  onReroll: () => void;
}

const KNOWN_WORDS: Record<Feedback | "none", string> = {
  none: "",
  right: ", right bay found",
  elsewhere: ", in the solution",
  absent: ", not in the solution",
};

/**
 * The spares, drawn on a drafting sheet: five numbers (each plugs once) and the four
 * operators (as often as needed). A number already in the server stays drawn in phantom
 * lines, with its bay. The title block holds the draw and the sheet's two tools.
 */
export function NotFoundGameSpares({
  numbers,
  placedAt,
  numberKnowledge,
  operatorKnowledge,
  operatorsLeft,
  numbersFull,
  operatorsFull,
  draw,
  isBusy,
  onPlugNumber,
  onPlugOperator,
  onEjectAll,
  onReroll,
}: NotFoundGameSparesProps) {
  return (
    <div className={styles.sheetStyle}>
      <Toolbar className={styles.partsStyle} aria-label="Spares">
        <div className={styles.rowStyle} data-row="numbers">
          {numbers.map((value, index) => {
            const bay = placedAt[index];
            if (bay >= 0) {
              return (
                <span key={value} className={styles.placedStyle} aria-hidden="true">
                  {value}
                  <span className={styles.placedBayStyle}>→ U{bay + 1}</span>
                </span>
              );
            }
            return (
              <Button
                key={value}
                className={styles.partStyle}
                data-known={numberKnowledge[index] ?? undefined}
                aria-label={`Plug ${value}${KNOWN_WORDS[numberKnowledge[index] ?? "none"]}`}
                isDisabled={numbersFull || isBusy}
                onPress={() => onPlugNumber(index)}
              >
                <span className={styles.axisStyle} aria-hidden="true" />
                <span className={styles.ledStyle} aria-hidden="true" />
                <span className={styles.valueStyle} aria-hidden="true">
                  {value}
                </span>
                <span className={styles.handleStyle} aria-hidden="true" />
              </Button>
            );
          })}
        </div>
        <div className={styles.rowStyle} data-row="operators">
          {OPERATORS.map((op) => (
            <Button
              key={op.id}
              className={styles.partStyle}
              data-known={operatorKnowledge(op.id) ?? undefined}
              aria-label={`Plug ${op.label}${KNOWN_WORDS[operatorKnowledge(op.id) ?? "none"]}`}
              isDisabled={operatorsFull || operatorsLeft(op.id) === 0 || isBusy}
              onPress={() => onPlugOperator(op.id)}
            >
              <span className={styles.axisStyle} aria-hidden="true" />
              <span className={styles.quantityStyle} aria-hidden="true">
                ×{operatorsLeft(op.id)}
              </span>
              <span className={styles.ledStyle} aria-hidden="true" />
              <span className={styles.operatorStyle} aria-hidden="true">
                <span className={styles.symbolStyle}>{op.symbol}</span>
                <span className={styles.mnemonicStyle}>{op.mnemonic}</span>
              </span>
              <span className={styles.handleStyle} aria-hidden="true" />
            </Button>
          ))}
        </div>
      </Toolbar>

      <div className={styles.titleBlockStyle}>
        <span className={styles.cellStyle}>PRESS TO PLUG</span>
        <span className={styles.cellStyle}>DRAW {String(draw).padStart(2, "0")}</span>
        <Button
          className={styles.toolStyle}
          aria-label="Eject all"
          isDisabled={isBusy}
          onPress={onEjectAll}
        >
          <svg
            className={styles.toolIconStyle}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M5 14 12 6l7 8Z" />
            <path d="M5 19h14" />
          </svg>
        </Button>
        <Button className={styles.toolStyle} aria-label="New numbers" onPress={onReroll}>
          <svg
            className={styles.toolIconStyle}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M20 12a8 8 0 1 1-2.34-5.66" />
            <path d="M20 4v5h-5" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
