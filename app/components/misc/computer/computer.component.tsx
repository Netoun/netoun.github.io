import { assignInlineVars } from "@vanilla-extract/dynamic";
import clsx from "clsx";
import type { ComponentProps } from "react";
import { ComputerKeyboard } from "./components/computer-keyboard/computer-keyboard.component";
import * as styles from "./computer.css";
import type { ComputerFace } from "./computer.css";

export type ComputerFrame = "lid" | "chassis";
export type ComputerFaceId = `${ComputerFrame}-${ComputerFace}`;

/** How far a face travels at `explode={1}`: nearly five times the box's 10 px depth. */
export const COMPUTER_EXPLODE_PX = 48;

interface ComputerProps extends ComponentProps<"div"> {
  /** The Lab's xray: faces outlined, named and pulled apart. */
  xray?: boolean;
  /** With `xray`: 0 keeps the box assembled, 1 pushes each face out by COMPUTER_EXPLODE_PX. */
  explode?: number;
  /** With `xray`: the face lit gold. */
  litFace?: ComputerFaceId | null;
}

export function Computer({
  children,
  className,
  style,
  xray = false,
  explode = 0,
  litFace = null,
  ...props
}: ComputerProps) {
  // Only the xray writes these attributes: the home's markup stays as it was.
  const face = (frame: ComputerFrame, name: ComputerFace, label?: string) =>
    xray
      ? {
          "data-face": name,
          "data-lit": litFace === `${frame}-${name}` || undefined,
          "data-label": label,
        }
      : {};
  const frame = (name: ComputerFrame) => (xray ? { "data-frame": name } : {});

  return (
    <div
      className={clsx(styles.computerStyle, className)}
      data-xray={xray || undefined}
      style={
        xray
          ? {
              ...style,
              ...assignInlineVars({
                [styles.computerExplode]: `${explode * COMPUTER_EXPLODE_PX}px`,
              }),
            }
          : style
      }
      {...props}
    >
      <div id="computer-frame-lid" className={styles.computerFrameLidStyle} {...frame("lid")}>
        {/* Front face stays in the a11y tree so screen children can remain accessible. */}
        <div
          id="computer-frame-lid-front"
          className={styles.computerFrameLidFrontStyle}
          {...face("lid", "front", "lid · front")}
        >
          <div id="computer-screen" className={styles.computerScreenStyle}>
            {children}
          </div>
        </div>
        {/* Decorative lid faces — hidden from assistive tech and non-interactive. */}
        <div
          id="computer-frame-lid-back"
          className={styles.computerFrameLidBackStyle}
          aria-hidden="true"
          inert
          {...face("lid", "back", "lid · back")}
        />
        <div
          id="computer-frame-lid-bottom"
          className={styles.computerFrameLidBottomStyle}
          aria-hidden="true"
          inert
          {...face("lid", "bottom")}
        />
        <div
          id="computer-frame-lid-left"
          className={styles.computerFrameLidLeftStyle}
          aria-hidden="true"
          inert
          {...face("lid", "left")}
        />
        <div
          id="computer-frame-lid-right"
          className={styles.computerFrameLidRightStyle}
          aria-hidden="true"
          inert
          {...face("lid", "right")}
        />
        <div
          id="computer-frame-lid-top"
          className={styles.computerFrameLidTopStyle}
          aria-hidden="true"
          inert
          {...face("lid", "top")}
        />
      </div>
      {/* Entire chassis (faces + keyboard) is decorative chrome. */}
      <div
        id="computer-frame-chassis"
        className={styles.computerFrameChassisStyle}
        aria-hidden="true"
        inert
        {...frame("chassis")}
      >
        <div
          id="computer-frame-chassis-front"
          className={styles.computerFrameChassisFrontStyle}
          {...face("chassis", "front", "chassis · front")}
        >
          <ComputerKeyboard />
          <div className={styles.computerTrackpadStyle} />
        </div>
        <div
          id="computer-frame-chassis-back"
          className={styles.computerFrameChassisBackStyle}
          {...face("chassis", "back", "chassis · back")}
        />
        <div
          id="computer-frame-chassis-bottom"
          className={styles.computerFrameChassisBottomStyle}
          {...face("chassis", "bottom")}
        />
        <div
          id="computer-frame-chassis-left"
          className={styles.computerFrameChassisLeftStyle}
          {...face("chassis", "left")}
        />
        <div
          id="computer-frame-chassis-right"
          className={styles.computerFrameChassisRightStyle}
          {...face("chassis", "right")}
        />
        <div
          id="computer-frame-chassis-top"
          className={styles.computerFrameChassisTopStyle}
          {...face("chassis", "top")}
        />
      </div>
    </div>
  );
}
