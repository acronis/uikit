import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "backups-mix-32",
  "cloud-mix-32",
  "cloud-tray-mix-32",
  "critical-mix-32",
  "danger-mix-32",
  "direction-mix-32",
  "download-mix-32",
  "encrypted-mix-32",
  "folder-mix-32",
  "forbidden-mix-32",
  "hdd-mix-32",
  "info-mix-32",
  "locked-mix-32",
  "multiple-mix-32",
  "network-folder-mix-32",
  "notarized-mix-32",
  "pause-mix-32",
  "pending-mix-32",
  "play-mix-32",
  "progress-mix-32",
  "progress-red-mix-32",
  "shield-mix-32",
  "stop-mix-32",
  "success-mix-32",
  "sync-folder-mix-32",
  "tower-mix-32",
  "trial-tray-mix-32",
  "unknown-mix-32",
  "virus-mix-32",
  "warning-circle-mix-32",
  "warning-mix-32",
  "workstation-mix-32"
]

const meta = {
  title: 'Icons/Multicolor',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Multicolor: Story = {
  render: () => <IconGrid entries={icons} />,
}
