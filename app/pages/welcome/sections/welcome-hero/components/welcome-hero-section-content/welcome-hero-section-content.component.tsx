import { useLayoutEffect, useRef } from "react";
import { useWelcomeHeroContentAnimation } from "../../hooks/use-welcome-hero-content-animation.hook";
import { WelcomeHeroContactHoverCard } from "../contact-hover-card/welcome-hero-contact-hover-card.component";
import * as styles from "./welcome-hero-section-content.css";

export function WelcomeHeroSectionContent() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const { startAnimation } = useWelcomeHeroContentAnimation();

  useLayoutEffect(() => {
    const heading = headingRef.current;
    const description = descriptionRef.current;
    const button = buttonRef.current;

    if (!heading || !description || !button) return;

    startAnimation({
      welcomeHeading: heading,
      welcomeDescription: description,
      welcomeButton: button,
    });
  }, []);

  return (
    <div className={styles.welcomeContentStyle}>
      <h1 ref={headingRef} className={styles.welcomeHeadingStyles}>
        Hi, I&apos;m Nicolas.
        <br />
        Full-stack engineer &amp; creative developer.
      </h1>

      <p ref={descriptionRef} className={styles.welcomeDescriptionStyles}>
        <b>_</b>❯ I build fast, polished web products — from expressive interfaces to robust backend
        systems. Currently building at{" "}
        <a
          className={styles.welcomeLinkStyles}
          href="https://www.lonestone.io"
          target="_blank"
          rel="noreferrer"
        >
          Lonestone
        </a>
        .<span className={styles.welcomeDescriptionCursorStyles}>▐</span>
      </p>

      <div className={styles.welcomeMetaStyles}>
        <span>Focused on performance, UX, and clean architecture</span>
      </div>

      <div ref={buttonRef}>
        <WelcomeHeroContactHoverCard />
      </div>
    </div>
  );
}
