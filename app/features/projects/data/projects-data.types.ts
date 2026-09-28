export interface Project {
  slug: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD), read as UTC. */
  date: string;
  tags: string[];
  image: string;
  url: string;
}
