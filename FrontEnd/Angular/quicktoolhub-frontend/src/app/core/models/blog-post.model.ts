export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author?: string;
  createdAt: string;
  categories?: string[];
  tags?: string[];
  relatedToolSlugs?: string[];
}
