// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from the apps/demo BarChartPlayground without a "ready for dev" Figma
// node (design-pending v1). BarChart is a recharts composition over the shared
// Chart primitives; a Figma node would map a representative bar-chart frame with
// its orientation / layout variants. Replace 'FIGMA_NODE_URL' and flip to
// COMPLETE via `/figma-component BarChart <url> --update` once mockups land.
import figma from '@figma/code-connect';

import { BarChart } from './bar-chart';

figma.connect(BarChart, 'FIGMA_NODE_URL', {
  props: {
    orientation: figma.enum('Orientation', {
      Vertical: 'vertical',
      Horizontal: 'horizontal',
    }),
    layout: figma.enum('Layout', {
      Grouped: 'grouped',
      Stacked: 'stacked',
    }),
  },
  example: ({ orientation, layout }) => (
    <BarChart
      orientation={orientation}
      layout={layout}
      xKey="month"
      dataKeys={['desktop', 'mobile']}
      config={{
        desktop: { label: 'Desktop', color: 'var(--ui-background-brand-secondary)' },
        mobile: { label: 'Mobile', color: 'var(--ui-background-status-strong-danger)' },
      }}
      data={[{ month: 'Jan', desktop: 186, mobile: 80 }]}
    />
  ),
});
