import { useId } from "react";
import type { LogRow } from "../../../../data/experience-log";
import * as styles from "./experience-log-graph.css";

// viewBox 4 × 4: main runs at x = 1 (25 %), the branch at x = 3 (75 %). Each path starts or
// ends with a short straight run (0.12 unit, 2–3px) into the lane it joins, so the butt end
// overlaps a piece of the same colour and no joint shows. The node end sits under the node.
const CONNECTOR_PATHS = {
  fork: "M3 -0.12 L3 0 C3 2 1 2 1 4",
  "merge-in": "M1 0 C1 2 3 2 3 4 L3 4.12",
} as const;

function nodeOf(row: LogRow) {
  switch (row.kind) {
    case "tip":
      return {
        lane: "branch",
        kind: row.refs.some((ref) => ref.kind === "head") ? "head" : "tip",
      } as const;
    case "commit":
      return { lane: "branch", kind: "commit", domain: row.commit.domain } as const;
    case "merge":
      return { lane: "main", kind: "merge" } as const;
    case "root":
      return { lane: "main", kind: "root" } as const;
    default:
      return null;
  }
}

export interface ExperienceLogGraphProps {
  row: LogRow;
}

/**
 * The graph cell of one log row: its node, or the curve that joins a branch to main.
 * The straight lanes are drawn once per group by the log. Decorative.
 */
export function ExperienceLogGraph({ row }: ExperienceLogGraphProps) {
  // SVG gradient ids must be unique on the page and valid in `url(#…)`.
  const gradientId = `log-curve-${useId().replace(/[^\w-]/g, "")}`;
  const node = nodeOf(row);

  return (
    <div className={styles.graphStyle} aria-hidden="true">
      {row.kind === "elided" && <span className={styles.elidedLaneStyle} />}
      {(row.kind === "fork" || row.kind === "merge-in") && (
        <svg
          className={styles.connectorStyle({ kind: row.kind })}
          viewBox="0 0 4 4"
          preserveAspectRatio="none"
        >
          <defs>
            {/* fork: the deep end of the branch fades into the rail; merge-in: the rail lights the tip. */}
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0"
                className={row.kind === "fork" ? styles.stopDeepStyle : styles.stopRailStyle}
              />
              <stop
                offset="1"
                className={row.kind === "fork" ? styles.stopRailStyle : styles.stopLitStyle}
              />
            </linearGradient>
          </defs>
          <path
            d={CONNECTOR_PATHS[row.kind]}
            stroke={`url(#${gradientId})`}
            className={styles.connectorPathStyle}
          />
        </svg>
      )}
      {node?.kind === "head" && <span className={styles.pingStyle} />}
      {node && <span className={styles.nodeStyle(node)} />}
    </div>
  );
}
