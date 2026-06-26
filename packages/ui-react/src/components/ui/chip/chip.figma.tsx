// Figma Code Connect — status: COMPLETE
// Mapped to the "Chip" component set in the shadcn-uikit Figma file.
import figma from '@figma/code-connect';

import { Chip } from './chip';

figma.connect(
  Chip,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=912-272218',
  {
    props: {
      // `type` is the only design variant that maps to a prop; `state`
      // (idle/hover/active/focused) is interaction state, handled in CSS.
      variant: figma.enum('type', {
        removable: 'removable',
        selectable: 'selectable',
      }),
      label: figma.string('Label#917:73'),
      icon: figma.boolean('hasIcon#912:37', {
        true: figma.instance('Icon#912:45'),
        false: undefined,
      }),
    },
    example: ({ variant, label, icon }) => (
      <Chip variant={variant} icon={icon}>
        {label}
      </Chip>
    ),
  }
);
