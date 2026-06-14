"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold text-[#a32d2d]">Application error</p>
      <h1 className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">Something went wrong</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{error.message || "The page could not render."}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
