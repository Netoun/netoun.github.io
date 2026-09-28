import { useId } from "react";
import type { Practice } from "../../../../data/skills-data.types";
import * as styles from "./skill-fetch-practice.css";

// The dot stays with the name before it: a narrow line breaks after "·", never before.
const TOOL_SEPARATOR = "\u00a0· ";

export interface SkillFetchPracticeProps {
  practices: Practice[];
  /** The pointer is over the card: the logo turns ink. */
  onPointChange: (isPointing: boolean) => void;
}

/** How the work gets done with agents and LLMs, lifted off the paper into the section's card. */
export function SkillFetchPractice({ practices, onPointChange }: SkillFetchPracticeProps) {
  const titleId = useId();

  return (
    <section
      className={styles.cardStyle}
      aria-labelledby={titleId}
      onPointerEnter={() => onPointChange(true)}
      onPointerLeave={() => onPointChange(false)}
    >
      <div className={styles.barStyle}>
        <h3 id={titleId} className={styles.titleStyle}>
          <span className={styles.pillStyle}>PRACTICE</span>
          agents &amp; LLM
        </h3>
        <span className={styles.countStyle} aria-hidden="true">
          {String(practices.length).padStart(2, "0")}
        </span>
      </div>

      <ul className={styles.checksStyle}>
        {practices.map((practice) => (
          <li key={practice.id} className={styles.checkStyle}>
            <span className={styles.tickStyle} aria-hidden="true">
              ✓
            </span>
            <div className={styles.checkBodyStyle}>
              <h4 className={styles.checkTitleStyle}>{practice.title}</h4>
              <p className={`${styles.checkTextStyle} ${styles.fullRowStyle}`}>{practice.body}</p>
              <dl className={`${styles.proofsStyle} ${styles.fullRowStyle}`}>
                <div>
                  <dt className={styles.proofTermStyle}>• {practice.withLabel} </dt>
                  <dd className={styles.proofValueStyle}>{practice.with.join(TOOL_SEPARATOR)}</dd>
                </div>
                <div>
                  <dt className={styles.proofTermStyle}>• receipt </dt>
                  <dd className={styles.proofValueStyle}>
                    {practice.receipt.href ? (
                      <a
                        href={practice.receipt.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.proofLinkStyle}
                      >
                        {practice.receipt.text}
                        <span aria-hidden="true">{"\u00a0↗"}</span>
                      </a>
                    ) : (
                      practice.receipt.text
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
