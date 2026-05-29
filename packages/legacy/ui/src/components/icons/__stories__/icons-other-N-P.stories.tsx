import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "notary-o-32",
  "notifications-d-o-16",
  "notifications-o-24",
  "notifications-with-state-d-o-16",
  "nutanix-16",
  "nutanix-vm-32",
  "nutanix-vm-running-32",
  "nvme-16",
  "nvme-24",
  "nvme-s-o-24",
  "nvme-status-24",
  "offer-tray-16",
  "ok-tray-16",
  "one-way-sync-folder-24",
  "openai-16",
  "optical-disk-32",
  "oracle-agent-16",
  "oracle-agent-24",
  "organisations-ab-24",
  "organisations-ab-32",
  "other-o-16",
  "overview-ab-32",
  "paint-brush-24",
  "paint-brush-32",
  "panel-left-32",
  "panel-right-32",
  "partition-16",
  "partition-32",
  "paste-o-16",
  "patch-16",
  "patch-32",
  "patch-manage-24",
  "patch-management-16",
  "pause-16",
  "pause-32",
  "pause-mix-32",
  "pause-tray-16",
  "paused-circle-16",
  "paused-circle-d-32",
  "pdf-16",
  "pdf-24",
  "pdf-ab-32",
  "pencil-32",
  "pencil-o-16",
  "pencil-square-o-32",
  "pending-16",
  "pending-32",
  "pending-mix-32",
  "perceptionpoint-16",
  "perceptionpoint-24",
  "phone-16",
  "photos-32",
  "pie-chart-16",
  "pie-chart-24",
  "pie-chart-o-32",
  "pirate-tray-16",
  "placeholder-16",
  "placeholder-24",
  "placeholder-32",
  "placement-24"
]

const meta = {
  title: 'Icons/Other N P',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const OtherNP: Story = {
  render: () => <IconGrid entries={icons} />,
}
