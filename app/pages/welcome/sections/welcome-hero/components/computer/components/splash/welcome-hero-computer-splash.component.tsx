import { Glyph } from "@/components/primitives/glyph/glyph.component";
import * as styles from "../../welcome-hero-computer.css";

const BOOT_STEPS = [
  "Initializing system...",
  "Loading modules...",
  "Calibrating sensors...",
  "Establishing connection...",
] as const;

const READY_STEP = "System ready.";

// Every step is in the markup and CSS reveals them in turn (splashStepStyles,
// keyed by :nth-child — keep BOOT_STEP_COUNT in sync):
// the sequence needs no JS and the prerendered HTML rests on "System ready.".
export function WelcomeHeroComputerSplash() {
  return (
    <div className={styles.splashStyles}>
      {BOOT_STEPS.map((step) => (
        <span key={step} className={styles.splashStepStyles}>
          {step}
          <Glyph className={styles.splashCursorStyles}>_</Glyph>
        </span>
      ))}
      <span className={styles.splashFinalStepStyles}>{READY_STEP}</span>
    </div>
  );
}
