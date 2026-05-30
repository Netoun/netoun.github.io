import { tagStyle, type TagColor, type TagSize } from "./tag.css";
import { memo } from "react";

// Tags are coloured by tech domain so the palette reads as a system, not
// decoration. Three accents map to three domains; everything else stays
// neutral. Keep the legend in the skills section in sync with these buckets.
const TAG_COLOR_MAP: Record<string, TagColor> = {
  // Teal — frontend & UI (React ecosystem, styling, animation, design)
  React: "frontend",
  TypeScript: "frontend",
  TS: "frontend",
  JavaScript: "frontend",
  JS: "frontend",
  "Next.js": "frontend",
  Next: "frontend",
  Remix: "frontend",
  "React Router": "frontend",
  "React Aria": "frontend",
  "shadcn/ui": "frontend",
  "Tailwind CSS": "frontend",
  "Vanilla Extract": "frontend",
  "CSS + Vanilla Extract": "frontend",
  "CSS / Vanilla Extract": "frontend",
  Vue: "frontend",
  MDX: "frontend",
  Accessibility: "frontend",
  "Design Systems": "frontend",
  Figma: "frontend",
  "anime.js": "frontend",
  Motion: "frontend",

  // Purple — backend & infra (services, data, deployment, transport)
  NestJS: "backend",
  Backend: "backend",
  Node: "backend",
  "Node.js": "backend",
  Bun: "backend",
  Elysia: "backend",
  PostgreSQL: "backend",
  Prisma: "backend",
  Drizzle: "backend",
  MikroORM: "backend",
  Docker: "backend",
  Cloudflare: "backend",
  Keycloak: "backend",
  Ansible: "backend",
  "REST / GraphQL": "backend",
  Zod: "backend",
  SSE: "backend",
  WebSockets: "backend",
  Queue: "backend",
  Queues: "backend",
  Streaming: "backend",
  Monorepo: "backend",
  Monorepos: "backend",

  // Gold — creative & systems (graphics, games, low-level, AI)
  "Three.js": "creative",
  "Canvas 2D": "creative",
  Canvas: "creative",
  WebGL: "creative",
  WebGPU: "creative",
  Rust: "creative",
  Bevy: "creative",
  Game: "creative",
  Creative: "creative",
  Interactive: "creative",
  AI: "creative",
  TensorFlow: "creative",
  DialogFlow: "creative",
  Python: "creative",
  "Nova.js": "creative",

  // Neutral — tooling, process, meta
  Vite: "default",
  Vitest: "default",
  Turbo: "default",
  CLI: "default",
  "Open Source": "default",
  Agile: "default",
  Notion: "default",
  Collaboration: "default",
  "Product Thinking": "default",
  "AI Workflow": "default",
  "Git / CI/CD": "default",
  "Git + CI/CD": "default",
  Web: "default",
};

function getTagColor(tag: string): TagColor {
  return TAG_COLOR_MAP[tag] ?? "default";
}

export interface TagProps {
  children: string;
  color?: TagColor;
  size?: TagSize;
}

function TagComponent({ children, color, size }: TagProps) {
  const resolvedColor = color ?? getTagColor(children);

  return <span className={tagStyle({ color: resolvedColor, size })}>{children}</span>;
}

export const Tag = memo(TagComponent);
