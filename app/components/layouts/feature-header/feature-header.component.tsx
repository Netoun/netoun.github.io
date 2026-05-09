import { animate } from "animejs";
import { createContext, useContext, useEffect, useRef } from "react";
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

  useEffect(() => {
    if (containerRef.current) {
      animate(containerRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        ease: "outQuad",
        duration: 600,
      });
    }
  }, []);

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
  const { variant } = useContext(FeatureHeaderContext);

  const Tag = size === "lg" ? "h1" : "h2";

  return (
    <Tag className={styles.titleStyle({ size, variant })}>
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
  return <p className={styles.descriptionStyle}>{children}</p>;
}
