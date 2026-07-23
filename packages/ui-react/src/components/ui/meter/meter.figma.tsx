// Figma Code Connect — status: NEEDS_FIGMA_URL
// Meter is a design-pending v1 widget (a labelled proportional bar with a
// tooltip, stackable into a ranked breakdown). There is no "ready for dev"
// Figma node yet. Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component Meter <url> --update` once a mockup lands.
import figma from '@figma/code-connect';

import { Meter } from './meter';

figma.connect(Meter, 'FIGMA_NODE_URL', {
  props: {
    label: figma.string('Label'),
  },
  example: ({ label }) => (
    <Meter
      label={label}
      value={6}
      max={29}
      color="var(--ui-background-status-strong-danger)"
    />
  ),
});
