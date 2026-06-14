"use client";

import { useMemo, useState } from "react";
import { Flame, Search, SlidersHorizontal } from "lucide-react";
import { Tool } from "@/lib/tools";
import { ToolCard } from "@/components/tools/tool-card";

type SortMode = "popular" | "name";

export function ToolsBrowser({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("popular");

  const filteredTools = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches = term
      ? tools.filter((tool) =>
          [tool.name, tool.tagline, tool.description, tool.categorySlug, ...tool.features]
            .join(" ")
            .toLowerCase()
            .includes(term),
        )
      : tools;

    return [...matches].sort((a, b) => {
      if (sortMode === "name") return a.name.localeCompare(b.name);
      return b.usageCount - a.usageCount || a.name.localeCompare(b.name);
    });
  }, [query, sortMode, tools]);

  return (
    <section className="mt-5 lg:ml-5 lg:mt-0">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="flex-1 text-xl font-semibold">
          All tools <span className="text-sm font-normal text-[var(--text-tertiary)]">({filteredTools.length})</span>
        </h1>
        <label className="flex w-full items-center gap-2 rounded-md border border-[var(--border-tertiary)] bg-white px-3 py-2 text-sm text-[var(--text-secondary)] sm:w-64">
          <Search size={15} strokeWidth={1.8} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-tertiary)]"
            placeholder="Filter tools..."
            type="search"
          />
        </label>
        <label className="flex items-center gap-2 rounded-md border border-[var(--border-tertiary)] bg-white px-3 py-2 text-sm text-[var(--text-secondary)]">
          <SlidersHorizontal size={15} strokeWidth={1.8} />
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="bg-transparent text-sm outline-none"
          >
            <option value="popular">Sort: Popular</option>
            <option value="name">Sort: A to Z</option>
          </select>
        </label>
      </div>

      <h2 className="mb-3 flex items-center gap-2 border-b border-[var(--border-tertiary)] pb-3 text-base font-semibold">
        <Flame size={17} className="text-[#e24b4a]" strokeWidth={1.8} />
        Popular tools
      </h2>
      {filteredTools.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="tn-card px-4 py-8 text-center">
          <p className="text-sm font-medium text-[var(--text-primary)]">No tools found</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Try JSON, color, date, password, or text.</p>
        </div>
      )}
    </section>
  );
}
