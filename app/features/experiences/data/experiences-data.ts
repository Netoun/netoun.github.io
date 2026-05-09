import type { Experience } from "../hooks/use-experiences.hook.types";

export const experiences: Experience[] = [
  {
    slug: "lonestone",
    company: "Lonestone",
    role: "Software Developer",
    period: "2021 — Present",
    location: "Nantes, FR",
    active: true,
    projects: [
      {
        title: "Desoutter",
        description: "Corporate website redesign with Next.js, Tailwind CSS, and TypeScript.",
      },
      {
        title: "Sit in Peace",
        description: "Headless e-commerce platform using Shopify Hydrogen.",
      },
      {
        title: "AB Formations",
        description: "Professional training platform for OPCO-funded programs.",
      },
      {
        title: "Mon Rét@b' d'abord",
        description: "Mental health support platform with self-assessment tools.",
      },
    ],
    stack: ["React", "Remix", "TypeScript", "NestJS", "Prisma", "PostgreSQL"],
  },
  {
    slug: "easilys",
    company: "Easilys",
    role: "Full Stack Developer",
    period: "2019 — 2021",
    location: "Nantes, FR",
    description:
      "Development and maintenance of a web application for collective catering management. New UI implementation with React.",
    projects: [],
    stack: ["React", "Node.js", "Vue", "PostgreSQL"],
  },
  {
    slug: "sogeti",
    company: "Sogeti",
    role: "Work-Study Program",
    period: "2017 — 2019",
    location: "Nantes, FR",
    description:
      "Innovation pole: GitFlow tool in ReactJS, chatbot with machine learning for emotion understanding.",
    projects: [],
    stack: ["React", "Python", "Rust", "TensorFlow", "DialogFlow"],
  },
];
