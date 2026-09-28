import { setElementVars } from "@vanilla-extract/dynamic";
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import * as styles from "./labs-preview.css";

export type LabsView = "full" | "preview";

const LabsViewContext = createContext<LabsView>("full");

/** How the demo is being shown: its full page (stage + controls) or a preview (stage only). */
export function useLabsView(): LabsView {
  return useContext(LabsViewContext);
}

interface LabsPreviewProps {
  /** An experiment's `Demo`, rendered without its controls. */
  children: ReactNode;
}

/** Renders a demo in preview mode: every `LabsDemoLayout` inside it shows its stage only. */
export function LabsPreview({ children }: LabsPreviewProps) {
  return <LabsViewContext.Provider value="preview">{children}</LabsViewContext.Provider>;
}

/** Fits a demo's stage into the box around it, at its own size or smaller, never larger. */
export function LabsPreviewFit({ children }: { children: ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const viewport = viewportRef.current;
    if (!box || !viewport) return;

    const fit = () => {
      // offset sizes ignore the transform: they are the stage's own, unscaled.
      const content = viewport.firstElementChild;
      const width = content instanceof HTMLElement ? content.offsetWidth : 0;
      const height = content instanceof HTMLElement ? content.offsetHeight : 0;
      if (!width || !height || !box.clientWidth || !box.clientHeight) return;
      const scale = Math.min(box.clientWidth / width, box.clientHeight / height, 1) * 0.92;
      setElementVars(viewport, { [styles.previewScale]: scale.toFixed(4) });
    };

    const observer = new ResizeObserver(fit);
    observer.observe(box);
    if (viewport.firstElementChild) observer.observe(viewport.firstElementChild);
    fit();
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={boxRef} className={styles.boxStyle}>
      <div ref={viewportRef} className={styles.viewportStyle}>
        {children}
      </div>
    </div>
  );
}
