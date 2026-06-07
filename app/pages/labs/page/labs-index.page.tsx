import { Link } from "react-router";
import { LabsIsoIcon } from "@/features/labs/components/labs-iso-icon/labs-iso-icon.component";
import { labs } from "@/features/labs/data/experiments";
import * as styles from "./labs-index.page.css";

export function meta() {
  return labs.buildIndexMeta();
}

export default function LabsIndexPage() {
  const experiments = labs.getAll();

  return (
    <div className={styles.landing}>
      <header className={styles.header}>
        <h1 className={styles.title}>Interactive experiments &amp; their source</h1>
        <p className={styles.intro}>
          A playground for the 3D, canvas and shader pieces scattered across this site — each one
          isolated as a live, tweakable demo with its source code in plain sight.
        </p>
      </header>

      <div className={styles.grid}>
        {experiments.map((experiment) => (
          <Link
            key={experiment.slug}
            to={`/labs/${experiment.slug}`}
            className={styles.card}
            data-accent={experiment.accent}
          >
            <span className={styles.cardCornerTL} aria-hidden="true" />
            <span className={styles.cardCornerBR} aria-hidden="true" />
            <div className={styles.cardHead}>
              <span className={styles.cardIcon} aria-hidden="true">
                <LabsIsoIcon slug={experiment.slug} scale={8} />
              </span>
              <span className={styles.cardGroup}>{experiment.group}</span>
            </div>
            <h2 className={styles.cardTitle}>{experiment.title}</h2>
            <p className={styles.cardDesc}>{experiment.description}</p>
            <span className={styles.cardCta} aria-hidden="true">
              <span className={styles.cardCtaPrompt}>❯</span>
              open experiment
              <span className={styles.cardCtaArrow}>⤘</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
