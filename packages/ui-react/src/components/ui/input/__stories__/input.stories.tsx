import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '../input';

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: 'Placeholder', 'aria-label': 'Example' },
  argTypes: {
    disabled: { control: 'boolean' },
    type: { control: 'text' },
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
    <div className="flex w-64 flex-col gap-[var(--ui-input-global-container-gap)]">
      <label
        htmlFor="email"
        className="text-sm leading-4 text-[var(--ui-input-global-label-idle)]"
      >
        Email
      </label>
      <Input id="email" type="email" placeholder="name@acronis.com" />
      <p className="text-xs leading-4 text-[var(--ui-input-normal-description-color)]">
        We&apos;ll never share your email.
      </p>
    </div>
  ),
};

export const Invalid: Story = {
  name: 'Invalid (with error message)',
  render: () => (
    <div className="flex w-64 flex-col gap-[var(--ui-input-global-container-gap)]">
      <label
        htmlFor="pwd"
        className="text-sm leading-4 text-[var(--ui-input-global-label-idle)]"
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
        className="text-xs leading-4 text-[var(--ui-input-error-error-color)]"
      >
        Password is too short.
      </p>
    </div>
  ),
};
