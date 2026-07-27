import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputPassword } from '../input-password';

const meta = {
  title: 'UI/InputPassword',
  component: InputPassword,
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
    disabled: {
      control: 'boolean',
      description: 'Disables the field and the show/hide toggle.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    showPasswordLabel: {
      control: 'text',
      description: "Accessible name for the toggle button while the password is hidden.",
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Show password' },
        category: 'Content',
      },
    },
    hidePasswordLabel: {
      control: 'text',
      description: 'Accessible name for the toggle button while the password is shown.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Hide password' },
        category: 'Content',
      },
    },
  },
  args: {
    label: 'Label',
    placeholder: 'Password',
  },
} satisfies Meta<typeof InputPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const WithValue: Story = {
  args: { defaultValue: 'hunter2' },
};

export const WithDescription: Story = {
  args: { description: 'Must be at least 8 characters.' },
};

export const Error: Story = {
  args: { error: 'Enter at least 8 characters', defaultValue: 'short' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'hunter2' },
};
