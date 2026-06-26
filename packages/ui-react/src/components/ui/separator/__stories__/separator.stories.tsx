import type { Meta, StoryObj } from '@storybook/react-vite';

import { Separator } from '../separator';

const meta = {
  title: 'UI/Separator',
  component: Separator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Divider orientation.',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: 'horizontal' },
        category: 'Appearance',
      },
    },
    className: {
      control: false,
      description: 'Additional classes (e.g. spacing).',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Workloads</h4>
        <p className="text-sm text-muted-foreground">
          Manage and protect your devices.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <div>Backup</div>
        <Separator orientation="vertical" />
        <div>Recovery</div>
        <Separator orientation="vertical" />
        <div>Reports</div>
      </div>
    </div>
  ),
};
