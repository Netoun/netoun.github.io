export type ProjectType = "personal" | "project";

export interface Project {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image: string;
  url: string;
  featured?: boolean;
  type?: ProjectType;
}
