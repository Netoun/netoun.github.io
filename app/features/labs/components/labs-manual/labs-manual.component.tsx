import { Link } from "react-router";
import { Button } from "@/components/primitives/button/button.component";
import { Glyph } from "@/components/primitives/glyph/glyph.component";
import { formatLineRange, resolveSourceRef, splitCode } from "../../data/labs-manual";
import type { LabExperiment, LabNote } from "../../data/labs.types";
import type { LabsCodeHighlight } from "../labs-code-viewer/labs-code-viewer.component";
import * as styles from "./labs-manual.css";

interface LabsManualProps {
  experiment: LabExperiment;
  /** Key of the reference whose lines the source viewer shows, or null. */
  citedKey: string | null;
  onCite: (key: string, highlight: LabsCodeHighlight) => void;
}

function NoteText({ body }: { body: string }) {
  return splitCode(body).map((part, index) =>
    part.code ? (
      // Parts are positional slices of one string: index keys are correct here.
      // oxlint-disable-next-line react/no-array-index-key
      <code key={index} className={styles.code}>
        {part.text}
      </code>
    ) : (
      part.text
    ),
  );
}

interface NoteListProps extends LabsManualProps {
  section: "how" | "cost";
  notes: LabNote[];
}

function NoteList({ experiment, citedKey, onCite, section, notes }: NoteListProps) {
  const numbered = section === "how";
  return (
    <ol className={styles.notes}>
      {notes.map((note, noteIndex) => {
        const refs = (note.refs ?? []).flatMap((ref, refIndex) => {
          const range = resolveSourceRef(experiment.sources, ref);
          return range
            ? [{ key: `${section}-${noteIndex}-${refIndex}`, range, file: ref.source }]
            : [];
        });
        const isCited = refs.some((ref) => ref.key === citedKey);
        const label = numbered ? `note ${noteIndex + 1}` : `cost ${noteIndex + 1}`;
        return (
          <li key={note.lead} className={styles.note} data-cited={isCited || undefined}>
            <span className={styles.noteNumber} aria-hidden="true">
              _{numbered ? noteIndex + 1 : ""}
            </span>
            <p className={styles.noteText}>
              <strong className={styles.lead}>{note.lead}</strong> <NoteText body={note.body} />
            </p>
            {refs.length > 0 && (
              <span className={styles.refs}>
                {refs.map((ref) => (
                  <Button
                    key={ref.key}
                    className={styles.ref}
                    onPress={() => onCite(ref.key, { ...ref.range, label })}
                  >
                    <span aria-hidden="true">
                      {formatLineRange(ref.range)} <span className={styles.refArrow}>↓</span>
                    </span>
                    <span className={styles.srOnly}>
                      Show lines {ref.range.from} to {ref.range.to} of {ref.file}
                    </span>
                  </Button>
                ))}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * The experiment's `man` page, printed on the paper: what it is, how the technique works, what
 * it costs. Each line reference opens those lines in the source viewer below.
 */
export function LabsManual(props: LabsManualProps) {
  const { experiment } = props;
  const manual = experiment.manual;
  if (!manual) return null;
  const titleId = `man-${experiment.slug}`;

  return (
    <section className={styles.manual} aria-labelledby={titleId}>
      <div className={styles.head}>
        <h2 id={titleId} className={styles.command}>
          <Glyph className={styles.prompt}>_❯</Glyph>
          <span>man {experiment.slug}</span>
          <Glyph className={styles.cursor}>▐</Glyph>
        </h2>
        <p className={styles.legend}>A line ref opens it in the source below</p>
      </div>

      <div className={styles.page}>
        <h3 className={styles.heading}>Name</h3>
        <p className={styles.name}>
          <code className={styles.code}>{experiment.slug}</code> — {manual.name}
        </p>

        <h3 className={styles.heading}>How it works</h3>
        <NoteList {...props} section="how" notes={manual.how} />

        <h3 className={styles.heading}>Cost</h3>
        <NoteList {...props} section="cost" notes={manual.cost} />

        {manual.seeAlso && manual.seeAlso.length > 0 && (
          <>
            <h3 className={styles.heading}>See also</h3>
            <ul className={styles.seeAlso}>
              {manual.seeAlso.map((link) => (
                <li key={link.slug}>
                  <Link to={`/labs/${link.slug}/`} className={styles.seeAlsoLink}>
                    {link.slug}
                  </Link>{" "}
                  — {link.text}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
