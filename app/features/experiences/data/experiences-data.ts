import type { Experience } from "../hooks/use-experiences.hook.types";

export const experiences: Experience[] = [
  {
    slug: "lonestone",
    company: "Lonestone",
    role: "Software Developer",
    period: "Jul 2021 — ...",
    location: "Nantes, FR",
    description:
      "Successfully delivered numerous other projects, consistently meeting client requirements and technical challenges with innovative solutions.",
    active: true,
    projects: [
      {
        title: "Desoutter",
        description:
          "Led the development of a modern corporate website using Next.js, Tailwind CSS, and TypeScript, delivering an enhanced digital presence for the company.",
        stack: ["Next.js", "Tailwind CSS", "TypeScript"],
      },
      {
        title: "Cuevr",
        description: "AI-powered platform for creating commercial proposals.",
        stack: ["React", "NestJS", "AI", "Queue", "Streaming"],
      },
      {
        title: "Mon Rét@b' d'abord",
        description:
          "Engineered a specialized web application to support mental health recovery, featuring self-assessment tools and wellness management features for individuals dealing with conditions like schizophrenia and bipolar disorder.",
        stack: ["React", "NestJS", "MikroORM", "PostgreSQL", "Keycloak"],
      },
      {
        title: "… and many more",
        description:
          "Contributed to a wide variety of additional projects across different industries, tackling diverse technical challenges and delivering tailored solutions for each client.",
        stack: [],
      },
    ],
    stack: [],
  },
  {
    slug: "easilys",
    company: "Easilys",
    role: "Full Stack Developer",
    period: "Jul 2019 — Jul 2021",
    location: "Nantes, FR",
    description:
      "Development and maintenance of a web application for collective catering management. Implementation of a new user interface with React and development of new features.",
    projects: [],
    stack: ["React", "Node.js", "Vue", "PostgreSQL"],
  },
  {
    slug: "sogeti",
    company: "Sogeti",
    role: "Work-Study Program",
    period: "Sep 2017 — Oct 2019",
    location: "Nantes, FR",
    description:
      "Development of new solutions within the innovation pole. Built a GitFlow tool in ReactJS and developed a chatbot using machine learning for emotion understanding.",
    projects: [],
    stack: ["React", "Python", "Rust", "TensorFlow", "DialogFlow"],
  },
];
