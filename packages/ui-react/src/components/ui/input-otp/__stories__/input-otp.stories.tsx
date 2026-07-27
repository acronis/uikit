import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputOTP } from '../input-otp';

const meta = {
  title: 'UI/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  argTypes: {
    length: {
      control: 'number',
      description: 'Number of single-character slots.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '6' },
        category: 'Appearance',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables every slot.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    error: {
      control: 'boolean',
      description: 'Switches every slot to the error treatment.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    autoFocus: {
      control: 'boolean',
      description: 'Focuses the first slot on mount.',
      table: { type: { summary: 'boolean' }, category: 'Behavior' },
    },
    value: {
      control: 'text',
      description: 'Controlled value (the digits entered so far, left to right).',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    defaultValue: {
      control: 'text',
      description: 'Initial value for uncontrolled usage.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    onChange: {
      control: false,
      description: 'Fires with the full value on every change.',
      table: {
        type: { summary: '(value: string) => void' },
        category: 'Events',
      },
    },
    onComplete: {
      control: false,
      description: 'Fires once, the moment the value reaches `length` characters.',
      table: {
        type: { summary: '(value: string) => void' },
        category: 'Events',
      },
    },
    slotAriaLabel: {
      control: false,
      description:
        'Builds the accessible name for a slot from its 1-based index and the total length.',
      table: {
        type: { summary: '(index: number, length: number) => string' },
        defaultValue: { summary: "(index, length) => `Digit ${index} of ${length}`" },
        category: 'Content',
      },
    },
  },
} satisfies Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Autofocus: Story = {
  args: { autoFocus: true },
};

export const Filled: Story = {
  args: { defaultValue: '123456' },
};

export const ErrorState: Story = {
  name: 'Error',
  args: { error: true, defaultValue: '123456' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '123456' },
};

export const CustomLength: Story = {
  args: { length: 4 },
};
