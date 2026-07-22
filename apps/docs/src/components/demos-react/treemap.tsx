'use client';

import { Treemap, type ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { name: 'React', size: 2400 },
  { name: 'Vue', size: 1600 },
  { name: 'Angular', size: 1200 },
  { name: 'Svelte', size: 800 },
  { name: 'Solid', size: 500 },
];

// Cell colors are caller-supplied via `config`, keyed by each leaf's nameKey
// value (no chart token tier yet) — here referencing the shared semantic
// brand/status tokens.
const config = {
  React: { label: 'React', color: 'var(--ui-background-brand-secondary)' },
  Vue: { label: 'Vue', color: 'var(--ui-background-status-strong-success)' },
  Angular: { label: 'Angular', color: 'var(--ui-background-status-strong-danger)' },
  Svelte: { label: 'Svelte', color: 'var(--ui-background-status-strong-warning)' },
  Solid: { label: 'Solid', color: 'var(--ui-background-status-strong-critical)' },
} satisfies ChartConfig;

export function TreemapDemo() {
  return (
    <Treemap
      config={config}
      data={data}
      dataKey="size"
      nameKey="name"
      style={{ height: 320, width: 520 }}
    />
  );
}
