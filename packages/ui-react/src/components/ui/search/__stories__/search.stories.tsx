import type { Meta, StoryObj } from '@storybook/react-vite';

import { Search } from '../search';

const meta = {
  title: 'UI/Search',
  component: Search,
  tags: ['autodocs'],
  args: { placeholder: 'Search table', 'aria-label': 'Search' },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder shown when the field is empty.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    defaultValue: {
      control: 'text',
      description: 'Uncontrolled initial value (the clear button appears once non-empty).',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the field, hides the clear button, and applies the disabled token set.',
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
    onClear: {
      control: false,
      description: 'Called when the clear (×) button is pressed, after the value is cleared.',
      table: { type: { summary: '() => void' }, category: 'Events' },
    },
    onChange: {
      control: false,
      description: 'Native change handler; also fires when the value is cleared.',
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
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Search aria-label="Idle" placeholder="Search table" />
      <Search aria-label="Filled" defaultValue="Request" />
      <Search aria-label="Disabled" defaultValue="Request" disabled />
    </div>
  ),
};
