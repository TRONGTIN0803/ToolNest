import type { Metadata } from "next";
import { SearchPage } from "@/components/search/search-page";
import { getTools } from "@/lib/api";

export const metadata: Metadata = {
  title: "Search Tools - ToolNest",
  description: "Search ToolNest browser-side tools for JSON, text, colors, dates, passwords, encoding, and developer workflows.",
  alternates: {
    canonical: "/search/",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SearchRoute({ searchParams }: { searchParams: { q?: string } }) {
  const { data: tools } = await getTools();
  const initialQuery = typeof searchParams.q === "string" ? searchParams.q : "";

  return <SearchPage tools={tools} initialQuery={initialQuery} />;
}
