import { Footer } from "@/components/layouts/footer/footer.component";
import { WelcomeSectionsNav } from "../components/welcome-sections-nav/welcome-sections-nav.component";
import { contactLinks } from "@/features/site/data/contact-links.data";
import { siteStatus } from "@/features/site/data/site-status.data";
import { footerLabs, footerRackLabHref, footerResume } from "../data/footer-status.data";
import { WelcomeExperienceSection } from "../sections/welcome-experience/welcome-experience.section";
import { WelcomeHeroSection } from "../sections/welcome-hero/welcome-hero.section";
import { WelcomeProjectsSection } from "../sections/welcome-projects/welcome-projects.section";
import { WelcomeSkillsSection } from "../sections/welcome-skills/welcome-skills.section";

const PAGE_TITLE = "Netoun - Full-stack engineer";
const PAGE_DESCRIPTION =
  "Nicolas Coulonnier (Netoun) - Full-stack engineer crafting fast, clean web experiences. Specialized in React, TypeScript, Next.js, NestJS and creative frontend development.";

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
        "Full-stack engineer, React Developer, TypeScript, Next.js, NestJS, Creative Developer, Frontend Engineer, Nantes",
    },
    { name: "author", content: "Nicolas Coulonnier" },
    { name: "robots", content: "index, follow" },

    { property: "og:title", content: PAGE_TITLE },
    {
      property: "og:description",
      content:
        "Nicolas Coulonnier (Netoun) - Full-stack engineer crafting fast, clean web experiences.",
    },
    { property: "og:url", content: "https://www.netoun.com" },

    { name: "twitter:title", content: PAGE_TITLE },
    {
      name: "twitter:description",
      content:
        "Nicolas Coulonnier (Netoun) - Full-stack engineer crafting fast, clean web experiences.",
    },

    { tagName: "link", rel: "canonical", href: "https://www.netoun.com" },
  ];
}

export default function Welcome() {
  return (
    <>
      <main>
        <WelcomeSectionsNav />
        <WelcomeHeroSection />
        <WelcomeProjectsSection />
        <WelcomeExperienceSection />
        <WelcomeSkillsSection />
      </main>
      <Footer
        id="contact"
        links={contactLinks}
        labs={footerLabs}
        rackLabHref={footerRackLabHref}
        status={siteStatus}
        file={footerResume}
      />
    </>
  );
}
