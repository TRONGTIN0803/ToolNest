export type ToolCategory = 'Text' | 'Developer' | 'Calculator' | 'Image';

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  id: number;
  name: string;
  slug: string;
  category: ToolCategory;
  description: string;
  keyword: string;
  icon: string;
  howToUse: string[];
  useCases: string[];
  faqs: ToolFaq[];
  relatedSlugs: string[];
}
