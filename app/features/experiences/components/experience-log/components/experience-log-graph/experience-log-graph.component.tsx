import { assignInlineVars } from "@vanilla-extract/dynamic";
import type { LogRow } from "../../../../data/experience-log";
import * as styles from "./experience-log-graph.css";

/** How main runs through a row: waiting above its latest merge (`¦`), on (`|`), or ended. */
export type MainRun = "wait" | "rail" | "none";

interface Glyph {
  char: string;
  tone: styles.GlyphTone;
}

/** A glyph cell: what its first line prints, and what every line below it repeats. */
interface Column {
  head?: Glyph;
  run?: Glyph;
}

// More lines than the tallest row holds (a tip on a phone); the column clips the rest.
const RUN = 48;
const COLUMNS = ["main", "link", "branch"] as const;

const rail: Glyph = { char: "|", tone: "rail" };
const lane: Glyph = { char: "|", tone: "lane" };

/** git's own graph for one row, in three cells: main, the diagonals, the branch. */
function columnsOf(row: LogRow, main: MainRun): Record<(typeof COLUMNS)[number], Column> {
  const mainRun =
    main === "none" ? undefined : main === "wait" ? { char: "¦", tone: "wait" as const } : rail;
  switch (row.kind) {
    case "tip":
      return {
        main: { run: mainRun },
        link: {},
        branch: { head: { char: "*", tone: "lit" }, run: lane },
      };
    case "commit":
      return {
        main: { run: mainRun },
        link: {},
        branch: { head: { char: "*", tone: row.commit.domain }, run: lane },
      };
    case "elided":
      return { main: { run: mainRun }, link: {}, branch: { run: { char: ":", tone: "deep" } } };
    case "fork":
      return { main: { run: mainRun }, link: { head: { char: "/", tone: "fork" } }, branch: {} };
    case "merge":
      return { main: { head: { char: "*", tone: "rail" }, run: rail }, link: {}, branch: {} };
    case "merge-in":
      return { main: { run: rail }, link: { head: { char: "\\", tone: "mergeIn" } }, branch: {} };
    case "root":
      return { main: { head: { char: "*", tone: "rail" } }, link: {}, branch: {} };
  }
}

export interface ExperienceLogGraphProps {
  row: LogRow;
  main: MainRun;
  /** Where the row sits along its branch, 0 (tip) to 1 (fork): the lane's lit-to-deep colour. */
  along?: number;
}

/**
 * The graph cell of one log row, printed as `git log --graph` prints it: `*` for a commit,
 * `|` for a lane, `/` and `\` where a branch leaves or joins main. Decorative.
 */
export function ExperienceLogGraph({ row, main, along }: ExperienceLogGraphProps) {
  const columns = columnsOf(row, main);
  const isHead = row.kind === "tip" && row.refs.some((ref) => ref.kind === "head");

  return (
    <div
      className={styles.graphStyle}
      aria-hidden="true"
      style={
        along === undefined ? undefined : assignInlineVars({ [styles.alongVar]: String(along) })
      }
    >
      {isHead && <span className={styles.pingStyle} />}
      <span className={styles.columnsStyle}>
        {COLUMNS.map((name) => {
          const { head, run } = columns[name];
          return (
            <span key={name} className={styles.columnStyle}>
              {head && <span className={styles.glyphStyle({ tone: head.tone })}>{head.char}</span>}
              {run && (
                <span className={styles.runStyle({ tone: run.tone })}>
                  {`${run.char}\n`.repeat(RUN)}
                </span>
              )}
            </span>
          );
        })}
      </span>
    </div>
  );
}
