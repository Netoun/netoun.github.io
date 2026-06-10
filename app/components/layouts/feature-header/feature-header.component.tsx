import { animate } from "animejs";
import { createContext, useEffect, useRef, use } from "react";
import * as styles from "./feature-header.css";

type AccentVariant = "primary" | "secondary" | "tertiary";
type TitleSize = "sm" | "md" | "lg";
type HeaderVariant = "section" | "page";

interface FeatureHeaderContextValue {
  variant: AccentVariant;
}

const FeatureHeaderContext = createContext<FeatureHeaderContextValue>({
  variant: "primary",
});

interface FeatureHeaderProps {
  children: React.ReactNode;
  variant?: AccentVariant;
  as?: HeaderVariant;
}

export function FeatureHeader({
  children,
  variant = "primary",
  as = "section",
}: FeatureHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Page headers (labs) are visible at load: keep the mount animation.
  // Section headers reveal on viewport entry via ContentSection's [data-reveal].
  useEffect(() => {
    if (as !== "page") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (containerRef.current) {
      animate(containerRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        ease: "outQuad",
        duration: 600,
      });
    }
  }, [as]);

  return (
    <FeatureHeaderContext.Provider value={{ variant }}>
      <div ref={containerRef} className={styles.containerStyle({ variant: as })}>
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
  const { variant } = use(FeatureHeaderContext);

  const Tag = size === "lg" ? "h1" : "h2";

  return (
    <Tag className={styles.titleStyle({ size, variant })} data-reveal-item>
      <span className={styles.prefixStyle({ variant })}>_❯</span>
      {children}
      <span className={styles.cursorStyle({ variant })} />
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
