import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "hide-16",
  "hide-32",
  "hide-coordinate-16",
  "hide-panel-24",
  "hide-way-16"
]

const meta = {
  title: 'Icons/Hide',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Hide: Story = {
  render: () => <IconGrid entries={icons} />,
}
