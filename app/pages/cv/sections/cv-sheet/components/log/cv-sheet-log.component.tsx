import type { CvJob } from "../../../../data/cv-sheet.data";
import { CvSheetLane } from "../lane/cv-sheet-lane.component";
import { CvSheetTools } from "../tools/cv-sheet-tools.component";
import * as styles from "./cv-sheet-log.css";

interface CvSheetLogProps {
  jobs: CvJob[];
}

/** One lane per employer in its stack's colour, the client projects as commits on a second. */
export function CvSheetLog({ jobs }: CvSheetLogProps) {
  return (
    <ol className={styles.log}>
      {jobs.map((job, index) => (
        <li key={job.slug} className={styles.job}>
          <CvSheetLane domain={job.domain} isRoot={index === jobs.length - 1} />
          <div className={styles.body}>
            <div className={styles.head}>
              <h3 className={styles.who}>
                <span className={styles.company}>{job.company}</span> {job.role}
                {job.isOpen && <span className={styles.headRef}>HEAD</span>}
              </h3>
              <p className={styles.period}>
                {job.period} · {job.duration}
              </p>
            </div>
            <p className={styles.text}>{job.text}</p>
            {job.tools.length > 0 && (
              <CvSheetTools tools={job.tools} label={`${job.company} stack`} />
            )}
            {job.clients.length > 0 && (
              <ul className={styles.clients}>
                {job.clients.map((client) => (
                  <li key={client.title} className={styles.client}>
                    <CvSheetLane domain={client.domain} />
                    <div>
                      <p className={styles.text}>
                        <span className={styles.clientTitle}>{client.title}</span> — {client.text}
                      </p>
                      <CvSheetTools tools={client.tools} label={`${client.title} stack`} />
                    </div>
                  </li>
                ))}
                {(job.foldedClients || job.moreClients) && (
                  <li className={styles.more}>
                    <span className={styles.elision} aria-hidden="true" />
                    <span>
                      {[job.foldedClients, job.moreClients ? "more client work, not listed" : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </li>
                )}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
