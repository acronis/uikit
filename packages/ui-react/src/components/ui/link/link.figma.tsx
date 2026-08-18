// Figma Code Connect — status: COMPLETE
// Mapped to the "Link" component set in the ui-react Figma file.
import figma from '@figma/code-connect';

import { Link } from './link';

figma.connect(
  Link,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3741-981',
  {
    props: {
      label: figma.string('Label'),
      // The `SquareArrowUpRight` layer this drives exists only in the
      // `background=normal` variants, so `external` is a no-op on `inverse` — in the
      // component exactly as in Figma.
      external: figma.boolean('External'),
      // `background` selects the surface token set. `normal` is the component's
      // default variant, so it maps to `undefined` and stays out of the example.
      variant: figma.enum('background', { inverse: 'inverse' }),
      // `state` (idle / hover / active / focused) is a pure interaction
      // pseudo-state; only `disabled` maps to a prop. Figma marks `disabled`
      // unsupported on `background=inverse`.
      disabled: figma.enum('state', { disabled: true }),
    },
    example: ({ label, external, disabled, variant }) => (
      <Link href="#" variant={variant} external={external} disabled={disabled}>
        {label}
      </Link>
    ),
  }
);
