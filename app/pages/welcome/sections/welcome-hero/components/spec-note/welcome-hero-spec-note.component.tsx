import clsx from "clsx";
import type { Ref } from "react";
import type { HeroSpecGroup } from "../../welcome-hero-spec-data";
import { heroSpecGroup, heroSpecShown } from "../../welcome-hero-spec.css";
import * as styles from "./welcome-hero-spec-note.css";

interface WelcomeHeroSpecNoteProps {
  group: HeroSpecGroup;
  /** Measured lines; nothing renders until they exist. */
  lines: readonly string[] | undefined;
  /** Positions the note and sets `specNoteDelay`. */
  className: string;
  /** Colours the first line (the note's title). */
  accent?: keyof typeof styles.welcomeHeroSpecNoteAccentStyles;
  /** A line whose text is rewritten outside React (e.g. every tilt frame). */
  liveLine?: { index: number; ref: Ref<HTMLSpanElement> };
}

/** A spec annotation: a few lines of the code voice that type in when the spec turns on. */
export function WelcomeHeroSpecNote({
  group,
  lines,
  className,
  accent,
  liveLine,
}: WelcomeHeroSpecNoteProps) {
  if (!lines?.length) return null;

  return (
    <span
      aria-hidden="true"
      className={clsx(
        styles.welcomeHeroSpecNoteStyles,
        heroSpecGroup[group],
        heroSpecShown.flex,
        accent && styles.welcomeHeroSpecNoteAccentStyles[accent],
        className,
      )}
    >
      {lines.map((line, index) => (
        <span
          key={line}
          ref={liveLine?.index === index ? liveLine.ref : undefined}
          className={styles.welcomeHeroSpecNoteLineStyles}
        >
          {line}
        </span>
      ))}
    </span>
  );
}
