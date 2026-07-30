// Figma Code Connect — status: NEEDS_FIGMA_URL
// CategoryBar is a design-pending v1 widget (a single proportional bar split
// into colored category segments, with an optional count/% legend and per-
// segment tooltips). There is no "ready for dev" Figma node yet. Replace
// 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component CategoryBar <url> --update` once a mockup lands.
import figma from '@figma/code-connect';

import { CategoryBar } from './category-bar';

figma.connect(CategoryBar, 'FIGMA_NODE_URL', {
  props: {
    showLegend: figma.boolean('Legend'),
  },
  example: ({ showLegend }) => (
    <CategoryBar
      showLegend={showLegend}
      data={[
        { key: 'registered', value: 42 },
        { key: 'certified', value: 18 },
      ]}
      config={{
        registered: {
          label: 'Registered',
          color: 'var(--ui-background-status-strong-info)',
        },
        certified: {
          label: 'Certified',
          color: 'var(--ui-background-status-strong-success)',
        },
      }}
    />
  ),
});
