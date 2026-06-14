import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolCard } from "@/components/tools/tool-card";
import { getCategory, getToolsByCategory } from "@/lib/api";
import { categories, ToolCategorySlug } from "@/lib/tools";
import { siteConfig } from "@/lib/site";

interface CategoryPageProps {
  params: { slug: ToolCategorySlug };
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { data: category } = await getCategory(params.slug);
  if (!category) return {};

  return {
    title: `${category.name} Online`,
    description: category.description,
    alternates: {
      canonical: `/category/${category.slug}/`,
    },
    openGraph: {
      url: `/category/${category.slug}/`,
      title: `${category.name} Online | ${siteConfig.name}`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [{ data: category, source }, { data: categoryTools }] = await Promise.all([
    getCategory(params.slug),
    getToolsByCategory(params.slug),
  ]);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-5 text-sm text-[var(--text-secondary)]">
        <a href="/" className="text-[var(--accent)]">Home</a> / <span>{category.name}</span>
      </nav>
      <h1 className="text-2xl font-semibold">{category.name}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">{category.description}</p>
      {source === "fallback" ? (
        <p className="mt-4 max-w-2xl rounded-md border border-[var(--border-tertiary)] bg-white px-3 py-2 text-xs text-[var(--text-tertiary)]">
          Local API is unavailable, showing the bundled category catalog.
        </p>
      ) : null}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categoryTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
