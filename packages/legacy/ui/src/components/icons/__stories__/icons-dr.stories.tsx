import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "dr-16",
  "dr-24",
  "dr-ab-o-32",
  "dr-base-16",
  "dr-base-24",
  "dr-in-azure-16",
  "dr-in-azure-24",
  "dr-storage-16",
  "dr-storage-24"
]

const meta = {
  title: 'Icons/Dr',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Dr: Story = {
  render: () => <IconGrid entries={icons} />,
}
