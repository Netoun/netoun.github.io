import clsx from "clsx";
import type { ReactNode } from "react";
import * as styles from "./chrome-capture.css";

export interface ChromeCaptureProps {
  src: string;
  /** Decorative by default: the title next to it names what is shown. */
  alt?: string;
  /** Intrinsic size of the image, for layout before it loads. */
  width?: number;
  height?: number;
  /** `cover` fills the 16:10 screen (project captures); `contain` sets a cut-out on it. */
  fit?: "cover" | "contain";
  /** `sm`: a thumbnail, with a thinner bezel. */
  size?: "md" | "sm";
  /** Grid placement from the parent. */
  className?: string;
  /** The screen's own ground (ink glass, lit paper…), behind a `contain` capture. */
  screenClassName?: string;
  /** Plays one chrome glint when mounted (the parent remounts it when the capture changes). */
  sweep?: boolean;
  /** Something live laid over the capture (a running demo); the capture stays its fallback. */
  children?: ReactNode;
  /** The Lab's xray: the layers pulled apart in depth (`chromeLayerGap` sets how far). */
  xray?: boolean;
}

/** A capture set in a polished chrome bezel, the process monitor's and the Labs loupe's. */
export function ChromeCapture({
  src,
  alt = "",
  width = 1350,
  height = 760,
  fit = "cover",
  size = "md",
  className,
  screenClassName,
  sweep = false,
  children,
  xray = false,
}: ChromeCaptureProps) {
  return (
    <span
      className={clsx(styles.captureStyle, className)}
      data-size={size}
      data-xray={xray || undefined}
    >
      <span className={clsx(styles.frameStyle, screenClassName)}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className={styles.imageStyle}
          data-fit={fit}
        />
        {children}
        <span className={clsx(styles.glintStyle, sweep && styles.sweepStyle)} aria-hidden="true" />
      </span>
    </span>
  );
}
