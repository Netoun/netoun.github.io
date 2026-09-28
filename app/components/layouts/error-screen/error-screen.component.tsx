import clsx from "clsx";
import { Link } from "react-router";
import { Glyph } from "@/components/primitives/glyph/glyph.component";
import { Container } from "../container/container.component";
import * as styles from "./error-screen.css";

export interface ErrorScreenLink {
  label: string;
  to: string;
  /** Lights a gold LED on the link: the page points the visitor to it. */
  isLit?: boolean;
}

export interface ErrorScreenProps {
  /** Status printed above the title (`404`). */
  code: string;
  title: string;
  /** The command that failed and what the shell answered, drawn for the eye only. */
  command: string;
  output: string;
  /** What happened, in words: the part screen readers get. */
  children: React.ReactNode;
  links: ErrorScreenLink[];
  /** Dev builds only: the thrown error's stack. */
  stack?: string;
  /** Something to do while here (the 404's game): beside the message from `xl`, under it below. */
  aside?: React.ReactNode;
}

/**
 * A page that failed, on the paper: the failing command on a small ink terminal, the shell's
 * answer, then the title and the ways back. The routes come from the caller.
 */
export function ErrorScreen({
  code,
  title,
  command,
  output,
  children,
  links,
  stack,
  aside,
}: ErrorScreenProps) {
  return (
    <main className={styles.pageStyle}>
      <Container className={clsx(styles.layoutStyle, aside && styles.splitStyle)}>
        <div className={styles.contentStyle}>
          <div className={styles.shellStyle} aria-hidden="true">
            <p className={styles.terminalStyle}>
              <span className={styles.promptStyle}>_❯</span>
              <span className={styles.commandStyle}>{command}</span>
              <span className={styles.cursorStyle}>▐</span>
            </p>
            <p className={styles.outputStyle}>{output}</p>
          </div>

          <p className={styles.codeStyle}>{code}</p>
          <h1 className={styles.titleStyle}>{title}</h1>
          <div className={styles.detailsStyle}>{children}</div>

          {/* The first way back is the main one, marked like the hero's `_Get in touch_`. */}
          <nav aria-label="Ways back" className={styles.linksStyle}>
            {links.map((link, index) => (
              <Link
                key={link.to}
                to={link.to}
                className={styles.linkStyle({ primary: index === 0 })}
              >
                {link.isLit && <span className={styles.litStyle} aria-hidden="true" />}
                {index === 0 && <Glyph>_</Glyph>}
                {link.label}
                {index === 0 ? <Glyph>_</Glyph> : <Glyph> →</Glyph>}
              </Link>
            ))}
          </nav>

          {stack && (
            <pre className={styles.stackStyle}>
              <code>{stack}</code>
            </pre>
          )}
        </div>
        {aside}
      </Container>
    </main>
  );
}
