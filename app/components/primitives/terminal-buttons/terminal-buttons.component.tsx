import * as styles from "./terminal-buttons.css";

export function TerminalButtons() {
  return (
    <div className={styles.container}>
      <span className={styles.red} />
      <span className={styles.yellow} />
      <span className={styles.green} />
    </div>
  );
}
