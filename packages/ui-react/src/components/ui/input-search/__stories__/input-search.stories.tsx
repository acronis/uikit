import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputSearch } from '../input-search';

const meta = {
  title: 'UI/InputSearch',
  component: InputSearch,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Field label rendered above the search box.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    required: {
      control: 'boolean',
      description: 'Appends a required `*` after the label and sets `aria-required`.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
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
      description: 'Disables the field, hides the clear button, and applies the disabled tokens.',
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
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
  },
  decorators: [
    // The ConstrainedWidth story sets up its own flex layout wider than this
    // fixed 256px demo box, so it opts out of the shared decorator.
    (Story, context) =>
      context.name === 'ConstrainedWidth' ? (
        <Story />
      ) : (
        <div className="w-64">
          <Story />
        </div>
      ),
  ],
} satisfies Meta<typeof InputSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const WithValue: Story = {
  args: { defaultValue: 'Value' },
};

export const NoLabel: Story = {
  args: { label: undefined, 'aria-label': 'Search' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Value' },
};

// The field wrapper no longer hardcodes `w-full`, so two fields in the same
// flex row size to their own min-width instead of being force-stretched to
// evenly split the row.
export const ConstrainedWidth: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, width: 400 }}>
      <InputSearch {...args} label="Narrow" />
      <InputSearch {...args} label="Also narrow" />
    </div>
  ),
};
