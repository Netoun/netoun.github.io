import { createTimeline, onScroll, stagger } from "animejs";
import { useEffect } from "react";
import { Container } from "@/components/layouts/container/container.component";
import { Section } from "@/components/layouts/sections/section.component";
import { bootMessages } from "./data/boot-messages";
import * as styles from "./boot-sequence.css";

export function BootSequenceSection() {
  useEffect(() => {
    createTimeline({
      autoplay: onScroll({
        target: `.${styles.bootSection}`,
        enter: "top top",
        leave: "bottom bottom",
      }),
    })
      .add(
        `.${styles.bootLine}`,
        {
          ease: "steps(1)",
          opacity: [0, 1],
          height: [0, "auto"],
          delay: stagger(50),
        },
        0,
      )
      .init();
  }, []);

  return (
    <Section className={styles.bootSection}>
      <Container className={styles.bootContainer}>
        <div className={styles.bootSequence}>
          {bootMessages.map((message) => (
            <div
              key={message.text}
              className={`${styles.bootLine} ${styles.bootLineVisible} ${
                message.type === "error"
                  ? styles.bootLineError
                  : message.type === "success"
                    ? styles.bootLineSuccess
                    : message.type === "warning"
                      ? styles.bootLineWarning
                      : message.type === "system"
                        ? styles.bootLineSystem
                        : styles.bootLineInfo
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <span className={styles.cursor} />
      </Container>
    </Section>
  );
}
