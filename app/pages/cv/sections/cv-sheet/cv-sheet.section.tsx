import { siteStatus } from "@/features/site/data/site-status.data";
import { cvFingerprint, toCvSheet } from "../../data/cv-sheet.data";
import { CvSheetEducation } from "./components/education/cv-sheet-education.component";
import { CvSheetHeader } from "./components/header/cv-sheet-header.component";
import { CvSheetLog } from "./components/log/cv-sheet-log.component";
import { CvSheetPointer } from "./components/pointer/cv-sheet-pointer.component";
import { CvSheetPractices } from "./components/practices/cv-sheet-practices.component";
import { CvSheetProcesses } from "./components/processes/cv-sheet-processes.component";
import { CvSheetStack } from "./components/stack/cv-sheet-stack.component";
import { CvSheetStatus } from "./components/status/cv-sheet-status.component";
import { CvSheetTitle } from "./components/title/cv-sheet-title.component";
import * as styles from "./cv-sheet.css";

// The page is a printout of the build: its durations count to the build's month, so the
// prerender, the hydration and the PDF all print the same sheet.
const BUILD_MONTH = __BUILD_DATE__.slice(0, 7);

/**
 * The résumé as one A4 sheet, each block in the machine its home section runs. `generate-cv`
 * prints it to the PDF; `data-cv-page` is what it measures, `data-cv-fingerprint` what it stores.
 */
export function CvSheetSection() {
  const sheet = toCvSheet(BUILD_MONTH);

  return (
    <div className={styles.frame}>
      <article className={styles.sheet} data-cv-fingerprint={cvFingerprint()}>
        <div className={styles.page} data-cv-page>
          <CvSheetHeader
            name={sheet.name}
            tagline={sheet.tagline}
            lead={sheet.lead}
            contacts={sheet.contacts}
          />
          <div className={styles.rule} />
          <div className={styles.columns}>
            <div className={styles.column}>
              <section className={styles.block} aria-labelledby="cv-experience">
                <CvSheetTitle id="cv-experience" command="git log --graph">
                  Experience
                </CvSheetTitle>
                <CvSheetLog jobs={sheet.jobs} />
              </section>
              <section className={styles.block} aria-labelledby="cv-projects">
                <CvSheetTitle id="cv-projects" command="netoun ps --projects">
                  Projects
                </CvSheetTitle>
                <CvSheetProcesses projects={sheet.projects} />
              </section>
            </div>
            <div className={styles.column}>
              <section className={styles.block} aria-labelledby="cv-stack">
                <CvSheetTitle id="cv-stack">Stack</CvSheetTitle>
                <CvSheetStack groups={sheet.stack} />
              </section>
              <section className={styles.block} aria-labelledby="cv-practices">
                <CvSheetTitle id="cv-practices">Agents &amp; LLM</CvSheetTitle>
                <CvSheetPractices practices={sheet.practices} />
              </section>
              <section className={styles.block} aria-labelledby="cv-education">
                <CvSheetTitle id="cv-education">Education</CvSheetTitle>
                <CvSheetEducation education={sheet.education} />
              </section>
              <CvSheetPointer className={styles.pointer} labsCount={sheet.labsCount} />
            </div>
          </div>
          <CvSheetStatus
            host={siteStatus.host}
            buildDate={siteStatus.buildDate}
            commit={siteStatus.commit}
            sourceUrl={siteStatus.sourceUrl}
          />
        </div>
      </article>
    </div>
  );
}
