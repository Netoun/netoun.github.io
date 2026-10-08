import { tagMarkStyle, tagStyle, type TagColor, type TagSize } from "./tag.css";
import { memo } from "react";
import { Glyph } from "../glyph/glyph.component";

// Tags are coloured by tech domain so the palette reads as a system, not
// decoration. Four accents map to four domains; everything else stays
// neutral. This map is the site's one taxonomy: the monitor meters, the work
// log lanes and the Skills readout all read their domains from it.
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
  Astro: "frontend",
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

  // Gold — creative (graphics, games, shaders)
  "Three.js": "creative",
  "Canvas 2D": "creative",
  Canvas: "creative",
  WebGL: "creative",
  WebGPU: "creative",
  Bevy: "creative",
  Game: "creative",
  Creative: "creative",
  Interactive: "creative",
  "Nova.js": "creative",

  // Azure — systems & AI (low-level languages, ML, LLM)
  Rust: "systems",
  Python: "systems",
  AI: "systems",
  TensorFlow: "systems",
  DialogFlow: "systems",

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

export function getTagColor(tag: string): TagColor {
  return Object.hasOwn(TAG_COLOR_MAP, tag) ? TAG_COLOR_MAP[tag] : "default";
}

export interface TagProps {
  children: string;
  color?: TagColor;
  size?: TagSize;
  /** A glyph printed before the label in the domain colour, hidden from assistive tech. */
  mark?: string;
}

function TagComponent({ children, color, size, mark }: TagProps) {
  const resolvedColor = color ?? getTagColor(children);

  return (
    <span className={tagStyle({ color: resolvedColor, size })}>
      {mark && <Glyph className={tagMarkStyle({ color: resolvedColor })}>{mark}</Glyph>}
      {children}
    </span>
  );
}

export const Tag = memo(TagComponent);
