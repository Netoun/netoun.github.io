import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-aria-components";
import {
  FeatureHeader,
  FeatureHeaderTitle,
} from "@/components/layouts/feature-header/feature-header.component";
import { Glyph } from "@/components/primitives/glyph/glyph.component";
import { Tag } from "@/components/primitives/tag/tag.component";
import { isInkSpecimen, type LabExperimentStats } from "../../data/labs-stats";
import type { LabExperiment } from "../../data/labs.types";
import {
  LabsCodeViewer,
  type LabsCodeHighlight,
} from "../labs-code-viewer/labs-code-viewer.component";
import { LabsManual } from "../labs-manual/labs-manual.component";
import { LabsPreviewFit, useLabsView } from "../labs-preview/labs-preview.component";
import * as styles from "./labs-experiment-frame.css";

interface LabsBench {
  experiment: LabExperiment;
  xray: boolean;
  setXray: (xray: boolean) => void;
}

// Set by the experiment page around its demo; a demo rendered anywhere else (the index loupe,
// a test) gets no bench and shows its bare stage.
const LabsBenchContext = createContext<LabsBench | null>(null);

/** True while the page shows the demo's mechanism (`--xray`). Always false outside the page. */
export function useLabsXray(): boolean {
  const bench = useContext(LabsBenchContext);
  return Boolean(bench?.xray && bench.experiment.xray);
}

interface LabsStageProps {
  children: ReactNode;
}

/** Centered stage area for the live demo (no bench around it). */
export function LabsStage({ children }: LabsStageProps) {
  return <div className={styles.stage}>{children}</div>;
}

interface LabsDemoLayoutProps {
  stage: ReactNode;
  controls: ReactNode;
  /** What the stage mounts, printed under it (`<GlitchSignalMap tickMs={250} />`). */
  mounted?: string;
}

/**
 * The bench: the stage in its window (command bar, screen) beside the controls card, stacked
 * below `lg`. In a preview, the stage alone, fitted to its box.
 */
export function LabsDemoLayout({ stage, controls, mounted }: LabsDemoLayoutProps) {
  const view = useLabsView();
  const bench = useContext(LabsBenchContext);
  if (view === "preview") return <LabsPreviewFit>{stage}</LabsPreviewFit>;
  if (!bench) {
    return (
      <div className={styles.bench}>
        <LabsStage>{stage}</LabsStage>
        <aside className={styles.controlsCard}>{controls}</aside>
      </div>
    );
  }

  const { experiment, setXray } = bench;
  const xray = Boolean(bench.xray && experiment.xray);

  return (
    <div className={styles.bench}>
      <section className={styles.stageWindow} aria-label="Live demo">
        <div className={styles.stageBar}>
          <p className={styles.command} aria-hidden="true">
            <Glyph>_❯</Glyph>
            <span className={styles.commandText}>netoun labs run {experiment.slug}</span>
            {xray && <span className={styles.commandFlag}>--xray</span>}
            <Glyph className={styles.cursor}>▐</Glyph>
          </p>
          <span className={styles.engine}>{experiment.engine}</span>
          {experiment.xray && (
            <ToggleButtonGroup
              aria-label="Show the mechanism"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={[xray ? "xray" : "run"]}
              onSelectionChange={(keys) => setXray(keys.has("xray"))}
              className={styles.viewToggle}
            >
              <ToggleButton id="run" className={styles.viewButton}>
                Run
              </ToggleButton>
              <ToggleButton id="xray" className={styles.viewButton}>
                Xray
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </div>
        <div
          className={styles.screen}
          data-surface={isInkSpecimen(experiment.group) ? "ink" : "paper"}
        >
          {stage}
        </div>
        {mounted && (
          <p className={styles.mounted}>
            <span className={styles.mountedLabel} aria-hidden="true">
              mounted
            </span>
            <code className={styles.mountedCode}>{mounted}</code>
          </p>
        )}
      </section>
      <aside className={styles.controlsCard} aria-labelledby="labs-controls-title">
        <h2 id="labs-controls-title" className={styles.controlsTitle}>
          Controls
        </h2>
        <div className={styles.controlsBody}>{controls}</div>
      </aside>
    </div>
  );
}

interface LabsExperimentFrameProps {
  experiment: LabExperiment;
  /** Its registry position, files and lines (the page reads them from the registry). */
  stats: LabExperimentStats;
}

/** Outer chrome for an experiment page: header (h1), bench, `man` page, source viewer. */
export function LabsExperimentFrame({ experiment, stats }: LabsExperimentFrameProps) {
  const { Demo } = experiment;
  const [xray, setXray] = useState(false);
  const [cited, setCited] = useState<{ key: string; highlight: LabsCodeHighlight } | null>(null);
  const bench = useMemo(() => ({ experiment, xray, setXray }), [experiment, xray]);

  return (
    <article className={styles.frame}>
      <header className={styles.frameHeader}>
        <FeatureHeader as="page" index={Number(stats.index)}>
          <FeatureHeaderTitle>{experiment.title}</FeatureHeaderTitle>
        </FeatureHeader>
        <p className={styles.description}>{experiment.description}</p>
        <div className={styles.tagRow}>
          {experiment.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          <span className={styles.meta}>
            {experiment.group} · {stats.files} files · {stats.lines.toLocaleString("en-US")} lines
          </span>
        </div>
      </header>

      <LabsBenchContext.Provider value={bench}>
        <Demo />
      </LabsBenchContext.Provider>

      {experiment.manual && (
        <LabsManual
          experiment={experiment}
          citedKey={cited?.key ?? null}
          onCite={(key, highlight) => setCited({ key, highlight })}
        />
      )}

      <LabsCodeViewer
        sources={experiment.sources}
        stats={stats.sources}
        highlight={cited?.highlight ?? null}
      />
    </article>
  );
}
