'use client';

import { FunnelChart, type ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { stage: 'Visits', value: 5000 },
  { stage: 'Signups', value: 2600 },
  { stage: 'Trials', value: 1400 },
  { stage: 'Purchases', value: 620 },
];

// Stage colors are caller-supplied via `config`, keyed by each stage's nameKey
// value (no chart token tier yet) — here referencing the shared semantic
// brand/status tokens.
const config = {
  Visits: { label: 'Visits', color: 'var(--ui-background-brand-secondary)' },
  Signups: {
    label: 'Signups',
    color: 'var(--ui-background-status-strong-success)',
  },
  Trials: { label: 'Trials', color: 'var(--ui-background-status-strong-warning)' },
  Purchases: {
    label: 'Purchases',
    color: 'var(--ui-background-status-strong-danger)',
  },
} satisfies ChartConfig;

export function FunnelChartDemo() {
  return (
    <FunnelChart
      config={config}
      data={data}
      dataKey="value"
      nameKey="stage"
      style={{ height: 380, width: 460 }}
    />
  );
}
