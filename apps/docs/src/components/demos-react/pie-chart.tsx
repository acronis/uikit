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
  Chrome: { label: 'Chrome' },
  Safari: { label: 'Safari' },
  Firefox: {
    label: 'Firefox'
  },
  Edge: { label: 'Edge' },
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
