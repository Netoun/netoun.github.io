import { Tag } from "@/components/primitives/tag/tag.component";
import { STACK_DOMAINS } from "../../data/experience-log";
import type { LogBranch, LogGroup, LogRef, LogRow, LogSummary } from "../../data/experience-log";
import { useBranchHover } from "../../hooks/use-branch-hover.hook";
import { ExperienceLogGraph } from "./components/experience-log-graph/experience-log-graph.component";
import * as styles from "./experience-log.css";

const DOMAIN_LABEL = {
  frontend: "FRONTEND",
  backend: "BACKEND",
  creative: "CREATIVE",
  systems: "SYSTEMS & AI",
} as const;

// main's rail per group: where it runs dashed, where it runs solid, where it stops.
const MAIN_RAILS: Record<LogGroup["main"], { dash?: "nextNode"; rail?: { from: "top" | "node" } }> =
  {
    // The dash of the group above already runs down to this group's merge node.
    behind: { dash: "nextNode" },
    tip: { rail: { from: "node" } },
    start: { rail: { from: "node" } },
    solid: { rail: { from: "top" } },
  };

export interface ExperienceLogProps {
  groups: LogGroup[];
  summary: LogSummary;
  /** Branch lit from `branch -v` or a ref pill: the command names it, the others fade. */
  litBranch: string | null;
  onLitBranchChange: (slug: string | null) => void;
}

/**
 * The work history as `git log --graph`, printed on the paper: one branch per employer,
 * HEAD on the current job, client projects as its commits. Everything is readable without
 * pointing at it; hovering a branch's ref pill only filters the log to it (mouse only). The
 * groups themselves never listen: they fill the screen, a resting mouse would filter on scroll.
 */
export function ExperienceLog({
  groups,
  summary,
  litBranch,
  onLitBranchChange,
}: ExperienceLogProps) {
  const lit = groups.find((group) => group.branch.slug === litBranch)?.branch;
  // The legend names only the lane colours actually drawn.
  const laneDomains = STACK_DOMAINS.filter((domain) =>
    groups.some((group) => group.branch.domain === domain),
  );
  const hover = useBranchHover(onLitBranchChange);
  // Print order across groups, read by the arrival stagger.
  let printed = 0;
  const rowProps = (row: LogRow) => ({
    className: `${styles.rowStyle} ${styles.rowKindStyle[row.kind]}`,
    "data-row": printed++,
  });

  return (
    <div className={styles.logStyle}>
      <div className={styles.commandLineStyle}>
        <p className={styles.terminalStyle} aria-hidden="true">
          <span className={styles.terminalPromptStyle}>$</span>
          <span className={styles.commandTextStyle}>
            netoun log --graph{" "}
            <span className={styles.argStyle({ domain: lit?.domain ?? "none" })}>
              {lit?.slug ?? "--all"}
            </span>
          </span>
          <span className={styles.terminalCursorStyle}>▐</span>
        </p>
        <p className={styles.totalStyle}>
          SINCE {summary.since} · {summary.total}
        </p>
      </div>

      <ol className={styles.groupsStyle} aria-label="Work history, newest first">
        {groups.map(({ branch, rows, main, endsAtRoot }) => {
          const tipAt = rows.findIndex((row) => row.kind === "tip");
          const lead = rows.slice(0, tipAt);
          const tip = rows[tipAt];
          const commits = rows.filter((row) => row.kind === "commit");
          const trail = rows.slice(tipAt + 1 + commits.length);
          const dimmed = litBranch !== null && litBranch !== branch.slug;
          const rails = MAIN_RAILS[main];
          const groupFirstRow = printed;

          return (
            <li
              key={branch.slug}
              className={styles.groupStyle({ domain: branch.domain })}
              data-dimmed={dimmed ? "" : undefined}
              data-first-row={groupFirstRow}
            >
              {rails.dash && (
                <span
                  className={`${styles.mainDashStyle({ to: endsAtRoot ? "root" : rails.dash })} ${styles.laneDrawStyle}`}
                  aria-hidden="true"
                />
              )}
              {rails.rail && (
                <span
                  className={`${styles.mainRailStyle({ from: rails.rail.from, to: endsAtRoot ? "root" : "end" })} ${styles.laneDrawStyle}`}
                  aria-hidden="true"
                />
              )}

              {lead.map((row) => (
                <div key={row.kind} {...rowProps(row)} aria-hidden="true">
                  <ExperienceLogGraph row={row} />
                  <MachineRow row={row} branch={branch} />
                </div>
              ))}

              {tip?.kind === "tip" && (
                <div className={styles.bodyStyle} data-first-row={printed}>
                  <span
                    className={`${styles.branchLaneStyle({ from: branch.isOpen ? "node" : "top" })} ${styles.laneDrawStyle}`}
                    aria-hidden="true"
                  />
                  <div {...rowProps(tip)}>
                    <ExperienceLogGraph row={tip} />
                    <span className={styles.trackStyle} aria-hidden="true" />
                    <BranchTip branch={branch} refs={tip.refs} refsHover={hover(branch.slug)} />
                  </div>
                  {commits.length > 0 && (
                    <ul
                      className={styles.commitListStyle}
                      aria-label={`Client projects at ${branch.company}`}
                    >
                      {commits.map(
                        (row) =>
                          row.kind === "commit" && (
                            <li key={row.commit.title} {...rowProps(row)}>
                              <ExperienceLogGraph row={row} />
                              <div className={styles.commitStyle}>
                                <div className={styles.commitHeadStyle}>
                                  <h4 className={styles.commitTitleStyle}>{row.commit.title}</h4>
                                  <p className={styles.commitDomainStyle}>
                                    <span
                                      className={styles.commitLedStyle({
                                        domain: row.commit.domain,
                                      })}
                                      aria-hidden="true"
                                    />
                                    MOSTLY {DOMAIN_LABEL[row.commit.domain]}
                                  </p>
                                </div>
                                <div className={styles.commitBodyStyle}>
                                  <p className={styles.commitDescriptionStyle}>
                                    {row.commit.description}
                                  </p>
                                  <StackList tags={row.commit.stack} />
                                </div>
                              </div>
                            </li>
                          ),
                      )}
                    </ul>
                  )}
                </div>
              )}

              {trail.map((row) =>
                row.kind === "elided" ? (
                  <div key="elided" {...rowProps(row)}>
                    <ExperienceLogGraph row={row} />
                    <p className={styles.machineRowStyle}>
                      <span aria-hidden="true">⋮</span> more client work, not listed
                    </p>
                  </div>
                ) : (
                  <div key={row.kind} {...rowProps(row)} aria-hidden="true">
                    <ExperienceLogGraph row={row} />
                    <MachineRow row={row} branch={branch} />
                  </div>
                ),
              )}
            </li>
          );
        })}
      </ol>

      <div className={styles.footStyle} aria-hidden="true">
        <span className={styles.endStyle}>
          (END)<span className={styles.cursorStyle}>▐</span>
        </span>
        <span className={styles.legendStyle}>
          <span>LANE = MAIN STACK DOMAIN</span>
          {laneDomains.map((domain) => (
            <span key={domain} className={styles.legendItemStyle}>
              <span className={styles.legendSwatchStyle({ domain })} />
              {DOMAIN_LABEL[domain]}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

interface BranchTipProps {
  branch: LogBranch;
  refs: LogRef[];
  refsHover: ReturnType<ReturnType<typeof useBranchHover>>;
}

function BranchTip({ branch, refs, refsHover }: BranchTipProps) {
  const mixLabel = STACK_DOMAINS.filter((domain) => branch.mix[domain] > 0)
    .map((domain) => `${branch.mix[domain]} ${DOMAIN_LABEL[domain]}`)
    .join(" · ");

  return (
    <div className={styles.tipStyle}>
      <div className={styles.tipColumnStyle}>
        <div className={styles.refsStyle} aria-hidden="true" {...refsHover}>
          {refs.map((ref) => (
            <RefPill key={ref.label} logRef={ref} slug={branch.slug} />
          ))}
        </div>
        <h3 className={styles.companyStyle}>{branch.company}</h3>
        <p className={styles.roleStyle}>{branch.role}</p>
        <p className={styles.locationStyle}>{branch.location}</p>
        <div className={styles.mixStyle}>
          <span className={styles.mixLedsStyle} aria-hidden="true">
            {STACK_DOMAINS.flatMap((domain) =>
              Array.from({ length: branch.mix[domain] }, (_, index) => (
                <span key={`${domain}-${index}`} className={styles.mixLedStyle({ domain })} />
              )),
            )}
          </span>
          <p className={styles.mixLabelStyle}>{mixLabel}</p>
        </div>
      </div>
      <div className={styles.tipColumnStyle}>
        <p className={styles.periodStyle}>
          <span>
            <time dateTime={branch.start}>{branch.startLabel}</time> –{" "}
            {branch.end ? <time dateTime={branch.end}>{branch.endLabel}</time> : branch.endLabel}
          </span>
          <span className={styles.durationStyle}>&nbsp;· {branch.duration}</span>
        </p>
        {branch.description && <p className={styles.descriptionStyle}>{branch.description}</p>}
        {branch.stack.length > 0 && <StackList tags={branch.stack} className={styles.stackStyle} />}
      </div>
    </div>
  );
}

interface RefPillProps {
  logRef: LogRef;
  slug: string;
}

function RefPill({ logRef, slug }: RefPillProps) {
  if (logRef.kind === "head" && logRef.label.startsWith("HEAD -> ")) {
    return (
      <span className={styles.refStyle({ kind: "head" })}>
        <span className={styles.headLabelStyle}>HEAD</span>
        <span className={styles.headArrowStyle}>{"->"}</span>
        <span className={styles.headSlugStyle}>
          {logRef.label.slice("HEAD -> ".length) || slug}
        </span>
      </span>
    );
  }
  return <span className={styles.refStyle({ kind: logRef.kind })}>{logRef.label}</span>;
}

interface MachineRowProps {
  row: LogRow;
  branch: LogBranch;
}

/** Merge and root rows: git's own lines, decorative (the tip already says the dates). */
function MachineRow({ row, branch }: MachineRowProps) {
  if (row.kind !== "merge" && row.kind !== "root") return null;
  return (
    <p className={styles.machineRowStyle}>
      {row.kind === "merge" ? (
        <span>
          Merge branch &apos;<span className={styles.mergedNameStyle}>{branch.slug}</span>&apos;
        </span>
      ) : (
        <span>Initial commit</span>
      )}
      {row.refs.map((ref) => (
        <RefPill key={ref.label} logRef={ref} slug={branch.slug} />
      ))}
    </p>
  );
}

interface StackListProps {
  tags: string[];
  className?: string;
}

function StackList({ tags, className = styles.stackStyle }: StackListProps) {
  return (
    <ul className={className} aria-label="Stack">
      {tags.map((tag) => (
        <li key={tag}>
          <Tag size="large">{tag}</Tag>
        </li>
      ))}
    </ul>
  );
}
