// Figma Code Connect — status: COMPLETE
// Mapped to the "FilterCards" component in the ui-react Figma file. The
// `ListCards` slot maps to `children` via `figma.children('ListCards')` —
// pass a list of `CardFilter` elements.
import * as React from 'react';
import figma from '@figma/code-connect';

import { FilterCards } from './filter-cards';

figma.connect(
  FilterCards,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3278-6606',
  {
    props: {
      cards: figma.children('ListCards'),
    },
    example: ({ cards }: { cards: React.ReactNode }) => (
      <FilterCards>{cards}</FilterCards>
    ),
  }
);
