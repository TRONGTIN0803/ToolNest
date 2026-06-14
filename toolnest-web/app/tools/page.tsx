import type { Metadata } from "next";
import { LayoutGrid } from "lucide-react";
import { ToolsBrowser } from "@/components/tools/tools-browser";
import { getCategories, getTools } from "@/lib/api";

export const metadata: Metadata = {
  title: "Free Online Tools",
  description: "Browse free browser-side tools for JSON, Base64, UUIDs, regex, text, colors, dates, passwords, and developer workflows.",
  alternates: {
    canonical: "/tools/",
  },
  openGraph: {
    url: "/tools/",
    title: "Free Online Tools",
    description: "Browse free browser-side tools for JSON, Base64, UUIDs, regex, text, colors, dates, passwords, and developer workflows.",
  },
};

export default async function ToolsPage() {
  const [categoriesResult, toolsResult] = await Promise.all([getCategories(), getTools()]);
  const categories = categoriesResult.data;
  const tools = toolsResult.data;
  const apiOffline = categoriesResult.source === "fallback" || toolsResult.source === "fallback";
  const categoryCounts = new Map(
    categories.map((category) => [
      category.slug,
      tools.filter((tool) => tool.categorySlug === category.slug).length,
    ]),
  );

  return (
    <div className="mx-auto grid max-w-7xl gap-0 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
      <aside className="tn-card h-fit p-4 lg:sticky lg:top-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Categories</h2>
        <div className="mt-3 grid gap-1">
          <a className="flex items-center gap-2 rounded-md bg-[var(--accent-soft)] px-3 py-2 text-sm font-medium text-[var(--accent)]" href="/tools">
            <LayoutGrid size={15} strokeWidth={1.8} />
            All tools
            <span className="ml-auto rounded-full bg-[#b5d4f4] px-2 py-0.5 text-xs">{tools.length}</span>
          </a>
          {categories.map((category) => (
            <a key={category.slug} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--background-secondary)]" href={`/category/${category.slug}`}>
              <LayoutGrid size={15} strokeWidth={1.8} />
              {category.name}
              <span className="ml-auto rounded-full bg-[var(--background-secondary)] px-2 py-0.5 text-xs text-[var(--text-tertiary)]">{categoryCounts.get(category.slug) ?? 0}</span>
            </a>
          ))}
        </div>
        {apiOffline ? (
          <p className="mt-4 rounded-md border border-[var(--border-tertiary)] bg-[var(--background-secondary)] px-3 py-2 text-xs leading-5 text-[var(--text-tertiary)]">
            Showing bundled catalog while the local API is unavailable.
          </p>
        ) : null}
      </aside>

      <ToolsBrowser tools={tools} />
    </div>
  );
}
