import { animate } from "animejs";
import { createContext, useEffect, useMemo, useRef, use } from "react";
import { Glyph } from "@/components/primitives/glyph/glyph.component";
import * as styles from "./feature-header.css";

type AccentVariant = "primary" | "secondary" | "tertiary";
type TitleSize = "sm" | "md" | "lg";
type HeaderVariant = "section" | "page";

interface FeatureHeaderContextValue {
  variant: AccentVariant;
  headerVariant: HeaderVariant;
}

const FeatureHeaderContext = createContext<FeatureHeaderContextValue>({
  variant: "primary",
  headerVariant: "section",
});

interface FeatureHeaderProps {
  children: React.ReactNode;
  variant?: AccentVariant;
  as?: HeaderVariant;
  /** Terminal section numbering — renders `_0N /` above the title */
  index?: number;
}

export function FeatureHeader({
  children,
  variant = "primary",
  as = "section",
  index,
}: FeatureHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Page headers (labs) are visible at load: keep the mount animation.
  // Section headers reveal on viewport entry via ContentSection's [data-reveal].
  useEffect(() => {
    if (as !== "page") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const container = containerRef.current;
    if (!container) return;
    const animation = animate(container, {
      opacity: [0, 1],
      translateY: [20, 0],
      ease: "outQuad",
      duration: 600,
    });
    return () => {
      animation.cancel();
    };
  }, [as]);

  const contextValue = useMemo(() => ({ variant, headerVariant: as }), [variant, as]);

  return (
    <FeatureHeaderContext.Provider value={contextValue}>
      <div ref={containerRef} className={styles.containerStyle({ variant: as })}>
        {index !== undefined && (
          // The heading says the section; the terminal number is for the eye.
          <span className={styles.indexStyle} data-reveal-item aria-hidden="true">
            _{String(index).padStart(2, "0")} /
          </span>
        )}
        {children}
      </div>
    </FeatureHeaderContext.Provider>
  );
}

interface FeatureHeaderTitleProps {
  children: string;
  size?: TitleSize;
}

export function FeatureHeaderTitle({ children, size = "lg" }: FeatureHeaderTitleProps) {
  const { variant, headerVariant } = use(FeatureHeaderContext);

  // Heading level follows the header's role, not its visual size:
  // one h1 per page (hero/page headers), sections are h2.
  const Tag = headerVariant === "page" ? "h1" : "h2";

  return (
    <Tag className={styles.titleStyle({ size })} data-reveal-item>
      <Glyph className={styles.prefixStyle({ variant })}>_❯</Glyph>
      {children}
    </Tag>
  );
}

interface FeatureHeaderDescriptionProps {
  children: string;
}

export function FeatureHeaderDescription({ children }: FeatureHeaderDescriptionProps) {
  return (
    <p className={styles.descriptionStyle} data-reveal-item>
      {children}
    </p>
  );
}
