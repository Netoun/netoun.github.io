import { Tag } from "@/components/primitives/tag/tag.component";
import { STACK_DOMAINS } from "../../data/experience-log";
import type {
  StackDomain,
  LogBranch,
  LogCommit,
  LogGroup,
  LogRef,
  LogRow,
  LogSummary,
} from "../../data/experience-log";
import { type ReactNode, useRef } from "react";
import { useBranchHover } from "../../hooks/use-branch-hover.hook";
import { useLineSnap } from "../../hooks/use-line-snap.hook";
import { ExperienceLogGraph } from "./components/experience-log-graph/experience-log-graph.component";
import * as styles from "./experience-log.css";

const DOMAIN_LABEL = {
  frontend: "FRONTEND",
  backend: "BACKEND",
  creative: "CREATIVE",
  systems: "SYSTEMS & AI",
} as const;

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
  const logRef = useRef<HTMLDivElement>(null);
  useLineSnap(logRef, styles.linesVar);
  // Print order across groups, read by the arrival stagger.
  let printed = 0;
  const rowProps = () => ({
    className: styles.rowStyle,
    "data-row": printed++,
    "data-line-row": "",
  });

  return (
    <div className={styles.logStyle} ref={logRef}>
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
        {groups.map(({ branch, rows, main }) => {
          const tipAt = rows.findIndex((row) => row.kind === "tip");
          const lead = rows.slice(0, tipAt);
          const tip = rows[tipAt];
          const commits = rows.filter((row) => row.kind === "commit");
          const trail = rows.slice(tipAt + 1 + commits.length);
          const dimmed = litBranch !== null && litBranch !== branch.slug;
          // main waits (`¦`) above its latest merge: it has not moved since the open branch forked.
          const mainRun = main === "behind" ? "wait" : "rail";
          // The branch runs lit to deep across its employer and its projects, row by row.
          const stretch = 1 + commits.length;
          const along = (index: number) => (index + 0.5) / stretch;

          return (
            <li
              key={branch.slug}
              className={styles.groupStyle({ domain: branch.domain })}
              data-dimmed={dimmed ? "" : undefined}
            >
              {lead.map((row) => (
                <div key={row.kind} {...rowProps()} aria-hidden="true">
                  <ExperienceLogGraph row={row} main={mainRun} />
                  <MachineRow row={row} branch={branch} />
                </div>
              ))}

              {tip?.kind === "tip" && (
                <>
                  <div {...rowProps()}>
                    <ExperienceLogGraph row={tip} main={mainRun} along={along(0)} />
                    <span className={styles.trackStyle} aria-hidden="true" />
                    <BranchTip
                      branch={branch}
                      hash={tip.hash}
                      refs={tip.refs}
                      refsHover={hover(branch.slug)}
                    />
                  </div>
                  {commits.length > 0 && (
                    <ul
                      className={styles.commitListStyle}
                      aria-label={`Client projects at ${branch.company}`}
                    >
                      {commits.map(
                        (row, index) =>
                          row.kind === "commit" && (
                            <li key={row.commit.title} {...rowProps()}>
                              <ExperienceLogGraph
                                row={row}
                                main={mainRun}
                                along={along(index + 1)}
                              />
                              <div className={styles.commitStyle} data-line-content="">
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
                                  <CommitStat hash={row.hash} commit={row.commit} />
                                </div>
                                <div className={styles.commitBodyStyle}>
                                  <Described
                                    domain={row.commit.domain}
                                    className={styles.commitDescriptionStyle}
                                  >
                                    <p className={styles.commitDescriptionTextStyle}>
                                      {row.commit.description}
                                    </p>
                                  </Described>
                                  <StackList tags={row.commit.stack} />
                                </div>
                              </div>
                            </li>
                          ),
                      )}
                    </ul>
                  )}
                </>
              )}

              {trail.map((row) =>
                row.kind === "elided" ? (
                  <div key="elided" {...rowProps()}>
                    <ExperienceLogGraph row={row} main={mainRun} />
                    <p className={styles.machineRowStyle} data-line-content="">
                      <span aria-hidden="true">⋮</span> more client work, not listed
                    </p>
                  </div>
                ) : (
                  <div key={row.kind} {...rowProps()} aria-hidden="true">
                    <ExperienceLogGraph row={row} main={row.kind === "root" ? "none" : mainRun} />
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
  hash: string;
  refs: LogRef[];
  refsHover: ReturnType<ReturnType<typeof useBranchHover>>;
}

function BranchTip({ branch, hash, refs, refsHover }: BranchTipProps) {
  const mixLabel = STACK_DOMAINS.filter((domain) => branch.mix[domain] > 0)
    .map((domain) => `${branch.mix[domain]} ${DOMAIN_LABEL[domain]}`)
    .join(" · ");

  return (
    <div className={styles.tipStyle} data-line-content="">
      <div className={styles.tipColumnStyle}>
        <div className={styles.refsStyle} aria-hidden="true" {...refsHover}>
          <span className={styles.tipHashStyle}>{hash}</span>
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
        {branch.description && (
          <Described domain="lane" className={styles.descriptionStyle}>
            <p className={styles.descriptionTextStyle}>{branch.description}</p>
          </Described>
        )}
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

// More `+` than a description has lines; the gutter clips to the paragraph.
const DIFF_MARKS = "+\n".repeat(16);

interface DescribedProps {
  /** The employer's lane, or a client project's own domain. */
  domain: "lane" | StackDomain;
  className?: string;
  children: ReactNode;
}

/** A description printed as an added hunk: one `+` per line in its gutter, like `git show`. */
function Described({ domain, className, children }: DescribedProps) {
  return (
    <div className={`${styles.diffStyle({ domain })}${className ? ` ${className}` : ""}`}>
      <span className={styles.diffGutterStyle} aria-hidden="true">
        {DIFF_MARKS}
      </span>
      {children}
    </div>
  );
}

interface CommitStatProps {
  hash: string;
  commit: LogCommit;
}

/** git's `--stat` line under a client project: its hash, then one `+` per tool of its stack. */
function CommitStat({ hash, commit }: CommitStatProps) {
  const tools = commit.stack.length;
  return (
    <p className={styles.commitStatStyle} aria-hidden="true">
      <span className={styles.hashStyle}>{hash}</span>
      <span>
        stack | {tools}{" "}
        <span className={styles.statPlusStyle({ domain: commit.domain })}>{"+".repeat(tools)}</span>
      </span>
    </p>
  );
}

interface MachineRowProps {
  row: LogRow;
  branch: LogBranch;
}

/** Merge and root rows: git's own lines, decorative (the tip already says the dates). */
function MachineRow({ row, branch }: MachineRowProps) {
  if (row.kind !== "merge" && row.kind !== "root") return null;
  return (
    <p className={styles.machineRowStyle} data-line-content="">
      <span className={styles.hashStyle}>{row.hash}</span>
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
          <Tag size="medium" mark="+">
            {tag}
          </Tag>
        </li>
      ))}
    </ul>
  );
}
