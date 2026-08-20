'use client';

import { Link } from '@acronis-platform/ui-react';

export function LinkDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <Link href="#">Documentation</Link>
        <Link href="#" external>
          Open in console
        </Link>
        <Link href="#" disabled>
          Unavailable
        </Link>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          padding: 16,
          borderRadius: 4,
          background: 'var(--ui-background-backdrop-screen)',
        }}
      >
        <Link href="#" variant="inverse">
          Documentation
        </Link>
        <Link href="#" variant="inverse">
          Release notes
        </Link>
      </div>
    </div>
  );
}
