import * as styles from "./hero-scroll-morph.css";

interface HeroScrollMorphProps {
  children: React.ReactNode;
}

// Pure CSS: a scroll-driven clip-path (see hero-scroll-morph.css.ts). No
// scroll listener, no measurement, identical before and after hydration.
export function HeroScrollMorph({ children }: HeroScrollMorphProps) {
  return (
    <div className={styles.heroScrollMorphWrapper}>
      <div className={styles.heroMorphStage}>
        <div className={styles.heroMorphFrame}>
          <div className={styles.heroMorphContent}>{children}</div>
        </div>
      </div>
    </div>
  );
}
