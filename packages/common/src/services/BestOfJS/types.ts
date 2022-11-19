export interface BestOfJS {
  getProjects: () => Promise<Projects>;
  findByNPMName: (name: string) => Promise<Project | null>;
}

export interface Projects {
  /**
   * @example "2022-11-18T21:17:48.201Z"
   */
  date: string;
  tags: Tag[];
  projects: Project[];
}

/**
 * @example
 * {
      "name": "API wrapper / SDK",
      "code": "api-wrapper"
    },
 */
interface Tag {
  name: string;
  code: string;
}

export interface Project {
  slug: string;
  name: string;
  /**
   * repo path in owner/name format
   * @example "brillout/vite-plugin-ssr"
   */
  full_name: string;
  /**
   * repo description
   */
  description: string;
  stars: number;
  trends: {
    daily: number;
    weekly?: number | undefined;
    monthly?: number | undefined;
    yearly?: number | undefined;
  };
  tags: string[];
  contributor_count: number | null;
  /**
   * @example "2022-11-18"
   */
  pushed_at: string;
  owner_id: number;
  /**
   * @example "2021-01-28"
   */
  created_at: string;
  /**
   * site url
   * @example "https://vite-plugin-ssr.com"
   */
  url?: string | undefined;
  /**
   * @example "main"
   */
  branch?: string | undefined;
  /**
   * npm package name
   * @example "vite-plugin-ssr"
   */
  npm?: string | undefined;
  downloads?: number | undefined;
  icon?: string | undefined;
}
