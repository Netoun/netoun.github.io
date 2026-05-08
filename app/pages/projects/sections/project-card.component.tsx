import clsx from "clsx";
import { useEffect, useRef } from "react";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import { TerminalButtons } from "@/components/primitives/terminal-buttons/terminal-buttons.component";
import { Tag } from "@/components/primitives/tag/tag.component";
import type { ProjectType } from "../hooks/use-projects.hook.types";
import * as styles from "./project-card.css";

export interface ProjectCardProps {
  title: string;
  description: string;
  date: string;
  tags: string[];
  image: string;
  url: string;
  featured?: boolean;
  type?: ProjectType;
}

export function ProjectCard({
  title,
  description,
  date,
  tags,
  image,
  url,
  featured = false,
  type = "project",
}: ProjectCardProps) {
  const { ref: cardRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0,
    rootMargin: "0px 0px 80px 0px",
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const shouldAnimate = useAnimationPriority({ priority: "medium", isVisible: isIntersecting });

  useEffect(() => {
    if (!shouldAnimate) return;

    const card = cardRef.current;
    const image = imageRef.current;
    const tagsEl = card?.querySelector("[data-tags]");
    if (!card || !image) return;

    const target = { x: 0, y: 0 };
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;
    let isRunning = false;

    const lerpValue = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const tick = () => {
      const prevX = currentX;
      const prevY = currentY;

      currentX = lerpValue(currentX, target.x, 0.3);
      currentY = lerpValue(currentY, target.y, 0.3);

      const deltaX = currentX - prevX;
      const deltaY = currentY - prevY;

      card.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg) perspective(1000px) translateZ(0)`;

      const imageParallax = 30;
      image.style.transform = `translateX(${-deltaX * imageParallax}px) translateY(${-deltaY * imageParallax}px) scale(1.15)`;

      if (tagsEl) {
        const tagsParallax = 2;
        (tagsEl as HTMLElement).style.transform =
          `translateX(${-deltaX * tagsParallax}px) translateY(${-deltaY * tagsParallax}px)`;
      }

      const settled =
        Math.abs(currentX) < 0.01 &&
        Math.abs(currentY) < 0.01 &&
        Math.abs(target.x) < 0.01 &&
        Math.abs(target.y) < 0.01;

      if (settled) {
        isRunning = false;
        rafId = 0;
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      target.x = ((x - centerX) / centerX) * 25;
      target.y = ((y - centerY) / centerY) * -25;
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const handleMouseLeave = () => {
      target.x = 0;
      target.y = 0;
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [shouldAnimate]);

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  const typeLabel = type === "personal" ? "PERSONAL PROJECT" : "PROJECT";

  return (
    <div ref={cardRef} className={clsx(styles.cardStyle, isIntersecting && styles.cardVisible)}>
      <a href={url} target="_blank" rel="noopener noreferrer" className={styles.linkStyle}>
        <div className={styles.terminalBarStyle}>
          <div className={styles.terminalLeftStyle}>
            <TerminalButtons />
            <span>{typeLabel}</span>
          </div>
          <span className={styles.terminalDateStyle}>{formattedDate}</span>
        </div>

        <div className={styles.imageContainerStyle}>
          <img
            ref={imageRef}
            src={image}
            alt={title}
            className={styles.imageStyle}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlNGRkIi8+PC9zdmc+";
            }}
          />
        </div>

        <div className={styles.contentStyle}>
          <div className={styles.titleStyle}>
            <span className={styles.promptStyle}>⤘</span>
            {title}
          </div>

          <p className={styles.descriptionStyle}>{description}</p>

          <div data-tags className={styles.tagsStyle}>
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>

        <div className={styles.footerStyle}>
          <span className={styles.linkLabelStyle}>_VIEW PROJECT_</span>
          {featured ? (
            <span className={styles.statusBadgeStyle}>ACTIVE</span>
          ) : (
            <div className={styles.footerAccentStyle} />
          )}
        </div>
      </a>
    </div>
  );
}
