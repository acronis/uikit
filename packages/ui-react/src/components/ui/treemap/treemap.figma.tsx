// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from the apps/demo TreemapChartPlayground without a "ready for dev"
// Figma node (design-pending v1). Treemap is a recharts composition over the
// shared Chart primitives; a Figma node would map a representative treemap frame.
// Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component Treemap <url> --update` once mockups land.
import figma from '@figma/code-connect';

import { Treemap } from './treemap';

figma.connect(Treemap, 'FIGMA_NODE_URL', {
  example: () => (
    <Treemap
      dataKey="size"
      nameKey="name"
      config={{
        React: { label: 'React', color: 'var(--ui-background-brand-secondary)' },
        Vue: { label: 'Vue', color: 'var(--ui-background-status-strong-success)' },
      }}
      data={[
        { name: 'React', size: 2400 },
        { name: 'Vue', size: 1200 },
      ]}
    />
  ),
});
