import Link from "next/link";
import { Lock, Wrench } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-tertiary)] bg-[var(--background-secondary)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
            <Wrench size={17} strokeWidth={1.8} />
            ToolNest
          </div>
          <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
            Free online tools for developers, designers and freelancers. No signup required. Everything runs in your browser where possible.
          </p>
        </div>
        <FooterGroup title="Tools" links={["JSON Formatter", "UUID Generator", "Color Picker", "Regex Tester"]} />
        <FooterGroup title="Categories" links={["Text tools", "Developer", "Color & design", "Time & date"]} />
        <FooterGroup title="Company" links={["About", "Blog", "Privacy policy", "Terms of use"]} />
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between border-t border-[var(--border-tertiary)] px-4 py-4 text-xs text-[var(--text-tertiary)] sm:px-6 lg:px-8">
        <span>© 2026 ToolNest</span>
        <span className="flex items-center gap-2">
          <Lock size={13} strokeWidth={1.8} />
          SSL secured
        </span>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h2>
      <div className="mt-3 grid gap-2">
        {links.map((link) => (
          <Link key={link} href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">
            {link}
          </Link>
        ))}
      </div>
    </div>
  );
}
