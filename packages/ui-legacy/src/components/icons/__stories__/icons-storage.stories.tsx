import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "storage-cold-16",
  "storage-cold-24",
  "storage-hot-16",
  "storage-hot-24",
  "storage-node-ab-24",
  "storage-node-ab-32",
  "storage-server-32"
]

const meta = {
  title: 'Icons/Storage',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Storage: Story = {
  render: () => <IconGrid entries={icons} />,
}
