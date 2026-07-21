// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from the apps/demo PieChartPlayground without a "ready for dev" Figma
// node (design-pending v1). PieChart is a recharts composition over the shared
// Chart primitives; a Figma node would map a representative pie/donut frame with
// its shape variant. Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component PieChart <url> --update` once mockups land.
import figma from '@figma/code-connect';

import { PieChart } from './pie-chart';

figma.connect(PieChart, 'FIGMA_NODE_URL', {
  props: {
    shape: figma.enum('Shape', {
      Pie: 'pie',
      Donut: 'donut',
    }),
  },
  example: ({ shape }) => (
    <PieChart
      shape={shape}
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
        { browser: 'Chrome', value: 275 },
        { browser: 'Safari', value: 200 },
      ]}
    />
  ),
});
