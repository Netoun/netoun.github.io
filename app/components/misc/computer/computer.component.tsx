import clsx from "clsx";
import type { ComponentProps } from "react";
import { ComputerKeyboard } from "./components/computer-keyboard/computer-keyboard.component";
import * as styles from "./computer.css";

type ComputerProps = ComponentProps<"div">;

export function Computer({ children, className, ...props }: ComputerProps) {
  return (
    <div className={clsx(styles.computerStyle, className)} {...props}>
      <div id="computer-frame-lid" className={styles.computerFrameLidStyle}>
        {/* Front face stays in the a11y tree so screen children can remain accessible. */}
        <div id="computer-frame-lid-front" className={styles.computerFrameLidFrontStyle}>
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
        />
        <div
          id="computer-frame-lid-bottom"
          className={styles.computerFrameLidBottomStyle}
          aria-hidden="true"
          inert
        />
        <div
          id="computer-frame-lid-left"
          className={styles.computerFrameLidLeftStyle}
          aria-hidden="true"
          inert
        />
        <div
          id="computer-frame-lid-right"
          className={styles.computerFrameLidRightStyle}
          aria-hidden="true"
          inert
        />
        <div
          id="computer-frame-lid-top"
          className={styles.computerFrameLidTopStyle}
          aria-hidden="true"
          inert
        />
      </div>
      {/* Entire chassis (faces + keyboard) is decorative chrome. */}
      <div
        id="computer-frame-chassis"
        className={styles.computerFrameChassisStyle}
        aria-hidden="true"
        inert
      >
        <div id="computer-frame-chassis-front" className={styles.computerFrameChassisFrontStyle}>
          <ComputerKeyboard />
        </div>
        <div id="computer-frame-chassis-back" className={styles.computerFrameChassisBackStyle} />
        <div
          id="computer-frame-chassis-bottom"
          className={styles.computerFrameChassisBottomStyle}
        />
        <div id="computer-frame-chassis-left" className={styles.computerFrameChassisLeftStyle} />
        <div id="computer-frame-chassis-right" className={styles.computerFrameChassisRightStyle} />
        <div id="computer-frame-chassis-top" className={styles.computerFrameChassisTopStyle} />
      </div>
    </div>
  );
}
