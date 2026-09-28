import { LOGO_ASCII } from "../../../../data/logo-ascii";
import type { StackDomain } from "../../../../data/skills-data.types";
import * as styles from "./skill-fetch-logo.css";

export type FetchLit = StackDomain | "practice";

export interface SkillFetchLogoProps {
  /** The readout line being pointed at: the logo takes its colour. */
  lit: FetchLit | null;
}

/** The favicon printed as characters, the way neofetch prints a distro logo. */
export function SkillFetchLogo({ lit }: SkillFetchLogoProps) {
  return (
    <pre className={styles.logoStyle} aria-hidden="true">
      <span className={`${styles.holoStyle} ${styles.litTones[lit ?? "none"]}`}>
        {LOGO_ASCII.map((line, index) => (
          // Rows are fixed art: the index is their identity.
          // oxlint-disable-next-line react/no-array-index-key
          <span key={index} className={styles.rowStyle}>
            {line}
          </span>
        ))}
      </span>
    </pre>
  );
}
