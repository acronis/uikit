'use client';

import { RadialBarChart, type ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { browser: 'Chrome', value: 65 },
  { browser: 'Safari', value: 50 },
  { browser: 'Firefox', value: 35 },
  { browser: 'Edge', value: 25 },
];

// Arc colors come from the chart's default categorical palette.
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
