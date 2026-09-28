import { assignInlineVars } from "@vanilla-extract/dynamic";
import type { KeyboardEvent } from "react";
import { Link } from "react-router";
import { ChromeCapture } from "@/components/misc/chrome-capture/chrome-capture.component";
import { Glyph } from "@/components/primitives/glyph/glyph.component";
import { LabsIsoIcon } from "@/features/labs/components/labs-iso-icon/labs-iso-icon.component";
import type { ExperimentSlug } from "@/features/labs/data/experiment-slugs";
import { labs } from "@/features/labs/data/experiments";
import { isInkSpecimen } from "@/features/labs/data/labs-stats";
import { labCaptures } from "../../data/labs-captures.data";
import * as styles from "./labs-index-tree.css";

interface LabsIndexTreeProps {
  /** The experiment shown in the loupe. */
  previewSlug: ExperimentSlug;
  /** Pointing at or focusing a row previews it; the row itself opens the experiment. */
  onPreview: (slug: ExperimentSlug) => void;
}

const count = (value: number) => value.toLocaleString("en-US");

// `tree` draws with `|`, `|--` and `` `-- `` under `--charset=ascii`: Doto has no box-drawing
// glyphs. Every gutter is the same width in cells, so the text column starts on one edge.
const branch = (last: boolean) => (last ? "`-- " : "|-- ");
const trunk = (last: boolean) => (last ? "    " : "|   ");

/** Arrow keys walk the rows (Tab still does); Enter follows the focused row's link. */
function walkRows(event: KeyboardEvent<HTMLDivElement>) {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
  const rows = [...event.currentTarget.querySelectorAll<HTMLAnchorElement>("[data-lab-row]")];
  const current = rows.findIndex((row) => row === document.activeElement);
  if (current === -1) return;
  const next = rows[current + (event.key === "ArrowDown" ? 1 : -1)];
  if (!next) return;
  event.preventDefault();
  next.focus();
}

/**
 * The Labs index as `tree -d -L 2 ~/labs` prints it, on the paper: the group directories, one
 * row per experiment (the whole row is its link), closed by the directory count.
 */
export function LabsIndexTree({ previewSlug, onPreview }: LabsIndexTreeProps) {
  const sections = labs.getGrouped();
  const groupStats = labs.getGroupStats();
  const totals = labs.getTotals();
  let order = 0;

  return (
    // oxlint-disable-next-line jsx-a11y/no-static-element-interactions -- the arrow keys only move focus between the row links inside; every row is a real link.
    <div className={styles.treeStyle} onKeyDown={walkRows}>
      <p className={styles.rootStyle} aria-hidden="true">
        ~/labs
      </p>
      {sections.map((section, groupIndex) => {
        const lastGroup = groupIndex === sections.length - 1;
        const rail = lastGroup ? " " : "|";
        const stats = groupStats[groupIndex];
        const headingId = `labs-group-${stats.dir}`;

        return (
          <section key={section.group} aria-labelledby={headingId}>
            <h2 id={headingId} className={styles.groupStyle}>
              <span className={styles.glyphStyle} aria-hidden="true">
                {branch(lastGroup)}
              </span>
              <span className={styles.groupDirStyle} aria-hidden="true">
                {stats.dir}/
              </span>
              <span className={styles.srOnlyStyle}>{section.group}</span>
              <span className={styles.groupMetaStyle}>
                {stats.experiments} {stats.experiments === 1 ? "experiment" : "experiments"} ·{" "}
                {count(stats.lines)} lines
              </span>
            </h2>
            <ul className={styles.listStyle}>
              {section.experiments.map((experiment, rowIndex) => {
                const last = rowIndex === section.experiments.length - 1;
                const experimentStats = labs.getStats(experiment);
                const capture = labCaptures[experiment.slug];
                const titleId = `labs-row-${experiment.slug}`;
                const position = order++;

                return (
                  <li key={experiment.slug}>
                    <Link
                      to={`/labs/${experiment.slug}/`}
                      className={styles.rowStyle}
                      data-lab-row
                      data-previewed={experiment.slug === previewSlug ? "true" : "false"}
                      aria-labelledby={titleId}
                      aria-describedby={`${titleId}-description`}
                      onPointerEnter={() => onPreview(experiment.slug)}
                      onFocus={() => onPreview(experiment.slug)}
                      style={assignInlineVars({ [styles.rowOrder]: String(position) })}
                    >
                      <span className={styles.gutterStyle} aria-hidden="true">
                        <span className={styles.gutterLineStyle}>
                          {rail}
                          {"   "}
                          {branch(last)}
                        </span>
                        <span className={styles.gutterLineStyle}>
                          {rail}
                          {"   "}
                          {trunk(last)}
                        </span>
                        <span className={styles.gutterLineStyle}>
                          {rail}
                          {"   "}
                          {trunk(last)}
                        </span>
                      </span>
                      <Glyph className={styles.caretStyle}>❯</Glyph>
                      <span
                        className={styles.iconStyle({ accent: experiment.accent })}
                        aria-hidden="true"
                      >
                        <LabsIsoIcon slug={experiment.slug} />
                      </span>
                      <span className={styles.headStyle}>
                        <span className={styles.indexStyle} aria-hidden="true">
                          _{experimentStats.index}
                        </span>
                        <span id={titleId} className={styles.titleStyle}>
                          {experiment.title}
                        </span>
                      </span>
                      <span className={styles.metaStyle} aria-hidden="true">
                        {experimentStats.files} files · {count(experimentStats.lines)} lines
                      </span>
                      <span id={`${titleId}-description`} className={styles.sentenceStyle}>
                        {experiment.description}
                      </span>
                      <span className={styles.thumbStyle}>
                        <ChromeCapture
                          src={capture.thumb.src}
                          width={capture.thumb.width}
                          height={capture.thumb.height}
                          fit="contain"
                          size="sm"
                          screenClassName={
                            isInkSpecimen(experiment.group)
                              ? styles.thumbInkStyle
                              : styles.thumbPaperStyle
                          }
                        />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      <p className={styles.closingStyle}>{totals.directories} directories</p>
    </div>
  );
}
