// Figma Code Connect — status: COMPLETE
// Mapped to the "Select" component set in the shadcn-uikit Figma file.
// `State=Disabled` maps to disabled; `Content=Value` seeds a selected value
// (otherwise the placeholder shows). Idle/Hover/Focused are visual states with
// no prop (hover/open/focus are driven by Base UI + the form tokens).
import figma from '@figma/code-connect';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

figma.connect(
  Select,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=1846-1815',
  {
    props: {
      disabled: figma.enum('State', {
        Disabled: true,
      }),
      defaultValue: figma.enum('Content', {
        Value: 'value',
      }),
    },
    example: ({ disabled, defaultValue }) => (
      <Select
        disabled={disabled}
        defaultValue={defaultValue}
        items={{ value: 'Value' }}
      >
        <SelectTrigger aria-label="Label">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="value">Value</SelectItem>
        </SelectContent>
      </Select>
    ),
  }
);
