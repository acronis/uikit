import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "partner-16",
  "partner-24",
  "partner-32",
  "partner-cyber-frame-compute-16",
  "partner-cyber-frame-compute-24",
  "partner-cyber-frame-storage-16",
  "partner-cyber-frame-storage-24",
  "partner-dr-infrastructure-16",
  "partner-dr-infrastructure-24",
  "partner-geo-storage-16",
  "partner-geo-storage-24",
  "partner-solid-16",
  "partner-solid-24",
  "partner-solid-32",
  "partner-storage-16",
  "partner-storage-24",
  "partner-vcd-16",
  "partner-vcd-24"
]

const meta = {
  title: 'Icons/Partner',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Partner: Story = {
  render: () => <IconGrid entries={icons} />,
}
