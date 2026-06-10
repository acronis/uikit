// Figma Code Connect — status: COMPLETE
// Mapped to the "Search-Table" component set in the shadcn-uikit Figma file.
// `State=Disabled` maps to disabled; `State=Filled` seeds a value (which reveals
// the clear button). Idle/Hover/Focused are visual states with no prop.
import figma from '@figma/code-connect';

import { Search } from './search';

figma.connect(
  Search,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=1852-2314',
  {
    props: {
      disabled: figma.enum('State', {
        Disabled: true,
      }),
      defaultValue: figma.enum('State', {
        Filled: 'Request',
      }),
    },
    example: ({ disabled, defaultValue }) => (
      <Search
        placeholder="Search table"
        defaultValue={defaultValue}
        disabled={disabled}
      />
    ),
  }
);
