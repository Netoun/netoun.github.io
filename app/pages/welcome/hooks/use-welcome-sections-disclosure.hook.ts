import type { Dispatch, RefObject, SetStateAction } from "react";
import { useEffect, useState } from "react";

interface WelcomeSectionsDisclosure {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

/**
 * Open state of the sections capsule. The listeners sit on the nav element itself, so the
 * capsule's own pointer, focus and keyboard events drive it, and the document catches taps
 * that land outside it.
 */
export function useWelcomeSectionsDisclosure(
  navRef: RefObject<HTMLElement | null>,
): WelcomeSectionsDisclosure {
  const [isOpen, setIsOpen] = useState(false);

  // Listens on the nav itself: hover opens the list for a mouse (touch and keyboard go through
  // the button), focus leaving the nav or Escape folds it, a tap anywhere else (the scrim
  // included) closes it.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setIsOpen(true);
    };
    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || nav.contains(document.activeElement)) return;
      setIsOpen(false);
    };
    const onFocusOut = (event: FocusEvent) => {
      if (!(event.relatedTarget instanceof Node) || !nav.contains(event.relatedTarget)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !isOpen) return;
      setIsOpen(false);
      nav.querySelector("button")?.focus();
    };
    const onDocumentPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && nav.contains(event.target)) return;
      setIsOpen(false);
    };

    nav.addEventListener("pointerenter", onPointerEnter);
    nav.addEventListener("pointerleave", onPointerLeave);
    nav.addEventListener("focusout", onFocusOut);
    nav.addEventListener("keydown", onKeyDown);
    if (isOpen) document.addEventListener("pointerdown", onDocumentPointerDown);
    return () => {
      nav.removeEventListener("pointerenter", onPointerEnter);
      nav.removeEventListener("pointerleave", onPointerLeave);
      nav.removeEventListener("focusout", onFocusOut);
      nav.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onDocumentPointerDown);
    };
  }, [isOpen, navRef, setIsOpen]);

  return { isOpen, setIsOpen };
}
