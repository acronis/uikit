import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "sync-16",
  "sync-32",
  "sync-folder-32",
  "sync-folder-mix-32",
  "sync-share-16",
  "sync-share-24",
  "sync-share-o-32"
]

const meta = {
  title: 'Icons/Sync',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Sync: Story = {
  render: () => <IconGrid entries={icons} />,
}
