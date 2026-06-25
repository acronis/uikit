import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputTextArea } from '../input-text-area';

const meta = {
  title: 'UI/InputTextArea',
  component: InputTextArea,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Field label rendered above the textarea.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    required: {
      control: 'boolean',
      description: 'Appends a required `*` after the label and sets `aria-required`.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    description: {
      control: 'text',
      description: 'Helper text below the textarea (hidden while `error` is set).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    error: {
      control: 'text',
      description:
        'Error message below the textarea; its presence switches the field to the error treatment.',
      table: { type: { summary: 'ReactNode' }, category: 'State' },
    },
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
      description: 'Marks the textarea invalid directly (alternative to `error`).',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    onChange: {
      control: false,
      description: 'Native change handler.',
      table: { type: { summary: '(event) => void' }, category: 'Events' },
    },
  },
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    description: 'Description message',
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

export const Required: Story = {
  args: { required: true },
};

export const WithValue: Story = {
  args: { defaultValue: 'Value', description: undefined },
};

export const Error: Story = {
  args: { error: 'Error message', description: undefined },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Value' },
};

// Bare usage — no label/description; the box renders on its own.
export const Bare: Story = {
  args: { label: undefined, description: undefined, 'aria-label': 'Notes' },
};
