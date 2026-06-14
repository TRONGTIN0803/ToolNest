import {
  categories as fallbackCategories,
  getCategory as getFallbackCategory,
  getRelatedTools as getFallbackRelatedTools,
  getTool as getFallbackTool,
  getToolsByCategory as getFallbackToolsByCategory,
  Tool,
  Category,
  ToolCategorySlug,
  toolIcons,
  tools as fallbackTools,
} from "@/lib/tools";

const API_URL = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

type ApiCollection<T> = {
  data: T[];
};

type ApiSingle<T> = {
  data: T;
};

type ApiCategory = {
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number | null;
  tool_count?: number | null;
  seo_title?: string | null;
  seo_description?: string | null;
  tools?: ApiTool[];
};

type ApiTool = {
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  how_to_use: string | string[] | null;
  features: string[] | null;
  component_key: string;
  is_featured: boolean;
  is_new: boolean;
  sort_order: number | null;
  usage_count: number | null;
  seo_title?: string | null;
  seo_description?: string | null;
  faq: Tool["faq"] | null;
  related_tools: string[] | null;
  category?: ApiCategory | null;
};

export type ApiResult<T> = {
  data: T;
  source: "api" | "fallback";
};

const iconBySlug: Record<string, Tool["icon"]> = {
  "age-calculator": "calculator",
  base64: "lock",
  "case-converter": "case",
  "character-counter": "type",
  "color-picker": "palette",
  "contrast-checker": "palette",
  "hash-generator": "hash",
  "json-formatter": "json",
  "jwt-decoder": "fingerprint",
  "meta-tag-preview": "globe",
  "password-generator": "password",
  "percentage-calculator": "percent",
  "regex-tester": "regex",
  "slug-generator": "link",
  "timestamp-converter": "timer",
  "timezone-converter": "clock",
  "url-encoder": "link",
  "uuid-generator": "key",
  "word-counter": "text",
};

const iconByComponent: Record<string, Tool["icon"]> = {
  AgeCalculator: "calculator",
  Base64Tool: "lock",
  CaseConverter: "case",
  CharacterCounter: "type",
  ColorPicker: "palette",
  ContrastChecker: "palette",
  HashGenerator: "hash",
  JsonFormatter: "json",
  JwtDecoder: "fingerprint",
  MetaTagPreview: "globe",
  PasswordGenerator: "password",
  PercentageCalc: "percent",
  RegexTester: "regex",
  SlugGenerator: "link",
  TimestampConverter: "timer",
  TimezoneConverter: "clock",
  UrlEncoder: "link",
  UuidGenerator: "key",
  WordCounter: "text",
};

async function fetchApi<T>(path: string): Promise<T | null> {
  if (!API_URL) return null;

  try {
    const response = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return null;

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function isCategorySlug(slug: string): slug is ToolCategorySlug {
  return fallbackCategories.some((category) => category.slug === slug);
}

function textFromHtmlList(value: string): string[] {
  const matches = [...value.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
  if (matches.length > 0) {
    return matches.map((match) => stripHtml(match[1])).filter(Boolean);
  }

  const stripped = stripHtml(value);
  return stripped ? [stripped] : [];
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeHowToUse(value: ApiTool["how_to_use"], fallback?: Tool): string[] {
  if (Array.isArray(value) && value.length > 0) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = textFromHtmlList(value);
    if (parsed.length > 0) return parsed;
  }

  return fallback?.howToUse ?? ["Enter your input.", "Choose the mode you need.", "Copy or download the result."];
}

function normalizeCategory(category: ApiCategory): Category | null {
  if (!isCategorySlug(category.slug)) return null;
  const fallback = getFallbackCategory(category.slug);

  return {
    name: category.name,
    slug: category.slug,
    description: category.description || fallback?.description || "",
    icon: category.icon || "layout-grid",
    color: category.color || "#185FA5",
    sortOrder: category.sort_order ?? 0,
  };
}

function normalizeTool(tool: ApiTool, parentCategory?: ApiCategory): Tool | null {
  const categorySlug = tool.category?.slug ?? parentCategory?.slug;
  if (!categorySlug || !isCategorySlug(categorySlug)) return null;

  const fallback = getFallbackTool(tool.slug);
  const icon = iconBySlug[tool.slug] ?? iconByComponent[tool.component_key] ?? fallback?.icon ?? "braces";

  if (!(icon in toolIcons)) return null;

  return {
    name: tool.name,
    slug: tool.slug,
    categorySlug,
    tagline: tool.tagline || fallback?.tagline || "",
    description: tool.description || tool.tagline || fallback?.description || "",
    componentKey: tool.component_key,
    icon,
    priority: fallback?.priority ?? 3,
    usageCount: tool.usage_count ?? fallback?.usageCount ?? 0,
    isFeatured: tool.is_featured,
    isNew: tool.is_new,
    features: tool.features?.length ? tool.features : fallback?.features ?? [],
    howToUse: normalizeHowToUse(tool.how_to_use, fallback),
    faq: tool.faq?.length ? tool.faq : fallback?.faq ?? [],
    relatedTools: tool.related_tools?.length ? tool.related_tools : fallback?.relatedTools ?? [],
  };
}

function sortedTools(items: Tool[]) {
  return [...items].sort((a, b) => b.usageCount - a.usageCount || a.name.localeCompare(b.name));
}

export async function getCategories(): Promise<ApiResult<Category[]>> {
  const response = await fetchApi<ApiCollection<ApiCategory>>("/categories");
  const data = response?.data.map(normalizeCategory).filter(Boolean) as Category[] | undefined;

  if (data?.length) return { data, source: "api" };
  return { data: fallbackCategories, source: "fallback" };
}

export async function getTools(): Promise<ApiResult<Tool[]>> {
  const response = await fetchApi<ApiCollection<ApiTool>>("/tools");
  const data = response?.data.map((tool) => normalizeTool(tool)).filter(Boolean) as Tool[] | undefined;

  if (data?.length) return { data: sortedTools(data), source: "api" };
  return { data: sortedTools(fallbackTools), source: "fallback" };
}

export async function getFeaturedTools(): Promise<ApiResult<Tool[]>> {
  const response = await fetchApi<ApiCollection<ApiTool>>("/tools/featured");
  const data = response?.data.map((tool) => normalizeTool(tool)).filter(Boolean) as Tool[] | undefined;

  if (data?.length) return { data: sortedTools(data), source: "api" };
  return { data: sortedTools(fallbackTools.filter((tool) => tool.isFeatured)), source: "fallback" };
}

export async function getCategory(slug: ToolCategorySlug): Promise<ApiResult<Category | null>> {
  const response = await fetchApi<ApiSingle<ApiCategory>>(`/categories/${slug}`);
  const data = response?.data ? normalizeCategory(response.data) : null;

  if (data) return { data, source: "api" };
  return { data: getFallbackCategory(slug) ?? null, source: "fallback" };
}

export async function getToolsByCategory(slug: ToolCategorySlug): Promise<ApiResult<Tool[]>> {
  const response = await fetchApi<ApiSingle<ApiCategory>>(`/categories/${slug}`);
  const data = response?.data.tools?.map((tool) => normalizeTool(tool, response.data)).filter(Boolean) as Tool[] | undefined;

  if (data?.length) return { data: sortedTools(data), source: "api" };
  return { data: sortedTools(getFallbackToolsByCategory(slug)), source: "fallback" };
}

export async function getTool(slug: string): Promise<ApiResult<Tool | null>> {
  const response = await fetchApi<ApiSingle<ApiTool>>(`/tools/${slug}`);
  const data = response?.data ? normalizeTool(response.data) : null;

  if (data) return { data, source: "api" };
  return { data: getFallbackTool(slug) ?? null, source: "fallback" };
}

export async function getRelatedTools(tool: Tool): Promise<ApiResult<Tool[]>> {
  const response = await fetchApi<ApiCollection<ApiTool>>(`/tools/${tool.slug}/related`);
  const data = response?.data.map((tool) => normalizeTool(tool)).filter(Boolean) as Tool[] | undefined;

  if (data?.length) return { data: sortedTools(data), source: "api" };
  return { data: getFallbackRelatedTools(tool), source: "fallback" };
}
