interface SubExperience {
  title: string;
  description: string;
  url?: string;
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
  active?: boolean;
}
