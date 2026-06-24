// Figma Code Connect — status: COMPLETE
// Mapped to the "SearchGlobal" component in the shadcn-uikit Figma file. The
// `state` variant (idle/hover/active/focused) is purely visual — driven by CSS
// (:hover / :active / focus-within), so it maps to no prop. `placeholder` is the
// text property.
import figma from '@figma/code-connect';

import { SearchGlobal } from './search-global';

figma.connect(
  SearchGlobal,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2999-116',
  {
    props: {
      placeholder: figma.string('placeholder'),
    },
    example: ({ placeholder }) => <SearchGlobal placeholder={placeholder} />,
  }
);
