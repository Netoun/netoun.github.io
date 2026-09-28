import { useState } from "react";
import { CrtCanvas } from "@/components/misc/crt-canvas/crt-canvas.component";
import { TerminalButtons } from "@primitives/terminal-buttons/terminal-buttons.component";
import type { FetchLine, Practice, StackDomain, StackGroup } from "../../data/skills-data.types";
import { SkillFetchLogo } from "./components/skill-fetch-logo/skill-fetch-logo.component";
import type { FetchLit } from "./components/skill-fetch-logo/skill-fetch-logo.component";
import { SkillFetchPractice } from "./components/skill-fetch-practice/skill-fetch-practice.component";
import { SkillFetchStack } from "./components/skill-fetch-stack/skill-fetch-stack.component";
import * as styles from "./skill-fetch.css";

const BLOCK_LABELS: Record<StackDomain, string> = {
  frontend: "FRONTEND",
  backend: "BACKEND",
  creative: "CREATIVE",
  systems: "SYSTEMS & AI",
  tooling: "TOOLING",
};

const pad = (value: number) => String(value).padStart(2, "0");

export interface SkillFetchProps {
  /** `netoun` in `netoun@lonestone`. */
  user: string;
  /** `lonestone` in `netoun@lonestone`: the current employer. */
  host: string;
  /** The readout's `key: value` lines. */
  lines: FetchLine[];
  practices: Practice[];
  groups: StackGroup[];
}

/**
 * The skills as a fetch readout (neofetch): the favicon printed as a logo beside user@host,
 * key: value lines and the colour row, in a small terminal whose glass is lightly shaded (CRT
 * scanlines in CSS, a WebGL light pass over them). Under it, the practice lifted into the
 * section's card and the stack printed on the paper with a receipt for every tool.
 */
export function SkillFetch({ user, host, lines, practices, groups }: SkillFetchProps) {
  const [lit, setLit] = useState<FetchLit | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  // Printed after user@host and its dashes, then the colour row last.
  const blocksStep = Math.min(lines.length + 2, styles.PRINT_STEPS - 1);

  return (
    <div className={styles.fetchStyle}>
      <div className={styles.terminalStyle}>
        <div className={styles.terminalBarStyle} aria-hidden="true">
          <TerminalButtons />
        </div>

        <div className={styles.screenStyle}>
          <div className={styles.commandLineStyle}>
            <span className={styles.commandStyle} aria-hidden="true">
              <span className={styles.commandTextStyle}>
                <span className={styles.promptStyle}>_❯</span> fastfetch --logo netoun
              </span>
              <span className={styles.cursorStyle}>▐</span>
            </span>
          </div>

          <div className={styles.headStyle}>
            <SkillFetchLogo lit={lit} />

            <div className={styles.readoutStyle}>
              <p className={`${styles.userHostStyle} ${styles.printStep[0]}`}>
                <span className={styles.userStyle}>{user}</span>@
                <span className={styles.hostStyle}>{host}</span>
              </p>
              <p className={`${styles.dashesStyle} ${styles.printStep[1]}`} aria-hidden="true">
                {"-".repeat(user.length + 1 + host.length)}
              </p>
              <dl className={styles.linesStyle}>
                {lines.map((line, index) => (
                  <div
                    key={line.key}
                    className={`${styles.lineStyle} ${styles.printStep[Math.min(index + 2, styles.PRINT_STEPS - 1)]}`}
                  >
                    <dt className={styles.lineKeyStyle}>{line.key}</dt>
                    <dd className={styles.lineValueStyle}>
                      {line.parts.map((part, partIndex) =>
                        part.tone ? (
                          // Runs are fixed per line: their position is their identity.
                          // oxlint-disable-next-line react/no-array-index-key
                          <span key={partIndex} className={styles.partTones[part.tone]}>
                            {part.text}
                          </span>
                        ) : (
                          part.text
                        ),
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <ul
                className={`${styles.blocksStyle} ${styles.printStep[blocksStep]}`}
                aria-label="Practices and tools per domain"
              >
                <li className={styles.blockStyle}>
                  <span className={styles.swatchStyle({ kind: "practice" })} aria-hidden="true" />
                  <span>
                    PRACTICE <span className={styles.blockCountStyle}>{pad(practices.length)}</span>
                  </span>
                </li>
                {groups.map((group) => (
                  <li key={group.domain} className={styles.blockStyle}>
                    <span
                      className={styles.swatchStyle({ kind: group.domain })}
                      aria-hidden="true"
                    />
                    <span>
                      {BLOCK_LABELS[group.domain]}{" "}
                      <span className={styles.blockCountStyle}>{pad(group.tools.length)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <CrtCanvas className={styles.crtStyle} />
        </div>
      </div>

      <div className={styles.practiceSlotStyle}>
        <SkillFetchPractice
          practices={practices}
          onPointChange={(isPointing) => setLit(isPointing ? "practice" : null)}
        />
      </div>

      <SkillFetchStack
        groups={groups}
        selectedTool={selectedTool}
        onSelectTool={setSelectedTool}
        onPointDomain={setLit}
      />
    </div>
  );
}
