import { Highlight, themes } from "prism-react-renderer";
import { memo, useState } from "react";
import type { LabSource } from "../../data/labs.types";
import * as styles from "./labs-code-viewer.css";

/** Highlighted code block, memoized so unrelated parent re-renders (e.g. the
 *  copy button toggling) don't re-tokenize the whole file. */
const CodeBlock = memo(function CodeBlock({ source }: { source: LabSource }) {
  return (
    <div className={styles.codeScroll}>
      <Highlight theme={themes.vsDark} code={source.code.trimEnd()} language={source.lang}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${styles.pre} ${className}`} style={style}>
            {tokens.map((tokenLine, lineIndex) => (
              <div key={lineIndex} {...getLineProps({ line: tokenLine })} className={styles.line}>
                <span className={styles.lineNumber}>{lineIndex + 1}</span>
                <span className={styles.lineContent}>
                  {tokenLine.map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
});

interface LabsCodeViewerProps {
  sources: LabSource[];
}

/** Syntax-highlighted source viewer with file tabs and a copy button. */
export function LabsCodeViewer({ sources }: LabsCodeViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const active = sources[activeIndex] ?? sources[0];
  if (!active) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(active.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — fail silently.
    }
  };

  return (
    <div className={styles.codeViewer}>
      <div className={styles.codeHeader}>
        <div className={styles.tabRow} role="tablist">
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
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.copyButton}
          data-copied={copied}
          onClick={handleCopy}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      <CodeBlock source={active} />
    </div>
  );
}
