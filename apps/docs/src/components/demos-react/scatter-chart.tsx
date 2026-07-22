'use client';

import { ScatterChart, type ChartConfig } from '@acronis-platform/ui-react';

const series = [
  {
    key: 'classA',
    data: [
      { hours: 2, score: 55 },
      { hours: 4, score: 65 },
      { hours: 6, score: 78 },
      { hours: 8, score: 92 },
      { hours: 3, score: 48 },
      { hours: 7, score: 85 },
    ],
  },
  {
    key: 'classB',
    data: [
      { hours: 1, score: 70 },
      { hours: 5, score: 82 },
      { hours: 9, score: 95 },
      { hours: 3, score: 60 },
      { hours: 6, score: 75 },
      { hours: 4, score: 58 },
    ],
  },
];

// Series colors are caller-supplied via `config`, keyed by each series' key (no
// chart token tier yet) — here referencing the shared semantic brand/status
// tokens.
const config = {
  classA: { label: 'Class A', color: 'var(--ui-background-brand-secondary)' },
  classB: { label: 'Class B', color: 'var(--ui-background-status-strong-danger)' },
} satisfies ChartConfig;

export function ScatterChartDemo() {
  return (
    <ScatterChart
      config={config}
      series={series}
      xKey="hours"
      yKey="score"
      style={{ height: 360, width: 520 }}
    />
  );
}
