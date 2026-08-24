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
  Chrome: { label: 'Chrome' },
  Safari: { label: 'Safari' },
  Firefox: {
    label: 'Firefox'
  },
  Edge: { label: 'Edge' },
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
