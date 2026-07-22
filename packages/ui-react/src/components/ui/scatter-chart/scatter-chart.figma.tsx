// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from the apps/demo ScatterChartPlayground without a "ready for dev"
// Figma node (design-pending v1). ScatterChart is a recharts composition over
// the shared Chart primitives; a Figma node would map a representative scatter
// frame. Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component ScatterChart <url> --update` once mockups land.
import figma from '@figma/code-connect';

import { ScatterChart } from './scatter-chart';

figma.connect(ScatterChart, 'FIGMA_NODE_URL', {
  example: () => (
    <ScatterChart
      xKey="x"
      yKey="y"
      config={{
        a: { label: 'Group A', color: 'var(--ui-background-brand-secondary)' },
      }}
      series={[
        {
          key: 'a',
          data: [
            { x: 2, y: 55 },
            { x: 4, y: 65 },
          ],
        },
      ]}
    />
  ),
});
