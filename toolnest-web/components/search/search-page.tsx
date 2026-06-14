"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Search } from "lucide-react";
import { Tool } from "@/lib/tools";
import { ToolCard } from "@/components/tools/tool-card";

type SearchSource = "local" | "api";

type SearchPost = {
  title: string;
  slug: string;
  excerpt: string;
};

type ApiSearchTool = {
  name: string;
  slug: string;
  tagline?: string | null;
};

type ApiSearchPost = {
  title: string;
  slug: string;
  excerpt?: string | null;
};

type ApiSearchResponse = {
  tools?: ApiSearchTool[] | { data?: ApiSearchTool[] };
  posts?: ApiSearchPost[] | { data?: ApiSearchPost[] };
};

type ApiSuggestion = {
  name: string;
  slug: string;
  tagline?: string | null;
};

export function SearchPage({ tools, initialQuery }: { tools: Tool[]; initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [apiTools, setApiTools] = useState<Tool[] | null>(null);
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [suggestions, setSuggestions] = useState<ApiSuggestion[]>([]);
  const [source, setSource] = useState<SearchSource>("local");

  const fallbackSuggestions = useMemo(() => tools.slice(0, 8).map((tool) => ({ name: tool.name, slug: tool.slug, tagline: tool.tagline })), [tools]);

  const localTools = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return tools.slice(0, 12);

    return tools
      .filter((tool) =>
        [tool.name, tool.slug, tool.tagline, tool.description, tool.categorySlug, ...tool.features]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
      .slice(0, 20);
  }, [query, tools]);

  const displayedTools = apiTools ?? localTools;
  const displayedSuggestions = suggestions.length ? suggestions : fallbackSuggestions;

  useEffect(() => {
    const nextUrl = query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search";
    window.history.replaceState(null, "", nextUrl);
  }, [query]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    const term = query.trim();

    if (!apiUrl || !term) {
      setApiTools(null);
      setPosts([]);
      setSource("local");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const [searchResponse, suggestionResponse] = await Promise.all([
          fetch(`${apiUrl}/search?q=${encodeURIComponent(term)}`, { signal: controller.signal, headers: { Accept: "application/json" } }),
          fetch(`${apiUrl}/search/suggestions?q=${encodeURIComponent(term)}`, { signal: controller.signal, headers: { Accept: "application/json" } }),
        ]);

        if (!searchResponse.ok) throw new Error("Search API unavailable");

        const searchPayload = (await searchResponse.json()) as ApiSearchResponse;
        const toolMatches = unwrapApiItems(searchPayload.tools)
          .map((item) => tools.find((tool) => tool.slug === item.slug))
          .filter(Boolean) as Tool[];
        const postMatches = unwrapApiItems(searchPayload.posts).map((post) => ({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
        }));

        setApiTools(toolMatches.length ? toolMatches : []);
        setPosts(postMatches);
        setSource("api");

        if (suggestionResponse.ok) {
          const suggestionPayload = (await suggestionResponse.json()) as { suggestions?: ApiSuggestion[] };
          setSuggestions(suggestionPayload.suggestions ?? []);
        }
      } catch {
        if (!controller.signal.aborted) {
          setApiTools(null);
          setPosts([]);
          setSource("local");
        }
      }
    }, 180);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, tools]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
      <section className="border-b border-[var(--border-tertiary)] pb-6">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Search ToolNest</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          Find browser-side tools for JSON, text, colors, dates, passwords, encoding, and developer workflows.
        </p>
        <label className="mt-5 flex max-w-2xl items-center gap-3 rounded-md border border-[var(--border-secondary)] bg-white px-4 py-3 text-sm text-[var(--text-secondary)] shadow-sm">
          <Search size={18} strokeWidth={1.8} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--text-tertiary)]"
            placeholder="Search JSON, Base64, contrast, timestamp..."
            type="search"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {displayedSuggestions.slice(0, 8).map((item) => (
            <button
              key={item.slug}
              onClick={() => setQuery(item.name)}
              className="tn-focus rounded-full border border-[var(--border-tertiary)] bg-white px-3 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--accent)]"
            >
              {item.name}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">
            Tools <span className="text-sm font-normal text-[var(--text-tertiary)]">({displayedTools.length})</span>
          </h2>
          <span className="rounded-full border border-[var(--border-tertiary)] bg-[var(--background-secondary)] px-3 py-1 text-xs text-[var(--text-tertiary)]">
            {source === "api" ? "API results" : "Local catalog"}
          </span>
        </div>
        {displayedTools.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {displayedTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="tn-card px-4 py-8 text-center">
            <p className="text-sm font-medium text-[var(--text-primary)]">No tools found</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Try a broader query like text, color, JSON, date, or password.</p>
          </div>
        )}
      </section>

      {posts.length ? (
        <section className="mt-8 border-t border-[var(--border-tertiary)] pt-6">
          <h2 className="mb-4 text-base font-semibold">Posts</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="tn-card group block p-4 transition hover:border-[var(--border-primary)]">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[var(--accent)]">
                    <FileText size={17} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold group-hover:text-[var(--accent)]">{post.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">{post.excerpt}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)]">
                      Read
                      <ArrowRight size={13} strokeWidth={1.8} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function unwrapApiItems<T>(value: T[] | { data?: T[] } | undefined): T[] {
  if (Array.isArray(value)) return value;
  return value?.data ?? [];
}
