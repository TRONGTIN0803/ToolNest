import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { ToolCard } from "@/components/tools/tool-card";
import { ToolRunner } from "@/components/tools/tool-runner";
import { getCategory, getRelatedTools, getTool } from "@/lib/api";
import { tools } from "@/lib/tools";
import { siteConfig } from "@/lib/site";

interface ToolPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { data: tool } = await getTool(params.slug);
  if (!tool) return {};

  return {
    title: `${tool.name} Online - Free Browser Tool`,
    description: `Free online ${tool.name}. ${tool.tagline} No signup required. Works in your browser.`,
    alternates: {
      canonical: `/tools/${tool.slug}/`,
    },
    openGraph: {
      url: `/tools/${tool.slug}/`,
      title: `${tool.name} Online - Free Browser Tool`,
      description: `Free online ${tool.name}. ${tool.tagline} No signup required. Works in your browser.`,
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { data: tool, source } = await getTool(params.slug);
  if (!tool) notFound();

  const [{ data: category }, { data: relatedTools }] = await Promise.all([
    getCategory(tool.categorySlug),
    getRelatedTools(tool),
  ]);
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    url: `${siteConfig.url}/tools/${tool.slug}/`,
    description: tool.tagline,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: tool.features,
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
      { "@type": "ListItem", position: 2, name: category?.name ?? "Category", item: `${siteConfig.url}/category/${tool.categorySlug}/` },
      { "@type": "ListItem", position: 3, name: tool.name, item: `${siteConfig.url}/tools/${tool.slug}/` },
    ],
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-0 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_280px] lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className="lg:border-r lg:border-[var(--border-tertiary)] lg:pr-5">
        <nav className="mb-4 text-sm text-[var(--text-secondary)]">
          <a href="/" className="text-[var(--accent)]">Home</a> / <a href={`/category/${category?.slug}`} className="text-[var(--accent)]">{category?.name}</a> / <span>{tool.name}</span>
        </nav>
        <div className="mb-5">
          <h1 className="text-2xl font-semibold">{tool.name}</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{tool.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 font-medium text-[var(--accent)]">{category?.name}</span>
            <span className="rounded-full bg-[#e6f1fb] px-3 py-1 font-medium text-[#0c447c]">{(tool.usageCount / 1000).toFixed(1)}K uses</span>
            <span className="text-[var(--text-tertiary)]">Works offline when possible. No data stored.</span>
          </div>
          {source === "fallback" ? (
            <p className="mt-4 rounded-md border border-[var(--border-tertiary)] bg-white px-3 py-2 text-xs text-[var(--text-tertiary)]">
              Local API is unavailable, showing bundled metadata for this tool.
            </p>
          ) : null}
        </div>

        <ToolRunner tool={tool} />
        <AdSlot slotId="tool_below_result" className="my-5 min-h-16" />

        <section className="mt-6">
          <h2 className="border-b border-[var(--border-tertiary)] pb-2 text-lg font-semibold">How to use {tool.name}</h2>
          <div className="mt-4 grid gap-3">
            {tool.howToUse.map((step, index) => (
              <div key={step} className="flex gap-3 text-sm leading-6 text-[var(--text-secondary)]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent)]">{index + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="border-b border-[var(--border-tertiary)] pb-2 text-lg font-semibold">Frequently asked questions</h2>
          <div className="mt-4 grid gap-4">
            {tool.faq.map((item) => (
              <div key={item.q}>
                <h3 className="text-sm font-semibold">{item.q}</h3>
                <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <aside className="mt-6 grid h-fit gap-4 lg:ml-5 lg:mt-0">
        <AdSlot slotId="tool_sidebar_top" className="min-h-40" />
        <div className="tn-card overflow-hidden">
          <h2 className="border-b border-[var(--border-tertiary)] px-4 py-3 text-sm font-semibold">Related tools</h2>
          <div className="grid gap-3 p-3">
            {relatedTools.map((related) => (
              <ToolCard key={related.slug} tool={related} />
            ))}
          </div>
        </div>
        <AdSlot slotId="tool_sidebar_bottom" className="min-h-64" />
      </aside>
    </div>
  );
}
