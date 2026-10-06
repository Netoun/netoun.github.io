import type { Experience } from "./experiences-data.types";

export const experiences: Experience[] = [
  {
    slug: "lonestone",
    company: "Lonestone",
    role: "Full-stack engineer",
    start: "2021-07",
    location: "Nantes, FR",
    description:
      "Shipping production web applications for clients across healthcare, SaaS and corporate platforms, with a focus on maintainable architecture, product velocity and polished user interfaces.",
    projects: [
      {
        title: "DigiLog",
        description:
          "Lead developer of a platform that extracts structured data from traffic regulations for local authorities: OCR, tool-calling LLM agents and an evaluation workbench.",
        stack: ["React", "NestJS", "MikroORM", "PostgreSQL", "AI", "Queue"],
      },
      {
        title: "Desoutter",
        description:
          "Led the development of a modern corporate website using Next.js, Tailwind CSS, and TypeScript, delivering an enhanced digital presence for the company.",
        stack: ["Next.js", "Tailwind CSS", "TypeScript"],
      },
      {
        title: "Cuevr",
        description: "Lead developer of an AI-powered platform for creating commercial proposals.",
        stack: ["React", "NestJS", "AI", "Queue", "Streaming"],
      },
      {
        title: "Mon Rét@b' d'abord",
        description:
          "Lead developer of a specialized web application to support mental health recovery, featuring self-assessment tools and wellness management features for individuals dealing with conditions like schizophrenia and bipolar disorder.",
        stack: ["React", "NestJS", "MikroORM", "PostgreSQL", "Keycloak"],
      },
    ],
    moreProjects: true,
    stack: [],
  },
  {
    slug: "easilys",
    company: "Easilys",
    role: "Full Stack Developer",
    start: "2019-07",
    end: "2021-07",
    location: "Nantes, FR",
    description:
      "Development and maintenance of a web application for collective catering management, with new features.",
    projects: [],
    stack: ["Node.js", "Vue", "PostgreSQL"],
  },
  {
    slug: "sogeti",
    company: "Sogeti",
    role: "Work-Study Program",
    start: "2017-09",
    end: "2019-07",
    location: "Nantes, FR",
    description:
      "Development of new solutions within the innovation pole. Built a GitFlow tool in ReactJS and developed a chatbot using machine learning for emotion understanding.",
    projects: [],
    stack: ["React", "Python", "Rust", "TensorFlow", "DialogFlow"],
  },
];
