// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from the apps/demo ChartPlayground (Line) without a "ready for dev"
// Figma node (design-pending v1). LineChart is a recharts composition over the
// shared Chart primitives; a Figma node would map a representative line-chart
// frame with its curve / line-style variants. Replace 'FIGMA_NODE_URL' and flip
// to COMPLETE via `/figma-component LineChart <url> --update` once mockups land.
import figma from '@figma/code-connect';

import { LineChart } from './line-chart';

figma.connect(LineChart, 'FIGMA_NODE_URL', {
  props: {
    curve: figma.enum('Curve', {
      Linear: 'linear',
      Monotone: 'monotone',
      Step: 'step',
    }),
    lineStyle: figma.enum('Line style', {
      Solid: 'solid',
      Dashed: 'dashed',
    }),
  },
  example: ({ curve, lineStyle }) => (
    <LineChart
      curve={curve}
      lineStyle={lineStyle}
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
