import { tagStyle, type TagColor } from "./tag.css";

const TAG_COLOR_MAP: Record<string, TagColor> = {
  React: "blue",
  TypeScript: "blue",
  TS: "blue",
  JavaScript: "blue",
  JS: "blue",
  Remix: "pink",
  "React Router": "pink",
  "Vanilla Extract": "purple",
  NestJS: "purple",
  Backend: "purple",
  Interactive: "purple",
  Node: "green",
  "Node.js": "green",
  Vue: "green",
  CLI: "green",
  Game: "green",
  "Open Source": "green",
  PostgreSQL: "purple",
  Prisma: "purple",
  Python: "yellow",
  Rust: "yellow",
  TensorFlow: "yellow",
  DialogFlow: "yellow",
  "Three.js": "yellow",
  "Nova.js": "yellow",
  Next: "yellow",
  AI: "yellow",
  Web: "yellow",
  Creative: "pink",
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
