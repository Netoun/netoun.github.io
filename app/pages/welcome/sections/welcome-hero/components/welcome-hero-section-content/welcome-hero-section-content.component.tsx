import clsx from "clsx";
import { Link } from "react-router";
import { useWelcomeHeroSpec } from "../../hooks/use-welcome-hero-spec.hook";
import { heroSpecGroup } from "../../welcome-hero-spec.css";
import { WelcomeHeroContactHoverCard } from "../contact-hover-card/welcome-hero-contact-hover-card.component";
import { WelcomeHeroSpecNote } from "../spec-note/welcome-hero-spec-note.component";
import { WelcomeHeroSpecSwatches } from "../spec-swatches/welcome-hero-spec-swatches.component";
import * as styles from "./welcome-hero-section-content.css";
import { Glyph } from "@/components/primitives/glyph/glyph.component";

// The entrance is CSS (see welcome-hero-section-content.css.ts): it starts at
// first paint, before hydration, so nothing already painted is ever hidden again.
export function WelcomeHeroSectionContent() {
  const spec = useWelcomeHeroSpec();

  return (
    <div className={styles.welcomeContentStyle}>
      <div className={clsx(styles.welcomeHeadingBlockStyles, heroSpecGroup.heading)}>
        <h1 className={styles.welcomeHeadingStyles} data-spec-target="heading">
          Hi, I&apos;m Nicolas.
          <br />
          Full-stack engineer &amp; creative developer.
        </h1>
        <WelcomeHeroSpecNote
          group="heading"
          lines={spec?.heading}
          className={styles.welcomeHeadingNoteStyles}
          accent="mint"
        />
      </div>

      <div className={clsx(styles.welcomeDescriptionBlockStyles, heroSpecGroup.lead)}>
        <p className={styles.welcomeDescriptionStyles} data-spec-target="lead">
          <Glyph>
            <b>_</b>❯
          </Glyph>{" "}
          I build fast, polished web products with TypeScript, React and NestJS — from expressive
          interfaces to robust backend systems. Currently building at{" "}
          <a
            className={styles.welcomeLinkStyles}
            href="https://www.lonestone.io"
            target="_blank"
            rel="noreferrer"
          >
            Lonestone
          </a>
          .<Glyph className={styles.welcomeDescriptionCursorStyles}>▐</Glyph>
        </p>
        <WelcomeHeroSpecNote
          group="lead"
          lines={spec?.lead}
          className={styles.welcomeDescriptionNoteStyles}
        />
      </div>

      <div className={styles.welcomeActionsStyles}>
        <WelcomeHeroContactHoverCard />
        <Link to="/labs/" className={styles.welcomeLabsLinkStyles}>
          Explore the Labs <span aria-hidden="true">→</span>
        </Link>
        <WelcomeHeroSpecNote
          group="cta"
          lines={spec?.cta}
          className={styles.welcomeActionsNoteStyles}
          accent="gold"
        />
      </div>

      <WelcomeHeroSpecSwatches />
    </div>
  );
}
