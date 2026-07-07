import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "network-32",
  "network-3th-24",
  "network-ds-24",
  "network-folder-16",
  "network-folder-32",
  "network-folder-ill-72",
  "network-folder-mix-32",
  "network-folder-o-24",
  "network-monitoring-16",
  "network-monitoring-24",
  "network-monitoring-32",
  "network-tape-32",
  "network-tape-ab-24",
  "network-tape-ab-32"
]

const meta = {
  title: 'Icons/Network',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Network: Story = {
  render: () => <IconGrid entries={icons} />,
}
