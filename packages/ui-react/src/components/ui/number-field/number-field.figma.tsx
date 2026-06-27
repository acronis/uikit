// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. A Figma node would
// map the number field (steppers + input box). Replace 'FIGMA_NODE_URL' and flip
// to COMPLETE via `/figma-component NumberField <url> --update`.
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
