"use client";

import { useEffect, useState } from "react";
import * as styles from "../../welcome-hero-computer.css";

const BOOT_STEPS = [
  "Initializing system...",
  "Loading modules...",
  "Calibrating sensors...",
  "Establishing connection...",
  "System ready.",
];

export function WelcomeHeroComputerSplash() {
  const [step, setStep] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (step >= BOOT_STEPS.length) return;
    const timer = setTimeout(() => setStep((s) => s + 1), 200);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    const cursor = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(cursor);
  }, []);

  return (
    <div className={styles.splashStyles}>
      <span>
        {BOOT_STEPS[Math.min(step, BOOT_STEPS.length - 1)]}
        {step < BOOT_STEPS.length && (showCursor ? "_" : " ")}
      </span>
    </div>
  );
}
