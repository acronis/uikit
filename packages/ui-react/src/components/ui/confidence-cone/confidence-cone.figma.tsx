// Figma Code Connect — status: NEEDS_FIGMA_URL
// ConfidenceCone is a design-pending v1 recharts composition (ComposedChart:
// actual line + dashed forecast line + a shaded prediction band) over the shared
// Chart primitives; there is no "ready for dev" Figma node yet. Replace
// 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component ConfidenceCone <url> --update` once mockups land.
import figma from '@figma/code-connect';

import { ConfidenceCone } from './confidence-cone';

figma.connect(ConfidenceCone, 'FIGMA_NODE_URL', {
  example: () => (
    <ConfidenceCone
      data={[
        { month: 'May', actual: 141 },
        { month: 'Jun', actual: 150, forecast: 150, lower: 150, upper: 150 },
        { month: 'Jul', forecast: 162, lower: 150, upper: 176 },
      ]}
      config={{
        actual: { label: 'Actual', color: 'var(--ui-background-brand-secondary)' },
        forecast: {
          label: 'Forecast',
          color: 'var(--ui-background-brand-secondary)',
        },
      }}
      xKey="month"
      actualKey="actual"
      forecastKey="forecast"
      lowerKey="lower"
      upperKey="upper"
    />
  ),
});
