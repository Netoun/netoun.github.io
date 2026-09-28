import * as styles from "./welcome-hero-scroll-morph.css";

interface WelcomeHeroScrollMorphProps {
  children: React.ReactNode;
}

// Pure CSS: a scroll-driven clip-path (see welcome-hero-scroll-morph.css.ts). No
// scroll listener, no measurement, identical before and after hydration.
export function WelcomeHeroScrollMorph({ children }: WelcomeHeroScrollMorphProps) {
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
