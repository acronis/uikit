import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputNumPicker } from '../input-num-picker';

const meta = {
  title: 'UI/InputNumPicker',
  component: InputNumPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Field label rendered above the stepper box.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    required: {
      control: 'boolean',
      description: 'Appends a required `*` after the label.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the field and both steppers.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    min: {
      control: 'number',
      description: 'The minimum value of the field.',
      table: { type: { summary: 'number' }, category: 'Behavior' },
    },
    max: {
      control: 'number',
      description: 'The maximum value of the field.',
      table: { type: { summary: 'number' }, category: 'Behavior' },
    },
    step: {
      control: 'number',
      description: 'Amount to increment/decrement with the steppers.',
      table: { type: { summary: 'number' }, category: 'Behavior' },
    },
    defaultValue: {
      control: 'number',
      description: 'Uncontrolled initial numeric value.',
      table: { type: { summary: 'number' }, category: 'Content' },
    },
    value: {
      control: 'number',
      description: 'Controlled numeric value.',
      table: { type: { summary: 'number | null' }, category: 'Content' },
    },
    decrementLabel: {
      control: 'text',
      description: 'Accessible label for the decrement button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Decrease' },
        category: 'Content',
      },
    },
    incrementLabel: {
      control: 'text',
      description: 'Accessible label for the increment button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Increase' },
        category: 'Content',
      },
    },
    onValueChange: {
      control: false,
      description: 'Called when the number value changes.',
      table: { category: 'Events' },
    },
  },
  args: {
    label: 'Label',
    defaultValue: 0,
  },
} satisfies Meta<typeof InputNumPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const WithoutLabel: Story = {
  args: { label: undefined },
};

export const MinMax: Story = {
  args: { defaultValue: 3, min: 0, max: 5 },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 3 },
};
