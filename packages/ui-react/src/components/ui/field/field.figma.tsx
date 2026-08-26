// Figma Code Connect — status: NEEDS_FIGMA_URL (closest existing marker; the
// status enum has no "intentionally undesigned" value — see
// context/figma-code-connect.md)
// **No design is expected — this is not a TODO.** Field is an intentionally
// headless composition primitive on Base UI's Field: it owns layout and
// label/control/description/error wiring, and its own text styling is bare
// Tailwind by design. The designed thing is whatever control is passed into
// `FieldControl` (e.g. InputText), which carries its own Figma node and Code
// Connect entry. There is no Figma node for Field, no effort to get one, and the
// placeholder URL below exists only so the props/example mapping is recorded.
import figma from '@figma/code-connect';

import { Field, FieldControl, FieldDescription, FieldLabel } from './field';
import { InputBox } from '../input';

figma.connect(Field, 'FIGMA_NODE_URL', {
  props: {
    orientation: figma.enum('Orientation', {
      vertical: 'vertical',
      horizontal: 'horizontal',
    }),
  },
  example: ({ orientation }) => (
    <Field orientation={orientation}>
      <FieldLabel>Label</FieldLabel>
      <FieldControl render={<InputBox />} />
      <FieldDescription>Description</FieldDescription>
    </Field>
  ),
});
