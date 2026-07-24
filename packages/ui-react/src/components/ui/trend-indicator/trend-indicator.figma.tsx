// Figma Code Connect — status: NEEDS_FIGMA_URL
// TrendIndicator is a design-pending v1 presentational primitive (a direction
// glyph + change value + comparison label, with a direction/sentiment split).
// There is no "ready for dev" Figma node yet. Replace 'FIGMA_NODE_URL' and flip
// to COMPLETE via `/figma-component TrendIndicator <url> --update` once a mockup
// lands.
import figma from '@figma/code-connect';

import { TrendIndicator } from './trend-indicator';

figma.connect(TrendIndicator, 'FIGMA_NODE_URL', {
  props: {
    value: figma.string('Value'),
  },
  example: ({ value }) => (
    <TrendIndicator
      direction="up"
      sentiment="positive"
      value={value}
      comparisonLabel="vs previous quarter"
    />
  ),
});
