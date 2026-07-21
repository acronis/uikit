// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from the apps/demo AreaChartPlayground without a "ready for dev" Figma
// node (design-pending v1). AreaChart is a recharts composition over the shared
// Chart primitives; a Figma node would map a representative area-chart frame with
// its layout / fill variants. Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component AreaChart <url> --update` once mockups land.
import figma from '@figma/code-connect';

import { AreaChart } from './area-chart';

figma.connect(AreaChart, 'FIGMA_NODE_URL', {
  props: {
    layout: figma.enum('Layout', {
      Single: 'single',
      Stacked: 'stacked',
    }),
    fill: figma.enum('Fill', {
      Solid: 'solid',
      Gradient: 'gradient',
    }),
  },
  example: ({ layout, fill }) => (
    <AreaChart
      layout={layout}
      fill={fill}
      xKey="month"
      dataKeys={['desktop', 'mobile']}
      config={{
        desktop: {
          label: 'Desktop',
          color: 'var(--ui-background-brand-secondary)',
        },
        mobile: {
          label: 'Mobile',
          color: 'var(--ui-background-status-strong-danger)',
        },
      }}
      data={[{ month: 'Jan', desktop: 186, mobile: 80 }]}
    />
  ),
});
