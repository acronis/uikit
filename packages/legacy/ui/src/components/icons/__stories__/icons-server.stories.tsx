import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "server-16",
  "server-24",
  "server-32",
  "server-3th-24",
  "server-arm-32",
  "server-disabled-ill-96",
  "server-enabled-ill-96",
  "server-included-16",
  "server-included-24",
  "server-master-24",
  "server-o-32",
  "server-room-24",
  "server-state-24"
]

const meta = {
  title: 'Icons/Server',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Server: Story = {
  render: () => <IconGrid entries={icons} />,
}
