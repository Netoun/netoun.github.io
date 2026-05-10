export type AccentType = "primary" | "secondary" | "tertiary" | "kirby";
export type ShapeType = "sparkle" | "diamond" | "cube" | "circle" | "hexagon" | "ring";

interface SkillTag {
  name: string;
  level: 1 | 2 | 3;
}

export interface SkillBlock {
  title: string;
  accent: AccentType;
  shape: ShapeType;
  tags: SkillTag[];
}
