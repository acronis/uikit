import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '../checkbox';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    defaultChecked: {
      control: 'boolean',
      description: 'Uncontrolled initial checked state.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    checked: {
      control: 'boolean',
      description: 'Controlled checked state.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    indeterminate: {
      control: 'boolean',
      description:
        'Renders the box in the indeterminate (mixed) state, showing a minus glyph.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the box and applies the disabled token set.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    required: {
      control: 'boolean',
      description: 'Marks the control as required for form submission.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    readOnly: {
      control: 'boolean',
      description: 'Prevents the user from changing the checked state.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    name: {
      control: 'text',
      description: 'Form field name submitted with the value.',
      table: { type: { summary: 'string' }, category: 'Behavior' },
    },
    value: {
      control: 'text',
      description: 'Value submitted with the form when checked.',
      table: { type: { summary: 'string' }, category: 'Behavior' },
    },
    label: {
      control: 'text',
      description: 'Optional label rendered beside the box; names the control.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    description: {
      control: 'text',
      description: 'Optional secondary description rendered under the label.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    onCheckedChange: {
      control: false,
      description: 'Fires with the new checked state when toggled.',
      table: {
        type: { summary: '(checked: boolean, event: Event) => void' },
        category: 'Events',
      },
    },
    render: {
      control: false,
      description: 'Base UI render prop for overriding the rendered element.',
      table: { type: { summary: 'ReactElement | function' }, category: 'Composition' },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { 'aria-label': 'Default checkbox' },
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Checkbox aria-label="Unchecked" />
      <Checkbox aria-label="Checked" defaultChecked />
      <Checkbox aria-label="Indeterminate" indeterminate />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Checkbox aria-label="Disabled unchecked" disabled />
      <Checkbox aria-label="Disabled checked" disabled defaultChecked />
      <Checkbox aria-label="Disabled indeterminate" disabled indeterminate />
    </div>
  ),
};

export const WithLabel: Story = {
  args: { label: 'Accept terms', defaultChecked: true },
};

export const WithDescription: Story = {
  args: {
    label: 'Email notifications',
    description: 'Get notified when someone mentions you.',
    defaultChecked: true,
  },
};

export const LabelledVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox label="Unchecked option" />
      <Checkbox label="Checked option" defaultChecked />
      <Checkbox label="Indeterminate option" indeterminate />
      <Checkbox
        label="Disabled option"
        description="This one can't be changed."
        disabled
        defaultChecked
      />
    </div>
  ),
};
