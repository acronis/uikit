'use client';

import Link from 'next/link';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground">An unexpected error occurred.</p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="text-primary underline underline-offset-4 hover:text-primary/80"
        >
          Try again
        </button>
        <Link
          href="/docs"
          className="text-primary underline underline-offset-4 hover:text-primary/80"
        >
          Back to documentation
        </Link>
      </div>
    </div>
  );
}
