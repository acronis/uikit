// Figma Code Connect — status: NEEDS_FIGMA_URL
// Metric mirrors the "MetricCard" header from the Cyber-Intelligence Figma file
// (label + caption over an icon badge + value + unit + trend). The node is a
// design reference, not a published "ready for dev" component, so this stays
// unconnected. Replace 'FIGMA_NODE_URL' with the component node and flip to
// COMPLETE via `/figma-component Metric <url> --update` once one is published.
import figma from '@figma/code-connect';

import { Metric } from './metric';

figma.connect(Metric, 'FIGMA_NODE_URL', {
  props: {
    label: figma.string('Label'),
    value: figma.string('Value'),
  },
  example: ({ label, value }) => <Metric label={label} value={value} unit="%" />,
});
