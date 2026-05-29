import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "direction-16",
  "direction-blue-16",
  "direction-dark-32",
  "direction-light-32",
  "direction-mix-32"
]

const meta = {
  title: 'Icons/Direction',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Direction: Story = {
  render: () => <IconGrid entries={icons} />,
}
