import { lazy, Suspense, useEffect, useReducer } from "react";
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

const FooterSection = lazy(async () => {
  const module = await import("../../../components/layouts/footer/footer.component");
  return { default: module.Footer };
});

export function meta() {
  return [
    { title: "Netoun - Full Stack Engineer & Creative Developer" },
    {
      name: "description",
      content:
        "Nicolas - Full-stack engineer crafting fast, clean web experiences. Specialized in React, TypeScript, Next.js, NestJS and creative frontend development.",
    },
    {
      name: "keywords",
      content:
        "Full Stack Engineer, React Developer, TypeScript, Next.js, NestJS, Creative Developer, Frontend Engineer, Nantes",
    },
    { name: "author", content: "Nicolas" },
    { name: "robots", content: "index, follow" },
    { property: "og:title", content: "Netoun - Full Stack Engineer & Creative Developer" },
    {
      property: "og:description",
      content: "Nicolas - Full-stack engineer crafting fast, clean web experiences.",
    },
    { property: "og:type", content: "website" },
    { name: "twitter:title", content: "Netoun - Full Stack Engineer & Creative Developer" },
    {
      name: "twitter:description",
      content: "Nicolas - Full-stack engineer crafting fast, clean web experiences.",
    },
  ];
}

type State = { showDeferredSections: boolean };
type Action = { type: "SHOW_DEFERRED_SECTIONS" };

const initialState: State = { showDeferredSections: false };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SHOW_DEFERRED_SECTIONS":
      return { ...state, showDeferredSections: true };
    default:
      return state;
  }
}

export default function Welcome() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { showDeferredSections } = state;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => {
        dispatch({ type: "SHOW_DEFERRED_SECTIONS" });
      });

      return () => {
        window.cancelIdleCallback(idleId);
      };
    }

    timeoutId = setTimeout(() => {
      dispatch({ type: "SHOW_DEFERRED_SECTIONS" });
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
          <FooterSection />
        </Suspense>
      ) : null}
    </main>
  );
}
