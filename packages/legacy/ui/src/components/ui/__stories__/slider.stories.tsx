import type { Meta, StoryObj } from '@storybook/react-vite'
import { Slider } from '../slider'

const meta = {
  title: 'UI/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: [33],
    className: 'w-[300px]',
  },
}

export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    className: 'w-[300px]',
  },
}

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    disabled: true,
    className: 'w-[300px]',
  },
}

export const Steps: Story = {
  args: {
    defaultValue: [40],
    step: 10,
    className: 'w-[300px]',
  },
}
