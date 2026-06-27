'use client';

import {
  Button,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  Form,
  InputBox,
} from '@acronis-platform/ui-react';

export function FormDemo() {
  return (
    <Form
      onFormSubmit={() => {}}
      className="flex flex-col gap-6"
      style={{ width: 360 }}
    >
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl render={<InputBox type="email" placeholder="you@example.com" required />} />
        <FieldDescription>We&apos;ll never share your email.</FieldDescription>
        <FieldError />
      </Field>
      <Field name="password">
        <FieldLabel>Password</FieldLabel>
        <FieldControl render={<InputBox type="password" required />} />
        <FieldError />
      </Field>
      <Button type="submit">Sign in</Button>
    </Form>
  );
}
