'use client';

import { Link } from '@acronis-platform/ui-react';

export function LinkDemo() {
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Link href="#">Documentation</Link>
      <Link href="#" external>
        Open in console
      </Link>
      <Link href="#" disabled>
        Unavailable
      </Link>
    </div>
  );
}
