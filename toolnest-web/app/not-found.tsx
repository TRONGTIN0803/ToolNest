import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold text-[var(--accent)]">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
        The page you opened does not exist yet, or the route has moved during the rebuild.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
      >
        Back to homepage
      </Link>
    </div>
  );
}
