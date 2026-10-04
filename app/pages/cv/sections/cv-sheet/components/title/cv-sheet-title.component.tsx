import { CvSheetPrompt } from "../prompt/cv-sheet-prompt.component";
import * as styles from "./cv-sheet-title.css";

interface CvSheetTitleProps {
  id: string;
  children: React.ReactNode;
  /** The command the home's section runs (`git log --graph`), printed on the right. */
  command?: string;
}

export function CvSheetTitle({ id, children, command }: CvSheetTitleProps) {
  return (
    <div className={styles.head}>
      <h2 id={id} className={styles.title}>
        <CvSheetPrompt className={styles.prompt} />
        {children}
      </h2>
      {command && (
        <span className={styles.command} aria-hidden="true">
          {command}
        </span>
      )}
    </div>
  );
}
