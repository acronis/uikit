import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "folder-16",
  "folder-24",
  "folder-32",
  "folder-all-16",
  "folder-all-24",
  "folder-all-32",
  "folder-customers-16",
  "folder-customers-24",
  "folder-customers-32",
  "folder-d-o-16",
  "folder-ill-72",
  "folder-mix-32",
  "folder-o-24",
  "folder-search-16",
  "folder-search-24",
  "folder-search-32",
  "folder-symlink-32",
  "folder-with-state-d-o-16"
]

const meta = {
  title: 'Icons/Folder',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Folder: Story = {
  render: () => <IconGrid entries={icons} />,
}
