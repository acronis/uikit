'use client';

import { Search } from '@acronis-platform/ui-react';

export function SearchDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 260 }}>
      <Search placeholder="Search…" />
      <Search placeholder="Prefilled" defaultValue="backup" />
    </div>
  );
}
