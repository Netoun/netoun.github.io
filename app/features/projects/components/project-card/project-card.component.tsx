import { useEffect, useRef } from "react";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import { TerminalButtons } from "@/components/primitives/terminal-buttons/terminal-buttons.component";
import { Tag } from "@/components/primitives/tag/tag.component";
import { HolographicOverlay } from "@/components/misc/holographic-overlay/holographic-overlay.component";
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
  animationsEnabled?: boolean;
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
  animationsEnabled = true,
}: ProjectCardProps) {
  const { ref: cardRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0,
    rootMargin: "0px 0px 80px 0px",
    enabled: animationsEnabled,
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const shouldAnimate = useAnimationPriority({
    priority: "medium",
    isVisible: animationsEnabled && isIntersecting,
  });

  useEffect(() => {
    if (!shouldAnimate) return;

    const card = cardRef.current;
    const image = imageRef.current;
    if (!card || !image) return;
    const tagsEl = card.querySelector("[data-tags]");

    let boundingRect: DOMRect | null = null;
    let rafId = 0;
    let lastX = 0;
    let lastY = 0;

    const applyParallax = () => {
      rafId = 0;
      if (!boundingRect) return;

      const x = lastX - boundingRect.left;
      const y = lastY - boundingRect.top;
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

    const handleMouseEnter = () => {
      boundingRect = card.getBoundingClientRect();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!boundingRect) return;

      lastX = e.clientX;
      lastY = e.clientY;

      if (rafId === 0) {
        rafId = requestAnimationFrame(applyParallax);
      }
    };

    const handleMouseLeave = () => {
      boundingRect = null;
      if (rafId !== 0) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
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
      if (rafId !== 0) cancelAnimationFrame(rafId);
    };
  }, [shouldAnimate]);

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  const typeLabel = type === "personal" ? "PERSONAL PROJECT" : "PROJECT";

  return (
    <div className={styles.perspectiveWrapper}>
      <div
        ref={cardRef}
        className={styles.cardStyle}
        style={{ "--card-rotate": `${rotate}deg` } as React.CSSProperties}
      >
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
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              width={1350}
              height={760}
              className={styles.imageStyle}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlNGRkIi8+PC9zdmc+";
              }}
            />
            <HolographicOverlay enabled={animationsEnabled} />
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
            <span className={styles.linkLabelStyle}>
              _VIEW PROJECT_
              <span className={styles.linkArrowStyle}>→</span>
            </span>
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
