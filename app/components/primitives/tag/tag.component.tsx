import { tagStyle, type TagColor } from "./tag.css";

const TAG_COLOR_MAP: Record<string, TagColor> = {
  // blue — frontend / React ecosystem
  React: "blue",
  TypeScript: "blue",
  TS: "blue",
  JavaScript: "blue",
  JS: "blue",
  "React Aria": "blue",
  "Tailwind CSS": "blue",
  MDX: "blue",
  Accessibility: "blue",

  // pink — creative / animation / realtime
  Remix: "pink",
  "React Router": "pink",
  Creative: "pink",
  Interactive: "pink",
  Motion: "pink",
  WebSockets: "pink",
  Elysia: "pink",
  "Canvas 2D": "pink",

  // green — runtime / infra / tooling
  Node: "green",
  "Node.js": "green",
  Bun: "green",
  Vue: "green",
  CLI: "green",
  Game: "green",
  "Open Source": "green",
  Docker: "green",
  Cloudflare: "green",
  Ansible: "green",
  Bevy: "green",
  "Git / CI/CD": "green",
  Vite: "green",
  Vitest: "green",
  Turbo: "green",
  Monorepo: "green",
  Queue: "green",

  // purple — backend / architecture / API
  NestJS: "purple",
  Backend: "purple",
  "Vanilla Extract": "purple",
  "CSS / Vanilla Extract": "purple",
  PostgreSQL: "purple",
  Prisma: "purple",
  Drizzle: "purple",
  MikroORM: "purple",
  Keycloak: "purple",
  Zod: "purple",
  "REST / GraphQL": "purple",
  "Design Systems": "purple",

  // yellow — creative coding / design / AI / misc
  Python: "yellow",
  Rust: "yellow",
  "Three.js": "yellow",
  WebGL: "yellow",
  WebGPU: "yellow",
  "Nova.js": "yellow",
  Next: "yellow",
  "Next.js": "yellow",
  AI: "yellow",
  TensorFlow: "yellow",
  DialogFlow: "yellow",
  Streaming: "yellow",
  Figma: "yellow",
  Web: "yellow",
};

function getTagColor(tag: string): TagColor {
  return TAG_COLOR_MAP[tag] ?? "default";
}

export interface TagProps {
  children: string;
  color?: TagColor;
}

export const Tag: React.FC<TagProps> = ({ children, color }) => {
  const resolvedColor = color ?? getTagColor(children);

  return <span className={tagStyle({ color: resolvedColor })}>{children}</span>;
};
