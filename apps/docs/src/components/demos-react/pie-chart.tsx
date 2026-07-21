'use client';

import { PieChart, type ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { browser: 'Chrome', value: 275 },
  { browser: 'Safari', value: 200 },
  { browser: 'Firefox', value: 187 },
  { browser: 'Edge', value: 173 },
];

// Slice colors are caller-supplied via `config`, keyed by each slice's nameKey
// value (no chart token tier yet) — here referencing the shared semantic
// brand/status tokens.
const config = {
  Chrome: { label: 'Chrome', color: 'var(--ui-background-brand-secondary)' },
  Safari: { label: 'Safari', color: 'var(--ui-background-status-strong-danger)' },
  Firefox: {
    label: 'Firefox',
    color: 'var(--ui-background-status-strong-success)',
  },
  Edge: { label: 'Edge', color: 'var(--ui-background-status-strong-warning)' },
} satisfies ChartConfig;

export function PieChartDemo() {
  return (
    <PieChart
      config={config}
      data={data}
      dataKey="value"
      nameKey="browser"
      shape="donut"
      style={{ height: 360, width: 360 }}
    />
  );
}
