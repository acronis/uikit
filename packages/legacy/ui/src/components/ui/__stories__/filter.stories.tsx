import type { Meta, StoryObj } from '@storybook/react-vite'
import { Filter } from '../filter'

const meta = {
  title: 'UI/Filter',
  component: Filter,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Filter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Filter',
  },
}

export const WithCount: Story = {
  args: {
    count: 5,
    children: 'Filter',
  },
}

export const Active: Story = {
  args: {
    count: 3,
    active: true,
    children: 'Filter',
  },
}
