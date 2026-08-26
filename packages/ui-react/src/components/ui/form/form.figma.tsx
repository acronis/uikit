// Figma Code Connect — status: NEEDS_FIGMA_URL (closest existing marker; the
// status enum has no "intentionally undesigned" value — see
// context/figma-code-connect.md)
// **No design is expected — this is not a TODO.** Form is an intentionally
// headless composition primitive on Base UI's Form (react-hook-form was dropped):
// it contributes submit/validation plumbing and no visuals of its own. The
// designed things are the Fields and the submit Button it composes, each with its
// own Figma node. There is no Figma node for Form, no effort to get one, and the
// placeholder URL below exists only so the example mapping is recorded.
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
