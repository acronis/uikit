'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Client-side redirect for docs pages that moved during the content
 * restructuring. The site is a static export deployed to GitHub Pages,
 * so `next.config.mjs`'s `redirects()` never runs in production —
 * this is the only redirect mechanism that works post-deploy.
 */
export function LegacyRedirect({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [router, to]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">This page has moved.</p>
      <Link
        href={to}
        className="text-primary underline underline-offset-4 hover:opacity-80"
      >
        Continue to the new page
      </Link>
    </div>
  );
}
