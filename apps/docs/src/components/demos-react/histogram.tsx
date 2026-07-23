'use client';

import { Histogram, type ChartConfig } from '@acronis-platform/ui-react';

// A roughly bell-shaped sample. Series color is caller-supplied via `config`
// (no chart token tier yet) — here a shared semantic token.
const values = [
  12, 15, 15, 18, 19, 20, 21, 22, 22, 23, 23, 24, 24, 25, 25, 25, 26, 26, 27, 27,
  28, 28, 29, 30, 30, 31, 32, 33, 34, 35, 36, 38, 40, 42, 45, 48, 52, 58, 64, 72,
];

const config = {
  count: { label: 'Frequency', color: 'var(--ui-background-brand-secondary)' },
} satisfies ChartConfig;

export function HistogramDemo() {
  return (
    <Histogram
      config={config}
      values={values}
      binCount={10}
      style={{ height: 320, width: 560 }}
    />
  );
}
