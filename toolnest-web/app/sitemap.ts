import type { MetadataRoute } from "next";
import { categories, tools } from "@/lib/tools";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${siteConfig.url}/`, priority: 1, changeFrequency: "weekly", lastModified: now },
    { url: `${siteConfig.url}/tools/`, priority: 0.9, changeFrequency: "weekly", lastModified: now },
    ...categories.map((category) => ({
      url: `${siteConfig.url}/category/${category.slug}/`,
      priority: 0.75,
      changeFrequency: "weekly" as const,
      lastModified: now,
    })),
    ...tools.map((tool) => ({
      url: `${siteConfig.url}/tools/${tool.slug}/`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
      lastModified: now,
    })),
  ];
}
