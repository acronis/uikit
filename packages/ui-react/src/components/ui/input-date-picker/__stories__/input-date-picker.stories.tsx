import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputDatePicker } from '../input-date-picker';

const meta = {
  title: 'UI/InputDatePicker',
  component: InputDatePicker,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Field label rendered above the box.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    required: {
      control: 'boolean',
      description: 'Appends a required `*` after the label and sets `aria-required`.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    description: {
      control: 'text',
      description: 'Helper text below the box (hidden while `error` is set).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    error: {
      control: 'text',
      description:
        'Error message below the box; its presence switches the field to the error treatment.',
      table: { type: { summary: 'ReactNode' }, category: 'State' },
    },
    pickerType: {
      control: 'select',
      options: ['date', 'dateRange'],
      description: 'Single date or a start–end range.',
      table: { type: { summary: "'date' | 'dateRange'" }, defaultValue: { summary: 'date' }, category: 'Appearance' },
    },
    placeholder: {
      control: 'text',
      description: 'Hint shown when no value is selected.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    value: {
      control: 'text',
      description: 'Formatted selected date (`pickerType="date"`).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    startDate: {
      control: 'text',
      description: 'Formatted range start (`pickerType="dateRange"`).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    endDate: {
      control: 'text',
      description: 'Formatted range end (`pickerType="dateRange"`).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    open: {
      control: 'boolean',
      description: 'Whether the consumer-owned calendar is open — paints the active border.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the trigger and applies the disabled token set.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    onClick: {
      control: false,
      description: 'Fired when the trigger is activated (open your calendar here).',
      table: { type: { summary: '(event) => void' }, category: 'Events' },
    },
  },
  args: {
    label: 'Label',
    placeholder: 'Date placeholder',
    description: 'Description message',
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const WithValue: Story = {
  args: { value: 'Jun 15, 2026', description: undefined },
};

export const Range: Story = {
  args: {
    pickerType: 'dateRange',
    placeholder: 'Range placeholder',
    startDate: 'Jun 1, 2026',
    endDate: 'Jun 30, 2026',
    description: undefined,
  },
};

export const Open: Story = {
  args: { value: 'Jun 15, 2026', open: true, description: undefined },
};

export const Error: Story = {
  args: { error: 'Pick a valid date', description: undefined },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Jun 15, 2026' },
};
