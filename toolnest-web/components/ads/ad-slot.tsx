"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Megaphone, Sparkles } from "lucide-react";
import clsx from "clsx";

interface AdSlotProps {
  slotId: string;
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  className?: string;
}

const fallbackSlots: Record<
  string,
  {
    eyebrow: string;
    title: string;
    body: string;
    href: string;
    action: string;
    variant: "banner" | "sidebar";
  }
> = {
  home_banner: {
    eyebrow: "Ad space reserved",
    title: "ToolNest browser tools are live",
    body: "JSON, Base64, UUID, Regex and text utilities are ready to use.",
    href: "/tools",
    action: "Browse",
    variant: "banner",
  },
  tool_below_result: {
    eyebrow: "Ad space reserved",
    title: "Need another quick utility?",
    body: "Jump back to the ToolNest library and keep working in your browser.",
    href: "/tools",
    action: "All tools",
    variant: "banner",
  },
  tool_sidebar_top: {
    eyebrow: "Sponsor slot",
    title: "Future partner banner",
    body: "This space is marked for a relevant sponsor once ads are enabled.",
    href: "/tools",
    action: "Explore",
    variant: "sidebar",
  },
  tool_sidebar_bottom: {
    eyebrow: "Sponsor slot",
    title: "Reserved ad placement",
    body: "A larger sidebar placement is ready for future campaigns.",
    href: "/tools",
    action: "Browse tools",
    variant: "sidebar",
  },
};

export function AdSlot({ slotId, format = "auto", className }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!ref.current || !publisherId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          try {
            ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
          } catch {}
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [publisherId]);

  if (process.env.NODE_ENV === "development" || !publisherId) {
    const fallback = fallbackSlots[slotId];
    if (fallback) return <AdSlotFallback innerRef={ref} slotId={slotId} fallback={fallback} className={className} />;

    return (
      <div
        ref={ref}
        className={clsx(
          "flex min-h-14 items-center justify-center rounded-md border border-dashed border-[var(--border-secondary)] bg-[var(--background-secondary)] text-xs text-[var(--text-tertiary)]",
          className,
        )}
      >
        Advertisement: {slotId}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

function AdSlotFallback({
  innerRef,
  slotId,
  fallback,
  className,
}: {
  innerRef: React.RefObject<HTMLDivElement>;
  slotId: string;
  fallback: (typeof fallbackSlots)[string];
  className?: string;
}) {
  const Icon = fallback.variant === "banner" ? Sparkles : Megaphone;
  const isBanner = fallback.variant === "banner";

  return (
    <div
      ref={innerRef}
      data-ad-slot={slotId}
      data-ad-placeholder="true"
      className={clsx(
        "overflow-hidden rounded-md border border-dashed border-[var(--border-secondary)] bg-[var(--background-secondary)] text-sm shadow-sm",
        isBanner ? "flex items-center justify-between gap-3 px-4 py-3" : "flex flex-col justify-between gap-3 p-4",
        className,
      )}
    >
      <div className={clsx("min-w-0", isBanner ? "flex items-center gap-3" : "grid gap-3")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[var(--accent)]">
          <Icon size={17} strokeWidth={1.8} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-normal text-[var(--text-tertiary)]">
            {fallback.eyebrow} · {slotId}
          </p>
          <p className="mt-1 line-clamp-2 font-medium leading-5 text-[var(--text-primary)]">{fallback.title}</p>
          <p className={clsx("mt-1 text-xs leading-5 text-[var(--text-secondary)]", isBanner ? "hidden sm:block" : "")}>{fallback.body}</p>
        </div>
      </div>
      <Link
        href={fallback.href}
        className={clsx(
          "tn-focus flex shrink-0 items-center justify-center gap-1 rounded-md bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white",
          isBanner ? "" : "w-full",
        )}
      >
        {fallback.action}
        <ArrowRight size={13} strokeWidth={1.8} />
      </Link>
    </div>
  );
}
