// Figma Code Connect — status: COMPLETE
// Mapped to the "CardFilter" component set in the shadcn-uikit Figma file.
import figma from '@figma/code-connect';

import { CardFilter } from './card-filter';

figma.connect(
  CardFilter,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=3293-2431',
  {
    props: {
      label: figma.string('label'),
      value: figma.string('value'),
      // The "Allowed icon" instance-swap slot maps to the `icon` prop.
      icon: figma.instance('Allowed icon'),
      variant: figma.enum('variant', {
        static: 'static',
        'static-empty': 'static-empty',
        clickable: 'clickable',
      }),
      // The Figma `state` variant encodes pure interaction pseudo-states
      // (hover / active / focused), which only the `clickable` variant has —
      // they are not a React prop.
    },
    example: ({ label, value, icon, variant }) => (
      <CardFilter variant={variant} label={label} value={value} icon={icon} />
    ),
  }
);
