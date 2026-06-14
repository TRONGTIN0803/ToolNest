import Link from "next/link";
import { Search, Wrench } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navItems = [
  { label: "All tools", href: "/tools" },
  { label: "Text", href: "/category/text-tools" },
  { label: "Developer", href: "/category/developer-tools" },
  { label: "Color", href: "/category/color-design" },
  { label: "Time", href: "/category/time-date" },
  { label: "SEO", href: "/category/seo-web" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  return (
    <header className="border-b border-[var(--border-tertiary)] bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
          <Wrench size={18} strokeWidth={1.8} />
          ToolNest
        </Link>
        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/search"
          className="ml-auto flex items-center gap-2 rounded-full border border-[var(--border-tertiary)] bg-[var(--background-secondary)] px-3 py-1.5 text-sm text-[var(--text-secondary)]"
        >
          <Search size={15} strokeWidth={1.8} />
          <span className="hidden sm:inline">Search tools...</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
