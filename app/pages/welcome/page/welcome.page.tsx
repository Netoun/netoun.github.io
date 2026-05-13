import { Footer } from "../../../components/layouts/footer/footer.component";
import { WelcomeExperienceSection } from "../sections/welcome-experience/welcome-experience.section";
import { WelcomeHeroSection } from "../sections/welcome-hero/welcome-hero.section";
import { WelcomeProjectsSection } from "../sections/welcome-projects/welcome-projects.section";
import { WelcomeSkillsSection } from "../sections/welcome-skills/welcome-skills.section";

const PAGE_TITLE = "Netoun - Full Stack Engineer & Creative Developer";
const PAGE_DESCRIPTION =
  "Nicolas - Full-stack engineer crafting fast, clean web experiences. Specialized in React, TypeScript, Next.js, NestJS and creative frontend development.";

export function meta() {
  return [
    { title: PAGE_TITLE },
    {
      name: "description",
      content: PAGE_DESCRIPTION,
    },
    {
      name: "keywords",
      content:
        "Full Stack Engineer, React Developer, TypeScript, Next.js, NestJS, Creative Developer, Frontend Engineer, Nantes",
    },
    { name: "author", content: "Nicolas" },
    { name: "robots", content: "index, follow" },

    { property: "og:title", content: PAGE_TITLE },
    {
      property: "og:description",
      content: "Nicolas - Full-stack engineer crafting fast, clean web experiences.",
    },
    { property: "og:type", content: "website" },

    { name: "twitter:title", content: PAGE_TITLE },
    {
      name: "twitter:description",
      content: "Nicolas - Full-stack engineer crafting fast, clean web experiences.",
    },
  ];
}

export default function Welcome() {
  return (
    <main>
      <WelcomeHeroSection />
      <WelcomeProjectsSection />
      <WelcomeExperienceSection />
      <WelcomeSkillsSection />
      <Footer />
    </main>
  );
}
