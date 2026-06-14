"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
          <p style={{ color: "#a32d2d", fontWeight: 600 }}>Application error</p>
          <h1>ToolNest could not render</h1>
          <p>{error.message || "A rendering error occurred."}</p>
          <button onClick={reset}>Try again</button>
        </main>
      </body>
    </html>
  );
}
