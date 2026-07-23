'use client';

import { Meter } from '@acronis-platform/ui-react';

// Stacked into a ranked breakdown: several meters sharing one `max` (the total),
// sorted by value. Fill color is caller-supplied per row.
const rows = [
  { label: 'Critical', value: 6, color: 'var(--ui-background-status-strong-danger)' },
  { label: 'High', value: 9, color: 'var(--ui-background-status-strong-warning)' },
  { label: 'Medium', value: 8, color: 'var(--ui-background-status-strong-info)' },
  { label: 'Low', value: 6, color: 'var(--ui-background-status-strong-success)' },
];
const total = rows.reduce((sum, r) => sum + r.value, 0);

export function MeterDemo() {
  return (
    <div className="flex w-[360px] flex-col gap-4">
      {[...rows]
        .sort((a, b) => b.value - a.value)
        .map((r) => (
          <Meter
            key={r.label}
            label={r.label}
            value={r.value}
            max={total}
            color={r.color}
          />
        ))}
    </div>
  );
}
