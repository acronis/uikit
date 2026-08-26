// Figma Code Connect — status: NEEDS_FIGMA_URL (closest existing marker; the
// status enum has no "intentionally undesigned" value — see
// context/figma-code-connect.md)
// **No design is expected — this is not a TODO.** No Figma design exists for
// NumberField anywhere: it was ported from ui-legacy, its visuals reuse the
// InputText box + ButtonIcon-style steppers (which carry their own designs and
// Code Connect entries), and there is no active effort to have UX draw a
// dedicated node. The placeholder URL below exists only so the example mapping is
// recorded; if UX ever specs a real node, mark this connection done via
// `/figma-component NumberField <url> --update`.
import figma from '@figma/code-connect';

import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from './number-field';

figma.connect(NumberField, 'FIGMA_NODE_URL', {
  example: () => (
    <NumberField defaultValue={1}>
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  ),
});
