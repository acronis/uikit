// Figma Code Connect — status: COMPLETE
// Two connects, mirroring the two component sets on the Figma "ButtonGroup"
// page: the `ButtonGroup` container (node 7975:3479, `variant` =
// outlined / inlined) and the `ButtonGroupItem` it holds (node 5558:17506).
//
// `ButtonGroupItem`'s own variants intentionally map to no code props:
// - `order` (first / middle / last) only selects whether the trailing separator
//   is drawn, which the component derives from `:last-child`. It does exist as
//   an optional prop, but only as an escape hatch for compositions that defeat
//   that derivation — emitting it here would teach the non-idiomatic form as the
//   default in every snippet a designer copies out of Dev Mode.
// - `state` (idle / hover / active / focused) are CSS pseudo-classes.
//
// The container's `hasTimer` boolean property is deliberately NOT mapped: it is
// declared on the component set but bound to no layer in either variant, so it
// has no visual effect — a vestigial artifact pending confirmation from design.
import figma from '@figma/code-connect';

import { ButtonGroup, ButtonGroupItem } from './button-group';

figma.connect(
  ButtonGroup,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7975-3479',
  {
    props: {
      // Matches the Figma `variant` property on the container.
      variant: figma.enum('variant', {
        outlined: 'outlined',
        inlined: 'inlined',
      }),
      // Every nested `ButtonGroupItem` — both the direct first/last children
      // and whatever fills the `ListItem` slot in between.
      items: figma.children('*'),
    },
    example: ({ variant, items }) => (
      <ButtonGroup aria-label="View mode" variant={variant}>
        {items}
      </ButtonGroup>
    ),
  }
);

figma.connect(
  ButtonGroupItem,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=5558-17506',
  {
    example: () => (
      <ButtonGroupItem aria-label="Action">{/* icon */}</ButtonGroupItem>
    ),
  }
);
