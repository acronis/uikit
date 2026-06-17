import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputTextArea } from '../input-text-area';

const meta = {
  title: 'UI/InputTextArea',
  component: InputTextArea,
  tags: ['autodocs'],
  args: { placeholder: 'Placeholder', 'aria-label': 'Example' },
  argTypes: {
    disabled: { control: 'boolean' },
    rows: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputTextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <InputTextArea aria-label="Idle" placeholder="Placeholder" />
      <InputTextArea aria-label="Filled" defaultValue="Value" />
      <InputTextArea aria-label="Invalid" defaultValue="Value" aria-invalid />
      <InputTextArea aria-label="Disabled" defaultValue="Value" disabled />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-[var(--ui-input-text-area-container-gap)]">
      <label
        htmlFor="bio"
        className="text-sm leading-4 text-[var(--ui-input-text-area-label-color-idle)]"
      >
        Bio
      </label>
      <InputTextArea id="bio" placeholder="Tell us about yourself" />
      <p className="text-xs leading-4 text-[var(--ui-input-text-area-description-color-idle)]">
        A short description shown on your profile.
      </p>
    </div>
  ),
};

export const Invalid: Story = {
  name: 'Invalid (with error message)',
  render: () => (
    <div className="flex w-64 flex-col gap-[var(--ui-input-text-area-container-gap)]">
      <label
        htmlFor="comment"
        className="text-sm leading-4 text-[var(--ui-input-text-area-label-color-idle)]"
      >
        Comment
        <span className="text-[var(--ui-input-text-area-required-color)]"> *</span>
      </label>
      <InputTextArea
        id="comment"
        defaultValue="Too short"
        aria-invalid
        aria-describedby="comment-error"
      />
      <p
        id="comment-error"
        className="text-xs leading-4 text-[var(--ui-input-text-area-required-color)]"
      >
        Comment must be at least 20 characters.
      </p>
    </div>
  ),
};
