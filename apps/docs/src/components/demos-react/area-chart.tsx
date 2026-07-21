'use client';

import { AreaChart, type ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 173, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
];

// Series colors are caller-supplied via `config` (no chart token tier yet) —
// here referencing the shared semantic brand/status tokens.
const config = {
  desktop: { label: 'Desktop', color: 'var(--ui-background-brand-secondary)' },
  mobile: { label: 'Mobile', color: 'var(--ui-background-status-strong-danger)' },
} satisfies ChartConfig;

export function AreaChartDemo() {
  return (
    <AreaChart
      config={config}
      data={data}
      dataKeys={['desktop', 'mobile']}
      xKey="month"
      style={{ height: 320, width: 560 }}
    />
  );
}
