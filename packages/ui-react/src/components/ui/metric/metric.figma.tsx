// Figma Code Connect — status: COMPLETE
// Node: https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=9735-6306&m=dev
import figma from '@figma/code-connect';

import { Metric } from './metric';

figma.connect(Metric, 'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=9735-6306', {
  props: {
    value: figma.string('Value'),
    unit: figma.string('Unit'),
  },
  example: ({ value, unit }) => <Metric value={value} unit={unit} />,
});
