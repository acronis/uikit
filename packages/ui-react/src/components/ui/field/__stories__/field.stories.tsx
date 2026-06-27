import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '../../checkbox';
import { InputBox } from '../../input';
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '../field';

const meta = {
  title: 'UI/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal', 'responsive'],
      description:
        'Layout of label vs. control — stacked, inline, or stacked-then-inline at the @md container width.',
      table: {
        type: { summary: "'vertical' | 'horizontal' | 'responsive'" },
        defaultValue: { summary: 'vertical' },
        category: 'Layout',
      },
    },
    invalid: {
      control: 'boolean',
      description:
        'Marks the field invalid (sets data-invalid + the control aria-invalid). Useful with externally controlled validation.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the field and its control.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    name: {
      control: 'text',
      description: 'Identifies the field when a form is submitted.',
      table: { type: { summary: 'string' }, category: 'Form' },
    },
    render: { control: false, table: { category: 'Composition' } },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

// Field auto-wires the label / description / error to a native control rendered
// through FieldControl (here the bare InputBox primitive).
export const Default: Story = {
  render: (args) => (
    <Field {...args} className="w-[320px]">
      <FieldLabel>Email</FieldLabel>
      <FieldControl render={<InputBox placeholder="you@example.com" />} />
      <FieldDescription>We&apos;ll never share your email.</FieldDescription>
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field invalid className="w-[320px]">
      <FieldLabel>Email</FieldLabel>
      <FieldControl
        render={<InputBox type="email" defaultValue="notanemail" />}
      />
      <FieldError match>Please enter a valid email address.</FieldError>
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field disabled className="w-[320px]">
      <FieldLabel>Email</FieldLabel>
      <FieldControl render={<InputBox placeholder="you@example.com" />} />
      <FieldDescription>This field is disabled.</FieldDescription>
    </Field>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Field orientation="horizontal" className="w-[360px]">
      <FieldLabel>Workspace</FieldLabel>
      <FieldControl render={<InputBox placeholder="acme" />} />
    </Field>
  ),
};

// FieldSet + FieldLegend group related controls. Checkbox/Switch carry their own
// label, so the set just provides the legend + spacing.
export const CheckboxGroup: Story = {
  render: () => (
    <FieldSet className="w-[360px]">
      <FieldLegend>Notifications</FieldLegend>
      <FieldGroup className="mt-1 gap-3">
        <Checkbox
          defaultChecked
          label="Product updates"
          description="New features and improvements."
        />
        <Checkbox label="Security alerts" description="Important account notices." />
        <Checkbox label="Marketing" description="Offers and newsletters." />
      </FieldGroup>
    </FieldSet>
  ),
};

export const GroupedWithSeparator: Story = {
  render: () => (
    <FieldGroup className="w-[320px]">
      <Field>
        <FieldLabel>First name</FieldLabel>
        <FieldControl render={<InputBox placeholder="Ada" />} />
      </Field>
      <FieldSeparator>and</FieldSeparator>
      <Field>
        <FieldLabel>Last name</FieldLabel>
        <FieldControl render={<InputBox placeholder="Lovelace" />} />
      </Field>
    </FieldGroup>
  ),
};
