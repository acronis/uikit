// Figma Code Connect — status: COMPLETE
// Mapped to the "FilterChips" component in the ui-react Figma file. Its single
// `ListChips` slot maps to `children` via `figma.children('ListChips')` — the
// slot holds the `Chip` instances *and* the trailing ghost "Reset filters"
// Button, so the generated snippet nests all of them inside `FilterChipsList`.
// The button comes out through Button's own Code Connect mapping rather than as
// `FilterChipsReset`; prefer `FilterChipsReset` when writing the composition by
// hand, since it carries the ghost variant and the default label.
import * as React from 'react';
import figma from '@figma/code-connect';

import { FilterChips, FilterChipsList } from './filter-chips';

figma.connect(
  FilterChips,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3897-7039',
  {
    props: {
      chips: figma.children('ListChips'),
    },
    example: ({ chips }: { chips: React.ReactNode }) => (
      <FilterChips>
        <FilterChipsList>{chips}</FilterChipsList>
      </FilterChips>
    ),
  }
);
