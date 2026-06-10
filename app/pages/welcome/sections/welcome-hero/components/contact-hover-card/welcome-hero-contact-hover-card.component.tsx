import { useEffect, useRef, useState } from "react";
import { DialogTrigger, OverlayArrow, Popover } from "react-aria-components";
import { contactLinks } from "../../../../data/contact-links.data";
import { useMagnetic } from "../../hooks/use-magnetic.hook";
import { Button } from "@/components/primitives/button/button.component";
import { ContactIcon } from "@/components/primitives/icons/contact-icon.component";
import { WelcomeHeroContactHoverCardBeam } from "./components/beam/welcome-hero-contact-hover-card-beam.component";
import * as buttonStyles from "../../welcome-hero.css";
import * as styles from "./welcome-hero-contact-hover-card.css";

export function WelcomeHeroContactHoverCard() {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  useMagnetic(triggerRef);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updatePlacement = () => {
      setIsMobile(mediaQuery.matches);
    };

    updatePlacement();
    mediaQuery.addEventListener("change", updatePlacement);

    return () => {
      mediaQuery.removeEventListener("change", updatePlacement);
    };
  }, []);

  return (
    <div
      className={styles.wrapperStyles}
      data-open={isOpen ? "true" : "false"}
      data-mobile={isMobile ? "true" : "false"}
    >
      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <span ref={triggerRef} className={styles.welcomeHeroContactHoverCardTriggerStyles}>
          <Button id="welcome-button" className={buttonStyles.welcomeButtonStyles}>
            <span className={buttonStyles.welcomeButtonLabelStyles}>_Get in touch_</span>
            <span className={buttonStyles.welcomeButtonArrowStyles}>⤘</span>
          </Button>
          <WelcomeHeroContactHoverCardBeam />
        </span>
        <Popover
          placement={isMobile ? "bottom left" : "right top"}
          offset={12}
          className={styles.popoverStyles}
          shouldFlip
        >
          <OverlayArrow className={styles.arrowStyles}>
            <svg width={12} height={12} viewBox="0 0 12 12">
              <path d="M0 0 L6 6 L12 0" />
            </svg>
          </OverlayArrow>
          <div className={styles.cardInnerStyles}>
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkStyles}
              >
                <span className={styles.iconStyles}>
                  <ContactIcon label={link.label} />
                </span>
                {link.label}
              </a>
            ))}
          </div>
        </Popover>
      </DialogTrigger>
    </div>
  );
}
