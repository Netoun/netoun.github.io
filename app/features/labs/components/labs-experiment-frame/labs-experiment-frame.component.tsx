import type { ReactNode } from "react";
import {
  FeatureHeader,
  FeatureHeaderTitle,
} from "@/components/layouts/feature-header/feature-header.component";
import type { LabExperiment } from "../../data/labs.types";
import { LabsCodeViewer } from "../labs-code-viewer/labs-code-viewer.component";
import * as styles from "./labs-experiment-frame.css";

/** Centered stage area for the live demo. */
export function LabsStage({ children }: { children: ReactNode }) {
  return <div className={styles.stage}>{children}</div>;
}

/** Side-by-side demo + controls layout (stacks below `lg`). */
export function LabsDemoLayout({ stage, controls }: { stage: ReactNode; controls: ReactNode }) {
  return (
    <div className={styles.demoLayout}>
      <LabsStage>{stage}</LabsStage>
      <aside className={styles.controlsAside}>{controls}</aside>
    </div>
  );
}

/** Outer chrome for an experiment page: header (h1) + demo + source viewer. */
export function LabsExperimentFrame({ experiment }: { experiment: LabExperiment }) {
  const { Demo } = experiment;

  return (
    <article className={styles.frame}>
      <header className={styles.frameHeader}>
        <FeatureHeader variant={experiment.accent} as="page">
          <FeatureHeaderTitle size="lg">{experiment.title}</FeatureHeaderTitle>
        </FeatureHeader>
        <p className={styles.description}>{experiment.description}</p>
        <div className={styles.tagRow}>
          {experiment.tags.map((tag) => (
            <span key={tag} className={styles.tagChip}>
              {tag}
            </span>
          ))}
        </div>
      </header>

      <Demo />

      <LabsCodeViewer sources={experiment.sources} />
    </article>
  );
}
