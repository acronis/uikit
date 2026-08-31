'use client';

import { BarChart, type ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
];

// Series colors come from the chart's default categorical palette.
const config = {
  desktop: { label: 'Desktop' },
  mobile: { label: 'Mobile' },
} satisfies ChartConfig;

export function BarChartDemo() {
  return (
    <BarChart
      config={config}
      data={data}
      dataKeys={['desktop', 'mobile']}
      xKey="month"
      style={{ height: 320, width: 560 }}
    />
  );
}

const breakdown = [
  { label: 'Critical', value: 6, color: 'var(--ui-background-status-strong-danger)' },
  { label: 'High', value: 9, color: 'var(--ui-background-status-strong-warning)' },
  { label: 'Medium', value: 8, color: 'var(--ui-background-status-strong-info)' },
  { label: 'Low', value: 6, color: 'var(--ui-background-status-strong-success)' },
];

export function BarChartHorizontalDemo() {
  return (
    <BarChart
      orientation="horizontal"
      items={breakdown}
      max={breakdown.reduce((sum, item) => sum + item.value, 0)}
      style={{ width: 360 }}
    />
  );
}
