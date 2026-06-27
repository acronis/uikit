import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../../field';
import { InputBox } from '../../input';
import { Form } from '../form';

const meta = {
  title: 'UI/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    validationMode: {
      control: 'inline-radio',
      options: ['onSubmit', 'onBlur', 'onChange'],
      description: 'When fields validate.',
      table: {
        type: { summary: "'onSubmit' | 'onBlur' | 'onChange'" },
        defaultValue: { summary: 'onSubmit' },
        category: 'Validation',
      },
    },
    errors: {
      control: false,
      description: 'Server-side errors keyed by field name.',
      table: { category: 'Validation' },
    },
    onFormSubmit: {
      control: false,
      description: 'Called with the collected field values when all fields are valid.',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

// Form coordinates the Fields natively — it collects values by each Field's `name`,
// validates on submit, and calls onFormSubmit only when every field is valid.
export const Default: Story = {
  args: { validationMode: 'onSubmit' },
  render: (args) => (
    <Form {...args} onFormSubmit={() => {}} className="w-[360px]">
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl render={<InputBox type="email" placeholder="you@example.com" required />} />
        <FieldDescription>We&apos;ll never share your email.</FieldDescription>
      </Field>
      <Field name="password">
        <FieldLabel>Password</FieldLabel>
        <FieldControl render={<InputBox type="password" required />} />
      </Field>
      <Button type="submit">Sign in</Button>
    </Form>
  ),
};

export const WithServerErrors: Story = {
  render: () => (
    <Form
      onFormSubmit={() => {}}
      errors={{ email: 'That email is already registered.' }}
      className="w-[360px]"
    >
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl render={<InputBox type="email" defaultValue="ada@example.com" />} />
        <FieldError />
      </Field>
      <Button type="submit">Create account</Button>
    </Form>
  ),
};
