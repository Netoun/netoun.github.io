import { useState } from "react";
import {
  FeatureHeader,
  FeatureHeaderDescription,
  FeatureHeaderTitle,
} from "@/components/layouts/feature-header/feature-header.component";
import { Glyph } from "@/components/primitives/glyph/glyph.component";
import type { ExperimentSlug } from "@/features/labs/data/experiment-slugs";
import { labs } from "@/features/labs/data/experiments";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import { useMediaQuery } from "@/hooks/use-media-query.hook";
import { useSettledValue } from "@/hooks/use-settled-value.hook";
import { LabsIndexDu } from "../components/labs-index-du/labs-index-du.component";
import { LabsIndexLoupe } from "../components/labs-index-loupe/labs-index-loupe.component";
import { LabsIndexTree } from "../components/labs-index-tree/labs-index-tree.component";
import * as styles from "./labs-index.page.css";

export function meta() {
  return labs.buildIndexMeta();
}

// The loupe runs the previewed demo itself where a fine pointer can preview rows and motion is
// welcome; elsewhere it shows the demo's capture.
const LIVE_LOUPE_QUERY = "(min-width: 64em) and (hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
// A pointer crossing rows on its way somewhere must not start a demo per row.
const LIVE_SETTLE_MS = 250;

const count = (value: number) => value.toLocaleString("en-US");

export default function LabsIndexPage() {
  const experiments = labs.getAll();
  const totals = labs.getTotals();
  const [previewSlug, setPreviewSlug] = useState<ExperimentSlug>(experiments[0].slug);
  const previewed = labs.getBySlug(previewSlug) ?? experiments[0];

  const canRunLive = useMediaQuery(LIVE_LOUPE_QUERY);
  const prefersReducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const settledSlug = useSettledValue(previewSlug, LIVE_SETTLE_MS);
  const { ref: loupeRef, isIntersecting: loupeOnScreen } =
    useIntersectionObserver<HTMLDivElement>();
  const live = canRunLive && !prefersReducedMotion && loupeOnScreen && settledSlug === previewSlug;

  return (
    <div className={styles.pageStyle}>
      <header className={styles.headerStyle}>
        <div>
          <FeatureHeader as="page">
            <FeatureHeaderTitle>LABS</FeatureHeaderTitle>
            <FeatureHeaderDescription>
              {"Interactive experiments & their source"}
            </FeatureHeaderDescription>
          </FeatureHeader>
          <p className={styles.introStyle}>
            A playground for the 3D, canvas and shader pieces scattered across this site — each one
            isolated as a live, tweakable demo with its source code in plain sight.
          </p>
        </div>
        <div className={styles.duStyle}>
          <LabsIndexDu groups={labs.getGroupStats()} totals={totals} />
        </div>
      </header>

      <div className={styles.commandRowStyle}>
        <p className={styles.commandStyle} aria-hidden="true">
          <Glyph className={styles.promptStyle}>_❯</Glyph>
          <span className={styles.commandTextStyle}>tree -d -L 2 ~/labs</span>
          <Glyph className={styles.cursorStyle}>▐</Glyph>
        </p>
        <p className={styles.summaryStyle}>
          {totals.experiments} experiments · {totals.files} files · {count(totals.lines)} lines ·{" "}
          {totals.size}
        </p>
        <p className={styles.legendStyle} aria-hidden="true">
          point to preview · ↑↓ · ⏎ opens
        </p>
      </div>

      <div className={styles.bodyStyle}>
        <LabsIndexTree previewSlug={previewed.slug} onPreview={setPreviewSlug} />
        <div ref={loupeRef} className={styles.loupeColumnStyle}>
          <LabsIndexLoupe experiment={previewed} live={live} />
        </div>
      </div>
    </div>
  );
}
