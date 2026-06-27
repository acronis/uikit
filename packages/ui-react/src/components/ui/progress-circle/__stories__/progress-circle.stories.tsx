import type { Meta, StoryObj } from '@storybook/react-vite';

import { ProgressCircle } from '../progress-circle';

const meta = {
  title: 'UI/ProgressCircle',
  component: ProgressCircle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { value: 75, max: 100, size: 'md', showValue: true },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress (0–max).',
      table: { type: { summary: 'number' }, category: 'State' },
    },
    size: {
      control: 'inline-radio',
      options: ['tiny', 'sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'sm' }, category: 'Appearance' },
    },
    status: {
      control: 'inline-radio',
      options: [undefined, 'brand', 'danger', 'critical', 'warning', 'success'],
      description: 'Arc color level; omit to derive from value.',
      table: { category: 'Appearance' },
    },
    showValue: { control: 'boolean', table: { category: 'Content' } },
    showIcon: { control: 'boolean', table: { category: 'Content' } },
  },
} satisfies Meta<typeof ProgressCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <ProgressCircle value={75} size="tiny" />
      <ProgressCircle value={75} size="sm" />
      <ProgressCircle value={75} size="md" showValue />
      <ProgressCircle value={75} size="lg" showValue />
    </div>
  ),
};

export const StatusLevels: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <ProgressCircle value={25} size="md" showValue />
      <ProgressCircle value={50} size="md" showValue />
      <ProgressCircle value={75} size="md" showValue />
      <ProgressCircle value={100} size="md" showValue />
    </div>
  ),
};

// `status="brand"` is the single-color mode for generic progress (no value→color).
export const Brand: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <ProgressCircle value={25} size="md" status="brand" showValue />
      <ProgressCircle value={60} size="md" status="brand" showValue />
      <ProgressCircle value={90} size="md" status="brand" showValue />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <ProgressCircle value={25} size="lg" showIcon />
      <ProgressCircle value={55} size="lg" showIcon />
      <ProgressCircle value={75} size="lg" showIcon />
      <ProgressCircle value={100} size="lg" showIcon />
    </div>
  ),
};

// Mirrors the Cyber-Compliance "Compliance" table cell: a small ring + a label.
export const InTableCell: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <ProgressCircle value={81} size="sm" />
      <span className="text-sm">81%</span>
    </div>
  ),
};
