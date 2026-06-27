// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node, rebuilt on Base UI's
// Form (dropping react-hook-form). A Figma node would map a form layout of Fields
// + a submit action. Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component Form <url> --update`.
import figma from '@figma/code-connect';

import { Form } from './form';
import { Field, FieldControl, FieldLabel } from '../field';
import { InputBox } from '../input';
import { Button } from '../button';

figma.connect(Form, 'FIGMA_NODE_URL', {
  example: () => (
    <Form onFormSubmit={() => {}}>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl render={<InputBox />} />
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  ),
});
