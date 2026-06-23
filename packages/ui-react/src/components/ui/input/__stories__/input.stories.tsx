import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '../input';

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: 'Placeholder', 'aria-label': 'Example' },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder shown when the field is empty.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    defaultValue: {
      control: 'text',
      description: 'Uncontrolled initial value.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
      description: 'Native input type.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'text' }, category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input and applies the disabled token set.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Renders the error border and, on focus, the error ring.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    readOnly: {
      control: 'boolean',
      description: 'Makes the value non-editable.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Input aria-label="Idle" placeholder="Placeholder" />
      <Input aria-label="Filled" defaultValue="Value" />
      <Input aria-label="Invalid" defaultValue="Value" aria-invalid />
      <Input aria-label="Disabled" defaultValue="Value" disabled />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-[var(--ui-input-text-global-container-gap)]">
      <label
        htmlFor="email"
        className="text-sm leading-4 text-[var(--ui-input-text-global-label-color-idle)]"
      >
        Email
      </label>
      <Input id="email" type="email" placeholder="name@acronis.com" />
      <p className="text-xs leading-4 text-[var(--ui-input-text-normal-description-color-idle)]">
        We&apos;ll never share your email.
      </p>
    </div>
  ),
};

export const Invalid: Story = {
  name: 'Invalid (with error message)',
  render: () => (
    <div className="flex w-64 flex-col gap-[var(--ui-input-text-global-container-gap)]">
      <label
        htmlFor="pwd"
        className="text-sm leading-4 text-[var(--ui-input-text-global-label-color-idle)]"
      >
        Password
      </label>
      <Input
        id="pwd"
        type="password"
        defaultValue="123"
        aria-invalid
        aria-describedby="pwd-error"
      />
      <p
        id="pwd-error"
        className="text-xs leading-4 text-[var(--ui-input-text-error-msg-error-color)]"
      >
        Password is too short.
      </p>
    </div>
  ),
};
