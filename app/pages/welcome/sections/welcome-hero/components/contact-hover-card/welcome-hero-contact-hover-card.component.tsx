import { startTransition, useEffect, useRef, useState } from "react";
import { DialogTrigger, OverlayArrow, Popover } from "react-aria-components";
import { contactLinks } from "../../../../data/contact-links.data";
import { useMagnetic } from "../../hooks/use-magnetic.hook";
import { Button } from "@/components/primitives/button/button.component";
import { ContactIcon } from "@/components/primitives/icons/contact-icon.component";
import { WelcomeHeroContactHoverCardBeam } from "./components/beam/welcome-hero-contact-hover-card-beam.component";
import * as buttonStyles from "../../welcome-hero.css";
import * as styles from "./welcome-hero-contact-hover-card.css";
import { Glyph } from "@/components/primitives/glyph/glyph.component";

export function WelcomeHeroContactHoverCard() {
  // Flipped after hydration as a transition: React renders it time-sliced, in
  // its own tasks. A useSyncExternalStore server/client mismatch (or a plain
  // setState here) renders it as blocking work glued to the hydration task.
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  useMagnetic(triggerRef);

  useEffect(() => {
    startTransition(() => setIsHydrated(true));
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 47.99875em)");

    const updatePlacement = () => {
      setIsMobile(mediaQuery.matches);
    };

    updatePlacement();
    mediaQuery.addEventListener("change", updatePlacement);

    return () => {
      mediaQuery.removeEventListener("change", updatePlacement);
    };
  }, []);

  const label = (
    <>
      <span className={buttonStyles.welcomeButtonLabelStyles}>
        <Glyph>_</Glyph>Get in touch<Glyph>_</Glyph>
      </span>
      <Glyph className={buttonStyles.welcomeButtonArrowStyles}>⤘</Glyph>
    </>
  );

  // Without JS (and in the prerendered HTML) the CTA is a plain link to the
  // footer contacts; once hydrated only that leaf becomes the popover trigger.
  // Everything around it keeps its DOM node — the magnetic span included, whose
  // listeners are bound once — and the same classes keep the same box.
  return (
    <div
      className={styles.wrapperStyles}
      data-open={isOpen ? "true" : "false"}
      data-mobile={isMobile ? "true" : "false"}
    >
      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <span
          ref={triggerRef}
          className={styles.welcomeHeroContactHoverCardTriggerStyles}
          data-spec-target="cta"
        >
          {isHydrated ? (
            <Button className={buttonStyles.welcomeButtonStyles}>{label}</Button>
          ) : (
            <a href="#contact" className={buttonStyles.welcomeButtonStyles}>
              {label}
            </a>
          )}
          {/* Mounted only while open: at rest its SMIL and CSS loops ran for nothing. */}
          {isOpen && <WelcomeHeroContactHoverCardBeam />}
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
