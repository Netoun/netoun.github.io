interface SubExperience {
  title: string;
  description: string;
  url?: string;
  stack: string[];
}

export interface Experience {
  slug: string;
  company: string;
  role: string;
  /** `YYYY-MM` */
  start: string;
  /** `YYYY-MM`; absent while the job runs. */
  end?: string;
  location: string;
  description?: string;
  projects: SubExperience[];
  /** More client work exists than is listed: the log prints an elision, never a count. */
  moreProjects?: boolean;
  stack: string[];
}
