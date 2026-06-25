'use client';

import { InputSearch } from '@acronis-platform/ui-react';

export function InputSearchDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 260 }}>
      <InputSearch label="Find a workload" placeholder="Search workloads…" />
      <InputSearch label="Disabled" placeholder="Search…" disabled />
    </div>
  );
}
