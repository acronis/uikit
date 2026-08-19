// Figma Code Connect — status: COMPLETE
// Mapped to the "Chip" component set in the ui-react Figma file.
import figma from '@figma/code-connect';

import { Chip } from './chip';

figma.connect(
  Chip,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=912-272218',
  {
    props: {
      // `type` is the only design variant that maps to a prop; `state`
      // (idle/hover/active/focused) is interaction state, handled in CSS.
      // The design's `Clossable` boolean is vestigial — no layer references it
      // (the × is driven by `type=dismissable`), so it maps to nothing.
      variant: figma.enum('type', {
        dismissable: 'removable',
        selectable: 'selectable',
        operational: 'operational',
      }),
      label: figma.string('Label'),
      icon: figma.boolean('hasIcon', {
        true: figma.instance('Icon'),
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
