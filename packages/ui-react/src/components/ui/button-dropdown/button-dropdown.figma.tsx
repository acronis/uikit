// Figma Code Connect — status: COMPLETE
// Mapped to the "ButtonDropdown" component set in the shadcn-uikit Figma file.
import figma from '@figma/code-connect';

import { ButtonDropdown } from './button-dropdown';

figma.connect(
  ButtonDropdown,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2542-6423',
  {
    props: {
      label: figma.string('label'),
      variant: figma.enum('variant', {
        primary: 'primary',
        secondary: 'secondary',
      }),
      // The Figma `state` variant encodes interaction states. `active` is the
      // open state (chevron flips up); `disabled` maps to the prop. idle / hover
      // / focus are visual pseudo-states.
      open: figma.enum('state', {
        active: true,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
    },
    example: ({ label, variant, open, disabled }) => (
      <ButtonDropdown variant={variant} open={open} disabled={disabled}>
        {label}
      </ButtonDropdown>
    ),
  }
);
