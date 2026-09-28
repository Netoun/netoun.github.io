import type { ReactNode } from "react";
import { useParams } from "react-router";
import { Container } from "@/components/layouts/container/container.component";
import { labs } from "../../data/experiments";
import { LabsDock } from "../labs-dock/labs-dock.component";
import { LabsPathLine } from "../labs-path-line/labs-path-line.component";
import * as styles from "./labs-shell.css";

interface LabsShellProps {
  children: ReactNode;
  /** The closing panel, owned by the page (it carries the site's contact data). */
  footer: ReactNode;
  /** The footer's id: the dock steps away while it is on screen. */
  footerId: string;
}

/**
 * The Labs pages on the home's paper: the path line home, the page in the home column, the
 * footer, and the ink dock that moves between experiments.
 */
export function LabsShell({ children, footer, footerId }: LabsShellProps) {
  const { slug } = useParams();
  const current = labs.getBySlug(slug);

  return (
    <div className={styles.shellStyle}>
      {/* First in the tab order, as the home's sections nav is. */}
      <LabsDock
        experiments={labs.getAll()}
        currentSlug={current?.slug}
        hideWhenVisibleId={footerId}
      />
      <main className={styles.mainStyle}>
        <Container>
          <LabsPathLine slug={current?.slug} />
          {children}
        </Container>
      </main>
      {footer}
    </div>
  );
}
