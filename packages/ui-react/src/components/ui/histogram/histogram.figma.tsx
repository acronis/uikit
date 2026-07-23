// Figma Code Connect — status: NEEDS_FIGMA_URL
// Histogram is a design-pending v1 recharts composition (BarChart + binning)
// over the shared Chart primitives; there is no "ready for dev" Figma node yet.
// A node would map a representative distribution frame with its bin-count knob.
// Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component Histogram <url> --update` once mockups land.
import figma from '@figma/code-connect';

import { Histogram } from './histogram';

figma.connect(Histogram, 'FIGMA_NODE_URL', {
  example: () => (
    <Histogram
      binCount={10}
      values={[1, 2, 2, 3, 3, 3, 4, 4, 5]}
      config={{
        count: {
          label: 'Frequency',
          color: 'var(--ui-background-brand-secondary)',
        },
      }}
    />
  ),
});
