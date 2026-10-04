import { Link } from "react-router";
import { Glyph } from "@/components/primitives/glyph/glyph.component";
import { RESUME_FILE, RESUME_HREF } from "@/features/site/data/resume.data";
import * as styles from "./cv-toolbar.css";

export function CvToolbarSection() {
  return (
    <div className={styles.toolbar}>
      <nav aria-label="Breadcrumb">
        <ol className={styles.path}>
          <li>
            <Link to="/" className={styles.link}>
              <Glyph>❮</Glyph>
              netoun.com
            </Link>
          </li>
          <li>
            <span className={styles.separator} aria-hidden="true">
              /
            </span>
            <span className={styles.current} aria-current="page">
              cv
            </span>
          </li>
        </ol>
      </nav>
      <a href={RESUME_HREF} download={RESUME_FILE} className={styles.link}>
        Download PDF <Glyph>↓</Glyph>
      </a>
    </div>
  );
}
