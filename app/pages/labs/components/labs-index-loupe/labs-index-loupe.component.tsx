import { Link } from "react-router";
import { ChromeCapture } from "@/components/misc/chrome-capture/chrome-capture.component";
import { Glyph } from "@/components/primitives/glyph/glyph.component";
import { Tag } from "@/components/primitives/tag/tag.component";
import { LabsPreview } from "@/features/labs/components/labs-preview/labs-preview.component";
import { labs } from "@/features/labs/data/experiments";
import { isInkSpecimen } from "@/features/labs/data/labs-stats";
import type { LabExperiment } from "@/features/labs/data/labs.types";
import { labCaptures } from "../../data/labs-captures.data";
import * as styles from "./labs-index-loupe.css";

interface LabsIndexLoupeProps {
  experiment: LabExperiment;
  /** Run the demo itself over its capture (one at a time, fine pointers, motion allowed). */
  live: boolean;
}

/**
 * The previewed experiment, in a window of the process monitor's family: its stage (live, or
 * its capture), what it is, and its own files as `tree -h` prints them. An on-screen echo of
 * the row under the pointer or the focus: the row carries the name, the sentence and the link.
 */
export function LabsIndexLoupe({ experiment, live }: LabsIndexLoupeProps) {
  const { Demo } = experiment;
  const stats = labs.getStats(experiment);
  const total = String(labs.getTotals().experiments).padStart(2, "0");
  const capture = labCaptures[experiment.slug];
  const path = `~/labs/${stats.dir}/${experiment.slug}`;
  const lastSource = stats.sources.length - 1;

  return (
    <aside className={styles.loupeStyle} aria-hidden="true">
      <div className={styles.barStyle}>
        <span className={styles.commandStyle}>
          <Glyph>_❯</Glyph>
          <span className={styles.commandTextStyle}>netoun labs run {experiment.slug}</span>
          <Glyph className={styles.cursorStyle}>▐</Glyph>
        </span>
        <span className={styles.statusStyle}>
          {live && (
            <span className={styles.liveStyle}>
              <span className={styles.liveDotStyle} />
              live ·
            </span>
          )}
          {stats.index}/{total}
        </span>
      </div>

      <div className={styles.screenWrapStyle}>
        <ChromeCapture
          // Remounted per experiment: the new capture arrives with one chrome glint.
          key={experiment.slug}
          src={capture.src}
          width={capture.width}
          height={capture.height}
          fit="contain"
          sweep
          screenClassName={
            isInkSpecimen(experiment.group) ? styles.inkScreenStyle : styles.paperScreenStyle
          }
        >
          {live && (
            <span className={styles.demoStyle} data-labs-live>
              <LabsPreview>
                <Demo />
              </LabsPreview>
            </span>
          )}
        </ChromeCapture>
      </div>

      <div className={styles.bodyStyle}>
        <p className={styles.kickerStyle}>
          _{stats.index} / {experiment.group}
        </p>
        <p className={styles.titleStyle}>{experiment.title}</p>
        <p className={styles.sentenceStyle}>{experiment.description}</p>
        <div className={styles.tagsStyle}>
          {experiment.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <div className={styles.subtreeStyle}>
          <p className={styles.subtreeCommandStyle}>tree -h {path}</p>
          <p className={styles.subtreeLineStyle}>{path}</p>
          {stats.sources.map((source, index) => (
            <p key={source.label} className={styles.subtreeLineStyle}>
              <span className={styles.subtreeGlyphStyle}>
                {index === lastSource ? "`-- " : "|-- "}
              </span>
              <span className={styles.subtreeSizeStyle}>[{source.size.padStart(4, " ")}]</span>
              <span className={styles.subtreeNameStyle}>{source.label}</span>
              <span className={styles.subtreeLinesStyle}>{source.lines} lines</span>
            </p>
          ))}
          <p className={styles.subtreeClosingStyle}>
            0 directories, {stats.files} {stats.files === 1 ? "file" : "files"}
          </p>
        </div>

        <Link to={`/labs/${experiment.slug}/`} className={styles.openStyle} tabIndex={-1}>
          _Open_ <span className={styles.openArrowStyle}>→</span>
        </Link>
      </div>
    </aside>
  );
}
