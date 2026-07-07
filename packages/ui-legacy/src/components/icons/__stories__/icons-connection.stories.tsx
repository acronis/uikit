import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "connection-bluetooth-off-32",
  "connection-bluetooth-on-32",
  "connection-ethernet-off-32",
  "connection-ethernet-on-32",
  "connection-wifi-medium-32",
  "connection-wifi-off-32",
  "connection-wifi-strong-32",
  "connection-wifi-weak-32"
]

const meta = {
  title: 'Icons/Connection',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Connection: Story = {
  render: () => <IconGrid entries={icons} />,
}
