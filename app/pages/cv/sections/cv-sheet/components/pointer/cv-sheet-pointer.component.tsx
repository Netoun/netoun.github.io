import { SITE_URL } from "@/features/site/data/site";
import { CvSheetPrompt } from "../prompt/cv-sheet-prompt.component";
import * as styles from "./cv-sheet-pointer.css";

interface CvSheetPointerProps {
  labsCount: number;
  className?: string;
}

/** The page ends where the site begins: what a sheet cannot hold is one command away. */
export function CvSheetPointer({ labsCount, className }: CvSheetPointerProps) {
  const host = new URL(SITE_URL).hostname;

  return (
    <section className={className} aria-label={`More on ${host}`}>
      <div className={styles.pointer}>
        <a href={`${SITE_URL}/`} className={styles.command}>
          <CvSheetPrompt className={styles.prompt} />
          <span>open {host}</span>
          <span className={styles.cursor} aria-hidden="true" />
        </a>
        <p className={styles.text}>
          More on the site: the full work log, the source code and {labsCount} live Labs.
        </p>
      </div>
    </section>
  );
}
