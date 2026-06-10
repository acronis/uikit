// Figma Code Connect — status: COMPLETE
// Mapped to the "Radio" item component set in the shadcn-uikit Figma file.
// `State=ON` selects the item (reflected via the group's defaultValue) and
// `Interaction=Disabled` maps to the item's disabled prop. Default/Hover/Focus
// are visual states with no prop. The label is composed by the consumer.
import figma from '@figma/code-connect';

import { Radio, RadioGroup } from './radio';

figma.connect(
  Radio,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=848-13',
  {
    props: {
      selected: figma.enum('State', {
        ON: 'option',
      }),
      disabled: figma.enum('Interaction', {
        Disabled: true,
      }),
    },
    example: ({ selected, disabled }) => (
      <RadioGroup defaultValue={selected}>
        <Radio value="option" disabled={disabled} />
      </RadioGroup>
    ),
  }
);
