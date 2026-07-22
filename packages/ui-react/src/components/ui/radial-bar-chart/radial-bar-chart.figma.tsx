// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from the apps/demo RadialChartPlayground without a "ready for dev" Figma
// node (design-pending v1). RadialBarChart is a recharts composition over the
// shared Chart primitives; a Figma node would map a representative radial-bar
// frame. Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component RadialBarChart <url> --update` once mockups land.
import figma from '@figma/code-connect';

import { RadialBarChart } from './radial-bar-chart';

figma.connect(RadialBarChart, 'FIGMA_NODE_URL', {
  example: () => (
    <RadialBarChart
      dataKey="value"
      nameKey="browser"
      config={{
        Chrome: { label: 'Chrome', color: 'var(--ui-background-brand-secondary)' },
        Safari: {
          label: 'Safari',
          color: 'var(--ui-background-status-strong-danger)',
        },
      }}
      data={[
        { browser: 'Chrome', value: 65 },
        { browser: 'Safari', value: 50 },
      ]}
    />
  ),
});
