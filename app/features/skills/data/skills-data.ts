import { vars } from "@styles/theme.css";
import type { AccentType, SkillBlock } from "./skills-data.types";

export const SKILL_BLOCKS = [
  {
    title: "Creative Frontend",
    accent: "primary",
    shape: "sparkle",
    tags: [
      { name: "React", level: 3 },
      { name: "TypeScript", level: 3 },
      { name: "Next.js", level: 2 },
      { name: "CSS + Vanilla Extract", level: 3 },
      { name: "Tailwind CSS", level: 2 },
      { name: "React Router", level: 2 },
      { name: "Remix", level: 2 },
      { name: "React Aria", level: 2 },
      { name: "shadcn/ui", level: 2 },
      { name: "anime.js", level: 2 },
      { name: "Motion", level: 2 },
    ],
  },
  {
    title: "Web Architecture",
    accent: "tertiary",
    shape: "diamond",
    tags: [
      { name: "TypeScript", level: 3 },
      { name: "Design Systems", level: 3 },
      { name: "REST / GraphQL", level: 2 },
      { name: "Accessibility", level: 2 },
      { name: "SSE", level: 2 },
      { name: "Zod", level: 2 },
      { name: "Monorepos", level: 2 },
    ],
  },
  {
    title: "Backend & Infra",
    accent: "secondary",
    shape: "cube",
    tags: [
      { name: "NestJS", level: 3 },
      { name: "Node.js", level: 3 },
      { name: "PostgreSQL", level: 2 },
      { name: "Drizzle", level: 2 },
      { name: "MikroORM", level: 2 },
      { name: "Bun", level: 2 },
      { name: "Elysia", level: 2 },
      { name: "Docker", level: 2 },
      { name: "Cloudflare", level: 2 },
      { name: "Keycloak", level: 1 },
      { name: "Ansible", level: 1 },
    ],
  },
  {
    title: "Realtime Systems",
    accent: "kirby",
    shape: "circle",
    tags: [
      { name: "WebSockets", level: 2 },
      { name: "Queues", level: 2 },
      { name: "Streaming", level: 2 },
      { name: "AI", level: 2 },
    ],
  },
  {
    title: "Game / Procedural",
    accent: "kirby",
    shape: "hexagon",
    tags: [
      { name: "Three.js", level: 2 },
      { name: "Canvas 2D", level: 2 },
      { name: "WebGL", level: 2 },
      { name: "Rust", level: 2 },
      { name: "Bevy", level: 2 },
      { name: "WebGPU", level: 1 },
    ],
  },
  {
    title: "Workflow & Collaboration",
    accent: "primary",
    shape: "ring",
    tags: [
      { name: "Agile", level: 3 },
      { name: "Notion", level: 3 },
      { name: "AI Workflow", level: 3 },
      { name: "Git + CI/CD", level: 3 },
      { name: "Collaboration", level: 3 },
      { name: "Product Thinking", level: 2 },
      { name: "Figma", level: 2 },
      { name: "Vite", level: 2 },
      { name: "Vitest", level: 2 },
      { name: "MDX", level: 2 },
      { name: "Python", level: 1 },
    ],
  },
] satisfies SkillBlock[];

export const ACCENT_VARS: Record<AccentType, string> = {
  primary: vars.colors.primary,
  secondary: vars.colors.secondary,
  tertiary: vars.colors.tertiary,
  kirby: vars.colors.kirby,
};
