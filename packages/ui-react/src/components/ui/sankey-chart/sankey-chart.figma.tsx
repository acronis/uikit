// Figma Code Connect — status: NEEDS_FIGMA_URL
// Built from recharts' `Sankey` primitive without a "ready for dev" Figma node
// (design-pending v1). SankeyChart is a recharts composition over the shared
// Chart primitives; a Figma node would map a representative flow-diagram frame.
// Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component SankeyChart <url> --update` once mockups land.
import figma from '@figma/code-connect';

import { SankeyChart } from './sankey-chart';

figma.connect(SankeyChart, 'FIGMA_NODE_URL', {
  example: () => (
    <SankeyChart
      config={{
        all: { label: 'All tenants', color: 'var(--ui-background-status-strong-info)' },
        certified: {
          label: 'Certified',
          color: 'var(--ui-background-status-strong-info)',
        },
        expired: {
          label: 'Expired',
          color: 'var(--ui-background-status-strong-danger)',
        },
      }}
      data={{
        nodes: [{ name: 'all' }, { name: 'certified' }, { name: 'expired' }],
        links: [
          { source: 0, target: 1, value: 209 },
          { source: 0, target: 2, value: 31 },
        ],
      }}
    />
  ),
});
