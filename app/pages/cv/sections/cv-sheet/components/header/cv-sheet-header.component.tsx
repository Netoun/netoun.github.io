import type { CvContact } from "../../../../data/cv-sheet.data";
import { CvSheetLogo } from "../logo/cv-sheet-logo.component";
import { CvSheetPrompt } from "../prompt/cv-sheet-prompt.component";
import * as styles from "./cv-sheet-header.css";

interface CvSheetHeaderProps {
  name: string;
  tagline: string;
  lead: string;
  contacts: CvContact[];
}

export function CvSheetHeader({ name, tagline, lead, contacts }: CvSheetHeaderProps) {
  return (
    <header className={styles.header}>
      <CvSheetLogo className={styles.logo} />
      <div className={styles.identity}>
        <h1 className={styles.name}>{name}</h1>
        <p className={styles.tagline}>{tagline}</p>
        <p className={styles.lead}>
          <CvSheetPrompt className={styles.prompt} />
          {lead}
          <span className={styles.cursor} aria-hidden="true" />
        </p>
      </div>
      <div className={styles.readout}>
        <p className={styles.user}>
          nicolas<span className={styles.at}>@</span>netoun
        </p>
        <span className={styles.underline} aria-hidden="true" />
        <dl className={styles.list}>
          {contacts.map((contact) => (
            <div key={contact.key} className={styles.row}>
              <dt className={styles.key}>{contact.key}</dt>
              <dd className={styles.value}>
                {contact.href ? (
                  <a href={contact.href} className={styles.link}>
                    {contact.value}
                  </a>
                ) : (
                  contact.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
