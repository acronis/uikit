// Figma Code Connect — status: NEEDS_FIGMA_URL
// The loading / empty / error placeholder shown in place of a chart. The
// visual reference is the Figma InputSelect dropdown states node
// (design-pending v1); there is no dedicated chart-state "ready for dev" node
// yet, so this stays unconnected. Replace 'FIGMA_NODE_URL' and flip to COMPLETE
// via `/figma-component ChartState <url> --update` once a chart-specific mockup
// lands.
import figma from '@figma/code-connect';

import { ChartState } from './chart-state';

figma.connect(ChartState, 'FIGMA_NODE_URL', {
  props: {
    state: figma.enum('State', {
      Loading: 'loading',
      Empty: 'empty',
      Error: 'error',
    }),
  },
  example: ({ state }) => <ChartState state={state} />,
});
