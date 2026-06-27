import type { Meta, StoryObj } from '@storybook/react-vite';

import { Slider } from '../slider';

const meta = {
  title: 'UI/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    min: { control: 'number', table: { category: 'Range' } },
    max: { control: 'number', table: { category: 'Range' } },
    step: { control: 'number', table: { category: 'Range' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <Slider defaultValue={40} aria-label="Volume" />
    </div>
  ),
};

export const Range: Story = {
  render: () => (
    <div className="w-[300px]">
      <Slider defaultValue={[20, 80]} aria-label="Price range" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-[300px]">
      <Slider defaultValue={40} disabled aria-label="Volume" />
    </div>
  ),
};
