// Figma Code Connect — CalendarPanel: status COMPLETE
// Mapped to the "Calendar" component set in the ui-react Figma file (node
// 8148:10167). Property names verified via get_context_for_code_connect:
// `variant` (variant enum: single | multiple | range). Figma's `state`
// (idle | selected) is demo-only — it's react-day-picker's runtime selection
// state, not a component prop, so it has no mapping below. The day cell is
// Figma's "CalendarItem" (node 8148:9005), implemented here as `CalendarItem`
// — usable only as react-day-picker's `DayButton` override (it needs
// DayPicker's own `day`/`modifiers` props), so it has no Code Connect mapping
// of its own.
import figma from '@figma/code-connect';

import { CalendarPanel } from './calendar-panel';

figma.connect(
  CalendarPanel,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=8148-10167',
  {
    props: {
      variant: figma.enum('variant', {
        single: 'single',
        multiple: 'multiple',
        range: 'range',
      }),
    },
    example: ({ variant }) => <CalendarPanel variant={variant} />,
  }
);
