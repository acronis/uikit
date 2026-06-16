// Figma Code Connect — status: COMPLETE
// Mapped to the "Switch" component set in the shadcn-uikit Figma file.
// `variant=on` maps to checked; `state=disabled` maps to disabled (idle/hover/
// active/focus are visual). `label` is composed by Switch itself, gated by the
// hasLabel boolean.
import figma from '@figma/code-connect';

import { Switch } from './switch';

figma.connect(
  Switch,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=1838-1908',
  {
    props: {
      checked: figma.enum('variant', {
        on: true,
        off: false,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      label: figma.boolean('hasLabel', {
        true: figma.string('label'),
        false: undefined,
      }),
    },
    example: ({ checked, disabled, label }) => (
      <Switch defaultChecked={checked} disabled={disabled} label={label} />
    ),
  }
);
