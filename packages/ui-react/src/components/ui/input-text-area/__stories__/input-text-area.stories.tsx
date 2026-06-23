import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputTextArea } from '../input-text-area';

const meta = {
  title: 'UI/InputTextArea',
  component: InputTextArea,
  tags: ['autodocs'],
  args: { placeholder: 'Placeholder', 'aria-label': 'Example' },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder shown when the textarea is empty.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    defaultValue: {
      control: 'text',
      description: 'Uncontrolled initial value.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    rows: {
      control: 'number',
      description:
        'Number of visible text rows (the box still grows with vertical resize past this height).',
      table: { type: { summary: 'number' }, category: 'Appearance' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the textarea and applies the disabled token set.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Marks the field invalid; on focus the ring swaps to the error color.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    readOnly: {
      control: 'boolean',
      description: 'Makes the value non-editable.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required for form submission.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    onChange: {
      control: false,
      description: 'Native change handler.',
      table: { type: { summary: '(event) => void' }, category: 'Events' },
    },
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
