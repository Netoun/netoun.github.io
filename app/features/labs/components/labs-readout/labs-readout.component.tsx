import type { ReactNode } from "react";
import * as styles from "./labs-readout.css";

/** An xray readout beside an ink stage: `_xray / title`, then its lines. */
export function LabsReadout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.readout}>
      <p className={styles.kicker}>_xray / {title}</p>
      {children}
    </div>
  );
}

/** The one big number (a tick, a line count). */
export function ReadoutFigure({ children }: { children: ReactNode }) {
  return <p className={styles.figure}>{children}</p>;
}

/** A dim machine line, or a gold formula. */
export function ReadoutLine({ children, code = false }: { children: ReactNode; code?: boolean }) {
  return code ? (
    <p className={styles.code}>
      <code>{children}</code>
    </p>
  ) : (
    <p className={styles.line}>{children}</p>
  );
}

export function ReadoutRows({ children }: { children: ReactNode }) {
  return <ul className={styles.rows}>{children}</ul>;
}

interface ReadoutRowProps {
  label: string;
  value?: ReactNode;
  /** The rule behind the value, in code. */
  rule?: string;
  /** Its swatch, styled by the caller (the colour of what it counts on the stage). */
  swatchClassName?: string;
}

export function ReadoutRow({ label, value, rule, swatchClassName }: ReadoutRowProps) {
  return (
    <li className={styles.row}>
      <span className={swatchClassName ?? styles.swatch} aria-hidden="true" />
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
      {rule && <code className={styles.rowRule}>{rule}</code>}
    </li>
  );
}

/** A block under a rule (an atlas, a table). */
export function ReadoutSection({ children }: { children: ReactNode }) {
  return <div className={styles.section}>{children}</div>;
}
