import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from '../progress'

const meta = {
  title: 'UI/Progress',
  component: Progress,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 33,
    className: 'w-[300px]',
  },
}

export const Half: Story = {
  args: {
    value: 50,
    className: 'w-[300px]',
  },
}

export const Full: Story = {
  args: {
    value: 100,
    className: 'w-[300px]',
  },
}

export const Indeterminate: Story = {
  args: {
    value: null,
    className: 'w-[300px]',
  },
}
