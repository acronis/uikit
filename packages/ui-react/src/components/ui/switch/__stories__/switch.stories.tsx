import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from '../switch';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Optional text label rendered beside the toggle; names the control.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
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
    disabled: {
      control: 'boolean',
      description: 'Disables the toggle and applies the disabled token set.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    onCheckedChange: {
      control: false,
      description: 'Fires with the new checked state when toggled.',
      table: { type: { summary: '(checked: boolean) => void' }, category: 'Events' },
    },
  },
  args: {
    'aria-label': 'Toggle setting',
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch aria-label="Off" />
      <Switch aria-label="On" defaultChecked />
      <Switch aria-label="Disabled off" disabled />
      <Switch aria-label="Disabled on" disabled defaultChecked />
    </div>
  ),
};

export const WithLabel: Story = {
  args: { label: 'Enable notifications', defaultChecked: true },
};

export const LabelledStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Switch label="Off" />
      <Switch label="On" defaultChecked />
      <Switch label="Disabled" disabled defaultChecked />
    </div>
  ),
};
