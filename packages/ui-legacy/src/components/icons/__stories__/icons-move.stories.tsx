import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "move-16",
  "move-24",
  "move-ab-32",
  "move-to-pool-ab-32",
  "move-to-slot-ab-32"
]

const meta = {
  title: 'Icons/Move',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Move: Story = {
  render: () => <IconGrid entries={icons} />,
}
