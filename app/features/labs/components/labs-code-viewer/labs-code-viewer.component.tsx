import { Highlight, themes } from "prism-react-renderer";
import { memo, useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import { siteStatus } from "@/features/site/data/site-status.data";
import { formatLineRange, type LabLineRange } from "../../data/labs-manual";
import type { LabSource, LabSourceRole } from "../../data/labs.types";
import type { LabSourceStats } from "../../data/labs-stats";
import * as styles from "./labs-code-viewer.css";

const ROLE_LABEL: Record<LabSourceRole, string> = {
  technique: "technique",
  styles: "styles",
  demo: "lab demo",
};

/** A line range the viewer shows lit, with the name of what cited it (`note 2`). */
export interface LabsCodeHighlight extends LabLineRange {
  label: string;
}

interface CodeBlockProps {
  source: LabSource;
  /** Lit lines of this file, 1-based inclusive, or null. */
  lit: { from: number; to: number } | null;
}

/** Highlighted code block, memoized so unrelated parent re-renders (e.g. the
 *  copy button toggling) don't re-tokenize the whole file. */
const CodeBlock = memo(function CodeBlock({ source, lit }: CodeBlockProps) {
  return (
    <Highlight theme={themes.vsDark} code={source.code.trimEnd()} language={source.lang}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`${styles.pre} ${className}`} style={style}>
          {/* Prism tokens are positional and re-derived from `code`: index keys are correct here. */}
          {tokens.map((tokenLine, lineIndex) => {
            const number = lineIndex + 1;
            const isLit = lit !== null && number >= lit.from && number <= lit.to;
            return (
              <div
                // oxlint-disable-next-line react/no-array-index-key
                key={lineIndex}
                {...getLineProps({ line: tokenLine })}
                className={styles.line}
                data-line={number}
                data-lit={isLit || undefined}
              >
                <span className={styles.lineNumber}>{number}</span>
                <span className={styles.lineContent}>
                  {tokenLine.map((token, tokenIndex) => (
                    // oxlint-disable-next-line react/no-array-index-key
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
});

/**
 * The file as plain text: what the page prerenders and hydrates. Prism's per-token tree is
 * thousands of nodes for a large file; it replaces this once the viewer nears the screen.
 */
function PlainBlock({ source }: { source: LabSource }) {
  return (
    <pre className={styles.pre}>
      <code className={styles.plain}>{source.code.trimEnd()}</code>
    </pre>
  );
}

interface LabsCodeViewerProps {
  sources: LabSource[];
  /** Lines and sizes per source, for the status bar (same order as `sources`). */
  stats?: readonly LabSourceStats[];
  /** Lines a `man` page reference points at: the viewer opens that file on them. */
  highlight?: LabsCodeHighlight | null;
}

/** Syntax-highlighted source viewer with file tabs, a copy button and a status bar. */
export function LabsCodeViewer({ sources, stats, highlight = null }: LabsCodeViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [shownHighlight, setShownHighlight] = useState<LabsCodeHighlight | null>(null);
  const { ref: viewerRef, isIntersecting: nearScreen } = useIntersectionObserver<HTMLDivElement>({
    rootMargin: "800px 0px",
  });
  const [highlighted, setHighlighted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tokenize once, the first time the viewer comes near the screen (or is cited).
  if (!highlighted && (nearScreen || highlight)) setHighlighted(true);

  // A new reference opens its file (state adjusted while rendering, not in an effect).
  if (highlight !== shownHighlight) {
    setShownHighlight(highlight);
    if (highlight) setActiveIndex(highlight.sourceIndex);
  }

  const active = sources[activeIndex] ?? sources[0];
  const lit = highlight && highlight.sourceIndex === activeIndex ? highlight : null;

  // Bring the cited lines into view: the editor on the page, then the lines in the editor.
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!highlight || !scroller) return;
    const line = scroller.querySelector<HTMLElement>(`[data-line="${highlight.from}"]`);
    if (line) {
      const offset = line.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
      scroller.scrollTop = Math.max(0, scroller.scrollTop + offset - scroller.clientHeight / 4);
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The scroller's parent is the viewer.
    scroller.parentElement?.scrollIntoView?.({
      block: "nearest",
      behavior: reduce ? "auto" : "smooth",
    });
  }, [highlight]);

  if (!active) return null;
  const activeStats = stats?.[activeIndex];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(active.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — fail silently.
    }
  };

  const anchor = lit ? `#L${lit.from}-L${lit.to}` : "";

  return (
    <div ref={viewerRef} className={styles.codeViewer}>
      <div className={styles.codeHeader}>
        <span className={styles.lights} aria-hidden="true" />
        <div className={styles.tabRow} role="tablist" aria-label="Source files">
          {sources.map((source, index) => (
            <button
              key={source.label}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              className={styles.tab}
              data-active={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              {source.label}
              <span className={styles.tabRole} aria-hidden="true">
                {ROLE_LABEL[source.role]}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.copyButton}
          data-copied={copied}
          aria-label={copied ? "Copied" : `Copy ${active.label}`}
          onClick={handleCopy}
        >
          {copied ? "_Copied ✓_" : "_Copy_"}
        </button>
      </div>

      <div ref={scrollRef} className={styles.codeScroll}>
        {highlighted ? <CodeBlock source={active} lit={lit} /> : <PlainBlock source={active} />}
      </div>

      <div className={styles.statusBar}>
        <span className={styles.statusFile}>
          {active.label}
          {activeStats && ` · ${activeStats.lines} lines · ${activeStats.size}`} · {active.lang}
        </span>
        {lit && (
          <span className={styles.statusRange}>
            {formatLineRange(lit)} · {lit.label}
          </span>
        )}
        <a
          className={styles.sourceLink}
          href={`${siteStatus.sourceUrl}/blob/main/${active.path}${anchor}`}
          target="_blank"
          rel="noreferrer"
        >
          _Source_ <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
