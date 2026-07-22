'use client';

import { RadialBarChart, type ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { browser: 'Chrome', value: 65 },
  { browser: 'Safari', value: 50 },
  { browser: 'Firefox', value: 35 },
  { browser: 'Edge', value: 25 },
];

// Arc colors are caller-supplied via `config`, keyed by each arc's nameKey value
// (no chart token tier yet) — here referencing the shared semantic brand/status
// tokens.
const config = {
  Chrome: { label: 'Chrome', color: 'var(--ui-background-brand-secondary)' },
  Safari: { label: 'Safari', color: 'var(--ui-background-status-strong-danger)' },
  Firefox: {
    label: 'Firefox',
    color: 'var(--ui-background-status-strong-success)',
  },
  Edge: { label: 'Edge', color: 'var(--ui-background-status-strong-warning)' },
} satisfies ChartConfig;

export function RadialBarChartDemo() {
  return (
    <RadialBarChart
      config={config}
      data={data}
      dataKey="value"
      nameKey="browser"
      style={{ height: 360, width: 360 }}
    />
  );
}
