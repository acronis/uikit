import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "star-16",
  "star-24",
  "star-32",
  "star-o-24",
  "star-o-32"
]

const meta = {
  title: 'Icons/Star',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Star: Story = {
  render: () => <IconGrid entries={icons} />,
}
