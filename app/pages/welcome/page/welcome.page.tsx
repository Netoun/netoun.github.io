import { lazy, Suspense, useEffect, useState } from "react";
import { WelcomeHeroSection } from "../sections/welcome-hero/welcome-hero.section";

const WelcomeProjectsSection = lazy(async () => {
  const module = await import("../sections/welcome-projects/welcome-projects.section");
  return { default: module.WelcomeProjectsSection };
});

const WelcomeExperienceSection = lazy(async () => {
  const module = await import("../sections/welcome-experience/welcome-experience.section");
  return { default: module.WelcomeExperienceSection };
});

const WelcomeSkillsSection = lazy(async () => {
  const module = await import("../sections/welcome-skills/welcome-skills.section");
  return { default: module.WelcomeSkillsSection };
});

export function meta() {
  return [
    { title: "Netoun - Full stack engineer" },
    { name: "description", content: "Welcome to my personal website" },
  ];
}

export default function Welcome() {
  const [showDeferredSections, setShowDeferredSections] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => {
        setShowDeferredSections(true);
      });

      return () => {
        window.cancelIdleCallback(idleId);
      };
    }

    timeoutId = setTimeout(() => {
      setShowDeferredSections(true);
    }, 600);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <main>
      <WelcomeHeroSection />
      {showDeferredSections ? (
        <Suspense fallback={null}>
          <WelcomeProjectsSection />
          <WelcomeExperienceSection />
          <WelcomeSkillsSection />
        </Suspense>
      ) : null}
    </main>
  );
}
