// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy; no "ready for dev" Figma node exists yet, so the node
// URL below is a placeholder. Props are mapped from the ported contract. Fill in
// the real node URL and set status to COMPLETE via
// `/figma-component Calendar <url> --update`.
import figma from '@figma/code-connect';

import { Calendar } from './calendar';

figma.connect(Calendar, 'FIGMA_NODE_URL', {
  props: {
    mode: figma.enum('Mode', {
      Single: 'single',
      Range: 'range',
      Multiple: 'multiple',
    }),
    numberOfMonths: figma.enum('Months', {
      One: 1,
      Two: 2,
    }),
  },
  example: ({ numberOfMonths }: { numberOfMonths: number }) => (
    <Calendar mode="range" numberOfMonths={numberOfMonths} />
  ),
});
