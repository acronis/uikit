'use client';

import { RadarChart, type ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { subject: 'Math', alice: 120, bob: 110 },
  { subject: 'Chinese', alice: 98, bob: 130 },
  { subject: 'English', alice: 86, bob: 130 },
  { subject: 'Geography', alice: 99, bob: 100 },
  { subject: 'Physics', alice: 85, bob: 90 },
  { subject: 'History', alice: 65, bob: 85 },
];

// Series colors are caller-supplied via `config` (no chart token tier yet) —
// here referencing the shared semantic brand/status tokens.
const config = {
  alice: { label: 'Alice', color: 'var(--ui-background-brand-secondary)' },
  bob: { label: 'Bob', color: 'var(--ui-background-status-strong-danger)' },
} satisfies ChartConfig;

export function RadarChartDemo() {
  return (
    <RadarChart
      config={config}
      data={data}
      dataKeys={['alice', 'bob']}
      angleKey="subject"
      style={{ height: 380, width: 420 }}
    />
  );
}
