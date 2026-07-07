import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "pin-16",
  "pin-32",
  "pin-circle-16",
  "pin-default-16",
  "pin-outline-32",
  "pin-outline-small-32"
]

const meta = {
  title: 'Icons/Pin',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Pin: Story = {
  render: () => <IconGrid entries={icons} />,
}
