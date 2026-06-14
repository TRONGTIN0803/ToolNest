import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LayoutGrid, Search, Flame } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { ToolCard } from "@/components/tools/tool-card";
import { getCategories, getFeaturedTools, getTools } from "@/lib/api";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Free Online Tools for Developers & Freelancers`,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    title: `${siteConfig.name} | Free Online Tools for Developers & Freelancers`,
    description: siteConfig.description,
  },
};

export default async function HomePage() {
  const [categoriesResult, featuredResult, toolsResult] = await Promise.all([
    getCategories(),
    getFeaturedTools(),
    getTools(),
  ]);
  const categories = categoriesResult.data;
  const featured = featuredResult.data.slice(0, 8);
  const tools = toolsResult.data;
  const apiOffline = categoriesResult.source === "fallback" || featuredResult.source === "fallback" || toolsResult.source === "fallback";
  const categoryCounts = new Map(
    categories.map((category) => [
      category.slug,
      tools.filter((tool) => tool.categorySlug === category.slug).length,
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteConfig.name,
            url: `${siteConfig.url}/`,
            potentialAction: {
              "@type": "SearchAction",
              target: `${siteConfig.url}/search/?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <section className="border-b border-[var(--border-tertiary)] bg-[var(--background-secondary)] px-4 py-12 text-center sm:px-6">
        <h1 className="mx-auto max-w-3xl text-3xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-4xl">
          Free online tools for developers & freelancers
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          40+ tools. No signup. No download. Works instantly in your browser.
        </p>
        <Link
          href="/tools"
          className="mx-auto mt-7 flex max-w-xl items-center gap-3 rounded-full border border-[var(--border-secondary)] bg-white px-5 py-3 text-left text-sm text-[var(--text-tertiary)] shadow-sm"
        >
          <Search size={18} strokeWidth={1.8} />
          Search tools: JSON, Base64, UUID, Color...
        </Link>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["JSON Formatter", "Base64", "UUID Generator", "Color Picker", "Regex Tester", "Word Counter"].map((tag) => (
            <span key={tag} className="rounded-full border border-[var(--border-tertiary)] bg-white px-3 py-1 text-xs text-[var(--text-secondary)]">
              {tag}
            </span>
          ))}
        </div>
        {apiOffline ? (
          <p className="mx-auto mt-4 max-w-2xl rounded-md border border-[var(--border-tertiary)] bg-white px-3 py-2 text-xs text-[var(--text-tertiary)]">
            Local API is unavailable, showing the bundled ToolNest catalog.
          </p>
        ) : null}
      </section>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <AdSlot slotId="home_banner" className="min-h-16" />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Flame size={18} className="text-[#e24b4a]" strokeWidth={1.8} />
            Popular tools
          </h2>
          <Link href="/tools" className="flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
            View all
            <ArrowRight size={14} strokeWidth={1.8} />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-t border-[var(--border-tertiary)] px-4 py-7 sm:px-6 lg:px-8">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
          <LayoutGrid size={18} className="text-[var(--accent)]" strokeWidth={1.8} />
          Browse by category
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`} className="tn-card flex items-center gap-3 p-4 transition hover:border-[var(--border-primary)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[var(--accent)]">
                <LayoutGrid size={18} strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{category.name}</h3>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">{categoryCounts.get(category.slug) ?? 0} tools. {category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
