export type ExperienceType = "personal" | "project";

export interface SubExperience {
  title: string;
  description: string;
  stack?: string[];
}

export interface Experience {
  slug: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description?: string;
  projects: SubExperience[];
  stack: string[];
  type?: ExperienceType;
}