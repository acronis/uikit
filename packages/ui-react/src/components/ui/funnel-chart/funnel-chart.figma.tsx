// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from the apps/demo FunnelChartPlayground without a "ready for dev" Figma
// node (design-pending v1). FunnelChart is a recharts composition over the shared
// Chart primitives; a Figma node would map a representative funnel frame with its
// lastShape variant. Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component FunnelChart <url> --update` once mockups land.
import figma from '@figma/code-connect';

import { FunnelChart } from './funnel-chart';

figma.connect(FunnelChart, 'FIGMA_NODE_URL', {
  props: {
    lastShape: figma.enum('Last shape', {
      Triangle: 'triangle',
      Rectangle: 'rectangle',
    }),
  },
  example: ({ lastShape }) => (
    <FunnelChart
      lastShape={lastShape}
      dataKey="value"
      nameKey="stage"
      config={{
        Visits: { label: 'Visits', color: 'var(--ui-background-brand-secondary)' },
        Signups: {
          label: 'Signups',
          color: 'var(--ui-background-status-strong-success)',
        },
      }}
      data={[
        { stage: 'Visits', value: 5000 },
        { stage: 'Signups', value: 2600 },
      ]}
    />
  ),
});
