import { colorTokens } from "@/styles/theme.css";
import { HERO_SPEC_SWATCHES } from "../../welcome-hero-spec-data";
import * as styles from "./welcome-hero-spec-swatches.css";

/** The palette, printed from theme.css.ts: chip, DESIGN.md name, raw OKLCH value. */
export function WelcomeHeroSpecSwatches() {
  return (
    <div aria-hidden="true" className={styles.welcomeHeroSpecSwatchesStyles}>
      {HERO_SPEC_SWATCHES.map(({ token, name }) => (
        <span key={token} className={styles.welcomeHeroSpecSwatchStyles}>
          <span className={styles.welcomeHeroSpecSwatchChipStyles[token]} />
          <span className={styles.welcomeHeroSpecSwatchTextStyles}>
            <span>{name}</span>
            <span>{colorTokens[token]}</span>
          </span>
        </span>
      ))}
    </div>
  );
}
