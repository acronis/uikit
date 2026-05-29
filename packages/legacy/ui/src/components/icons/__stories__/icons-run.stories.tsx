import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "run-circle-16",
  "run-now-ab-32",
  "run-proxmox-vm-32",
  "run-vm-32",
  "run-vm-hyperv-32"
]

const meta = {
  title: 'Icons/Run',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Run: Story = {
  render: () => <IconGrid entries={icons} />,
}
