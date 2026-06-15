// Figma Code Connect — status: COMPLETE
// Mapped to the "Switch" component set in the shadcn-uikit Figma file.
// `State=ON` maps to checked; `Interaction=Disabled` maps to disabled.
// Default/Hover/Focus are visual states with no prop (Base UI + the
// `--ui-switch-*` / `--ui-focus-primary` tokens drive them).
import figma from '@figma/code-connect';

import { Switch } from './switch';

figma.connect(
  Switch,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=1838-1908',
  {
    props: {
      checked: figma.enum('State', {
        ON: true,
        OFF: false,
      }),
      disabled: figma.enum('Interaction', {
        Disabled: true,
      }),
    },
    example: ({ checked, disabled }) => (
      <Switch
        aria-label="Setting"
        defaultChecked={checked}
        disabled={disabled}
      />
    ),
  }
);
