'use client';

import {
  ConfidenceCone,
  type ChartConfig,
} from '@acronis-platform/ui-react';

// Actuals to the hand-off point (Jun), then a forecast with a widening cone.
// Series colors are caller-supplied via `config` (no chart token tier yet).
const data = [
  { month: 'Jan', actual: 100 },
  { month: 'Feb', actual: 118 },
  { month: 'Mar', actual: 112 },
  { month: 'Apr', actual: 130 },
  { month: 'May', actual: 141 },
  { month: 'Jun', actual: 150, forecast: 150, lower: 150, upper: 150 },
  { month: 'Jul', forecast: 162, lower: 150, upper: 176 },
  { month: 'Aug', forecast: 173, lower: 154, upper: 196 },
  { month: 'Sep', forecast: 185, lower: 158, upper: 218 },
  { month: 'Oct', forecast: 198, lower: 160, upper: 240 },
];

const config = {
  actual: { label: 'Actual', color: 'var(--ui-background-brand-secondary)' },
  forecast: {
    label: 'Forecast',
    color: 'var(--ui-background-brand-secondary)',
  },
} satisfies ChartConfig;

export function ConfidenceConeDemo() {
  return (
    <ConfidenceCone
      config={config}
      data={data}
      xKey="month"
      actualKey="actual"
      forecastKey="forecast"
      lowerKey="lower"
      upperKey="upper"
      style={{ height: 320, width: 560 }}
    />
  );
}
