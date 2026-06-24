import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputText } from '../input-text';

const meta = {
  title: 'UI/InputText',
  component: InputText,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Field label rendered above the input.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    required: {
      control: 'boolean',
      description: 'Appends a required `*` after the label.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    description: {
      control: 'text',
      description: 'Helper text below the input (hidden while `error` is set).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    error: {
      control: 'text',
      description:
        'Error message below the input; its presence switches the field to the error treatment.',
      table: { type: { summary: 'ReactNode' }, category: 'State' },
    },
    clearable: {
      control: 'boolean',
      description: 'Show a clear (✕) button while the field has a value.',
      table: { type: { summary: 'boolean' }, category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the field.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
  },
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    description: 'Description message',
  },
} satisfies Meta<typeof InputText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const WithValue: Story = {
  args: { defaultValue: 'Value', description: undefined },
};

export const Clearable: Story = {
  args: { clearable: true, value: 'Value', onChange: () => {} },
};

export const Error: Story = {
  args: { error: 'Error message', description: undefined },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Value' },
};
