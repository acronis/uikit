import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "acronis-cloud-16",
  "acronis-cloud-32",
  "acronis-cloud-ill-72",
  "acronis-icon-32",
  "acronis-storage-ab-32",
  "acronis-support-24"
]

const meta = {
  title: 'Icons/Acronis',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Acronis: Story = {
  render: () => <IconGrid entries={icons} />,
}
