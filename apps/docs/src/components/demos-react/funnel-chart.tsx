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
  Visits: { label: 'Visits' },
  Signups: {
    label: 'Signups'
  },
  Trials: { label: 'Trials' },
  Purchases: {
    label: 'Purchases'
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
