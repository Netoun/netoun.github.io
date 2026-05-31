import { Link } from "react-router";
import {
  FeatureHeader,
  FeatureHeaderDescription,
  FeatureHeaderTitle,
} from "@/components/layouts/feature-header/feature-header.component";
import { EXPERIMENTS } from "@/features/labs/data/experiments";
import { buildLabsIndexMeta } from "@/features/labs/data/labs-seo";
import * as styles from "./labs-index.page.css";

export function meta() {
  return buildLabsIndexMeta();
}

export default function LabsIndexPage() {
  return (
    <div className={styles.landing}>
      <FeatureHeader variant="primary" as="page">
        <FeatureHeaderTitle size="lg">LABS</FeatureHeaderTitle>
        <FeatureHeaderDescription>Interactive experiments &amp; their source</FeatureHeaderDescription>
      </FeatureHeader>

      <p className={styles.intro}>
        A playground for the 3D, canvas and shader pieces scattered across this site — each one
        isolated as a live, tweakable demo with its source code in plain sight.
      </p>

      <div className={styles.grid}>
        {EXPERIMENTS.map((experiment) => (
          <Link
            key={experiment.slug}
            to={`/labs/${experiment.slug}`}
            className={styles.card}
            data-accent={experiment.accent}
          >
            <span className={styles.cardIcon} aria-hidden="true">
              {experiment.icon}
            </span>
            <span className={styles.cardGroup}>{experiment.group}</span>
            <h2 className={styles.cardTitle}>{experiment.title}</h2>
            <p className={styles.cardDesc}>{experiment.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
