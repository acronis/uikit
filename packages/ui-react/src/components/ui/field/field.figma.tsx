// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node, rebuilt on Base UI's
// Field. A Figma node would map a labelled field (label / control / description /
// error). Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component Field <url> --update`.
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
