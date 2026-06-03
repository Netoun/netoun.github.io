import type { ReactNode } from "react";
import * as styles from "./labs-screen.css";

/** Sized container for HUD widgets that fill 100% of their parent. */
export function LabsScreen({ children }: { children: ReactNode }) {
  return <div className={styles.screen}>{children}</div>;
}
