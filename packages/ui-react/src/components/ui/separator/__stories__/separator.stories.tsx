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
    size: {
      control: 'inline-radio',
      options: ['S1', 'S2', 'S3'],
      description: 'Surrounding spacing baked into the rule (Figma: S1/S2/S3).',
      table: {
        type: { summary: "'S1' | 'S2' | 'S3'" },
        defaultValue: { summary: 'S1' },
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

export const Sizes: Story = {
  render: () => (
    <div className="w-[300px]">
      <p className="text-sm">S1 (no spacing)</p>
      <Separator size="S1" />
      <p className="text-sm">S2 (--ui-gap-4)</p>
      <Separator size="S2" />
      <p className="text-sm">S3 (--ui-gap-8)</p>
      <Separator size="S3" />
      <p className="text-sm">End</p>
    </div>
  ),
};

export const VerticalSizes: Story = {
  render: () => (
    <div className="flex h-10 items-center">
      <p className="text-sm">S1 (no spacing)</p>
      <Separator orientation="vertical" size="S1" />
      <p className="text-sm">S2 (--ui-gap-4)</p>
      <Separator orientation="vertical" size="S2" />
      <p className="text-sm">S3 (--ui-gap-8)</p>
      <Separator orientation="vertical" size="S3" />
      <p className="text-sm">End</p>
    </div>
  ),
};
