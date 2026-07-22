// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from the apps/demo ComposedChartPlayground without a "ready for dev"
// Figma node (design-pending v1). ComposedChart is a recharts composition over
// the shared Chart primitives; a Figma node would map a representative
// mixed-series frame. Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component ComposedChart <url> --update` once mockups land.
import figma from '@figma/code-connect';

import { ComposedChart } from './composed-chart';

figma.connect(ComposedChart, 'FIGMA_NODE_URL', {
  example: () => (
    <ComposedChart
      xKey="month"
      series={[
        { key: 'revenue', type: 'bar' },
        { key: 'profit', type: 'line' },
      ]}
      config={{
        revenue: {
          label: 'Revenue',
          color: 'var(--ui-background-brand-secondary)',
        },
        profit: {
          label: 'Profit',
          color: 'var(--ui-background-status-strong-success)',
        },
      }}
      data={[{ month: 'Jan', revenue: 2400, profit: 1600 }]}
    />
  ),
});
