import type { ReactNode } from "react";
import { Container } from "@/components/layouts/container/container.component";
import {
  FeatureHeader,
  FeatureHeaderTitle,
  FeatureHeaderDescription,
} from "@/components/layouts/feature-header/feature-header.component";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";

type HeaderVariant = "primary" | "secondary" | "tertiary";

interface ContentSectionState {
  shouldAnimate: boolean;
}

interface ContentSectionProps {
  title: string;
  description: string;
  variant?: HeaderVariant;
  className?: string;
  contentClassName?: string;
  threshold?: number;
  children: ReactNode | ((state: ContentSectionState) => ReactNode);
}

export function ContentSection({
  title,
  description,
  variant = "primary",
  className,
  contentClassName,
  threshold = 0.1,
  children,
}: ContentSectionProps) {
  const { ref: sectionRef, isIntersecting } = useIntersectionObserver<HTMLElement>({
    threshold,
  });
  const shouldAnimate = useAnimationPriority({
    priority: "medium",
    isVisible: isIntersecting,
  });

  return (
    <section
      ref={sectionRef}
      className={className}
      data-anim-disabled={shouldAnimate ? "false" : "true"}
    >
      <Container className={contentClassName}>
        <FeatureHeader variant={variant}>
          <FeatureHeaderTitle>{title}</FeatureHeaderTitle>
          <FeatureHeaderDescription>{description}</FeatureHeaderDescription>
        </FeatureHeader>
        {typeof children === "function" ? children({ shouldAnimate }) : children}
      </Container>
    </section>
  );
}
