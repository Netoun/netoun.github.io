// What the résumé says in fewer words than the site, so it fits one A4 page. Each line condenses
// the site's own text (the hero, experiences-data.ts, projects-data.ts): nothing here is a new
// fact. Keys are the data's own ids; a test fails when the data gains an entry not covered here.

export interface CvEducation {
  degree: string;
  school: string;
  place: string;
}

/** The name the JSON-LD gives, then the hero's headline and lead. */
export const CV_NAME = "Nicolas Coulonnier";
export const CV_TAGLINE = "Full-stack engineer & creative developer.";
export const CV_LEAD =
  "I build fast, polished web products — from expressive interfaces to robust backend systems. Currently building at Lonestone.";

/** By experience slug. */
export const CV_JOBS: Record<string, string> = {
  lonestone:
    "Production web apps for healthcare, SaaS and corporate clients: maintainable architecture, product velocity, polished interfaces.",
  easilys:
    "Developed and maintained a collective catering management app: a new React interface and new features.",
  sogeti:
    "Innovation pole: a GitFlow tool in React and a machine-learning chatbot for emotion understanding.",
};

/** By client project title, as the work log names them. */
export const CV_CLIENTS: Record<string, string> = {
  Desoutter: "Led the development of a modern corporate website.",
  Cuevr: "AI-powered platform for creating commercial proposals.",
  "Mon Rét@b' d'abord":
    "Web app supporting mental health recovery, with self-assessment and wellness tools.",
};

/** By project slug. */
export const CV_PROJECTS: Record<string, string> = {
  "my-website": "Portfolio with a neo-retro design system, on React Router and Vanilla Extract.",
  "procedural-map": "Procedural map generator in the browser: noise, Three.js, Canvas.",
  treashunt: "Adventure design platform: create challenges and take them on.",
  communile: "Website of a Nantes cooperative running open, convivial places; team of three.",
  "lonestone-boilerplate":
    "Full-stack starter kit for web apps, SaaS and websites, on React and NestJS.",
  nzoth: "NestJS utilities for REST APIs: filtering, pagination, sorting, Zod validation.",
};

/** Not on the site: given by Nicolas on 2026-10-01, without years. */
export const CV_EDUCATION: CvEducation[] = [
  { degree: "Master's degree", school: "EPSI", place: "Nantes" },
];
