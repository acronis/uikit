import type { Meta, StoryObj } from '@storybook/react-vite'
import { Chip } from '../chip'
import { CloseIcon } from '@/components/icons'

const meta = {
  title: 'UI/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Chip',
  },
}

export const WithIcon: Story = {
  render: () => (
    <Chip icon={<CloseIcon className="h-3 w-3" />}>Tag</Chip>
  ),
}

export const WithRemove: Story = {
  render: () => (
    <Chip onRemove={() => {}}>Tag</Chip>
  ),
}
