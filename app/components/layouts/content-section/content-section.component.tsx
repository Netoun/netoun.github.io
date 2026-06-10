import type { ReactNode } from "react";
import { Container } from "@/components/layouts/container/container.component";
import {
  FeatureHeader,
  FeatureHeaderTitle,
  FeatureHeaderDescription,
} from "@/components/layouts/feature-header/feature-header.component";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import { useReveal } from "@/hooks/use-reveal.hook";

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
  const { ref: revealRef, state: revealState } = useReveal<HTMLElement>();
  const shouldAnimate = useAnimationPriority({
    priority: "medium",
    isVisible: isIntersecting,
  });

  return (
    <section
      ref={(element) => {
        sectionRef.current = element;
        revealRef.current = element;
      }}
      className={className}
      data-anim-disabled={shouldAnimate ? "false" : "true"}
      data-reveal={revealState ?? undefined}
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
