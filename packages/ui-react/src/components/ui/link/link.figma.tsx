// Figma Code Connect — status: COMPLETE
// Mapped to the "Link" component set in the shadcn-uikit Figma file.
import figma from '@figma/code-connect';

import { Link } from './link';

figma.connect(
  Link,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=3741-981',
  {
    props: {
      label: figma.string('Label'),
      external: figma.boolean('External'),
      // `state` (idle / hover / active / focused) is a pure interaction
      // pseudo-state; only `disabled` maps to a prop.
      disabled: figma.enum('state', { disabled: true }),
    },
    example: ({ label, external, disabled }) => (
      <Link href="#" external={external} disabled={disabled}>
        {label}
      </Link>
    ),
  }
);
