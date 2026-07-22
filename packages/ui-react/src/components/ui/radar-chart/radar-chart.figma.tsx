// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from the apps/demo RadarChartPlayground without a "ready for dev" Figma
// node (design-pending v1). RadarChart is a recharts composition over the shared
// Chart primitives; a Figma node would map a representative radar frame with its
// gridType variant. Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component RadarChart <url> --update` once mockups land.
import figma from '@figma/code-connect';

import { RadarChart } from './radar-chart';

figma.connect(RadarChart, 'FIGMA_NODE_URL', {
  props: {
    gridType: figma.enum('Grid type', {
      Polygon: 'polygon',
      Circle: 'circle',
    }),
  },
  example: ({ gridType }) => (
    <RadarChart
      gridType={gridType}
      angleKey="subject"
      dataKeys={['alice', 'bob']}
      config={{
        alice: { label: 'Alice', color: 'var(--ui-background-brand-secondary)' },
        bob: { label: 'Bob', color: 'var(--ui-background-status-strong-danger)' },
      }}
      data={[{ subject: 'Math', alice: 120, bob: 110 }]}
    />
  ),
});
