import clsx from "clsx";
import { useEffect, useRef } from "react";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import { TerminalButtons } from "@/components/primitives/terminal-buttons/terminal-buttons.component";
import { Tag } from "@/components/primitives/tag/tag.component";
import type { ProjectType } from "../../hooks/use-projects.hook.types";
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
  rotate?: number;
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
  rotate = 0,
}: ProjectCardProps) {
  const { ref: cardRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0,
    rootMargin: "0px 0px 80px 0px",
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const shouldAnimate = useAnimationPriority({
    priority: "medium",
    isVisible: isIntersecting,
  });

  useEffect(() => {
    if (!shouldAnimate) return;

    const card = cardRef.current;
    const image = imageRef.current;
    if (!card || !image) return;
    const tagsEl = card.querySelector("[data-tags]");

    let boundingRect: DOMRect | null = null;

    const handleMouseEnter = () => {
      boundingRect = card.getBoundingClientRect();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!boundingRect) return;

      const x = e.clientX - boundingRect.left;
      const y = e.clientY - boundingRect.top;
      const xPercentage = x / boundingRect.width;
      const yPercentage = y / boundingRect.height;
      const xRotation = (xPercentage - 0.5) * 20;
      const yRotation = (0.5 - yPercentage) * 20;

      card.style.setProperty("--x-rotation", `${yRotation}deg`);
      card.style.setProperty("--y-rotation", `${xRotation}deg`);
      card.style.setProperty("--x", `${xPercentage * 100}%`);
      card.style.setProperty("--y", `${yPercentage * 100}%`);

      const parallax = 0.4;
      image.style.transform = `translateX(${-xRotation * parallax}px) translateY(${-yRotation * parallax}px) scale(1.15)`;

      if (tagsEl) {
        const tagsParallax = 0.5;
        (tagsEl as HTMLElement).style.transform =
          `translateX(${-xRotation * tagsParallax}px) translateY(${-yRotation * tagsParallax}px) translateZ(16px)`;
      }
    };

    const handleMouseLeave = () => {
      boundingRect = null;
      image.style.transform = "";
      if (tagsEl) (tagsEl as HTMLElement).style.transform = "";
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
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
    <div className={styles.perspectiveWrapper} style={{ transform: `rotate(${rotate}deg)` }}>
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
        <div
          className={styles.haloStyle}
          style={{
            background: `radial-gradient(at var(--x, 50%) var(--y, 50%), rgb(255 255 240 / 0.18) 0%, transparent 70%)`,
          }}
        />
      </div>
    </div>
  );
}
