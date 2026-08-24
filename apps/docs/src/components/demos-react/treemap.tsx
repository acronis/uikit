'use client';

import { Treemap, type ChartConfig } from '@acronis-platform/ui-react';

const data = [
  { name: 'React', size: 2400, count: 24 },
  { name: 'Vue', size: 1600, count: 16 },
  { name: 'Angular', size: 1200, count: 12 },
  { name: 'Svelte', size: 800, count: 8 },
  { name: 'Solid', size: 500, count: 5 },
];

// Cell colors come from the chart's default categorical palette.
const config = {
  React: { label: 'React' },
  Vue: { label: 'Vue' },
  Angular: { label: 'Angular' },
  Svelte: { label: 'Svelte' },
  Solid: { label: 'Solid' },
} satisfies ChartConfig;

export function TreemapDemo() {
  return (
    <Treemap
      config={config}
      data={data}
      dataKey="size"
      nameKey="name"
      secondaryKeys={['size', 'count']}
      secondaryFormatter={(value, index) =>
        index === 0 ? `${value} kB` : `${value} files`
      }
      showLegend
      style={{ height: 320, width: 520 }}
    />
  );
}
