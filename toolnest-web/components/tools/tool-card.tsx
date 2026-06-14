import Link from "next/link";
import { Users } from "lucide-react";
import { getCategory, Tool, toolIcons } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = toolIcons[tool.icon];
  const category = getCategory(tool.categorySlug);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="tn-card group block p-4 transition hover:border-[var(--border-primary)] hover:shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[var(--accent)]">
          <Icon size={18} strokeWidth={1.8} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)]">{tool.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">{tool.tagline}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--accent)]">
          {category?.name.replace(" tools", "")}
        </span>
        {tool.isNew ? <span className="rounded-full bg-[#eaf3de] px-2 py-0.5 text-[10px] font-medium text-[#27500a]">New</span> : null}
        {tool.isFeatured ? <span className="rounded-full bg-[#e6f1fb] px-2 py-0.5 text-[10px] font-medium text-[#0c447c]">Hot</span> : null}
        <span className="ml-auto flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
          <Users size={11} strokeWidth={1.8} />
          {(tool.usageCount / 1000).toFixed(1)}K
        </span>
      </div>
    </Link>
  );
}
