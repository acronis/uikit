// Figma Code Connect — status: COMPLETE
import figma from '@figma/code-connect';

import { Loading } from './loading';

figma.connect(
  Loading,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=4370-2909',
  {
    props: {
      variant: figma.enum('variant', {
        inline: 'inline',
        onSurfacePrimary: 'onSurfacePrimary',
        onSurfaceSecondary: 'onSurfaceSecondary',
        onScreen: 'onScreen',
      }),
      hasLabel: figma.boolean('hasLabel'),
      label: figma.string('Label'),
    },
    example: ({ variant, hasLabel, label }) => (
      <Loading variant={variant} hasLabel={hasLabel} label={label} />
    ),
  }
);
