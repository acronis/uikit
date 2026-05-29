import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "connected-32",
  "connecting-16",
  "console-16",
  "console-log-16",
  "contacts-32",
  "content-hub-o-32",
  "convert-to-vm-plan-ab-32",
  "copy-16",
  "copy-24",
  "copy-o-16",
  "cp-assigned-16",
  "cp-assigned-24",
  "cp-used-16",
  "cp-used-24",
  "cpoc-24",
  "cpu-16",
  "cpu-24",
  "create-recovery-point-16",
  "create-snapshot-16",
  "create-snapshot-24",
  "critical-16",
  "critical-32",
  "critical-mix-32",
  "crowd-16",
  "customers-16",
  "customers-32",
  "cyber-frame-vm-32",
  "cyber-frame-vm-running-32",
  "cyber-infrastructure-16",
  "cyber-infrastructure-24",
  "cyberfit-16",
  "danger-16",
  "danger-32",
  "danger-mix-32",
  "dashboard-24",
  "dashboard-32",
  "databases-ab-32",
  "delete-16",
  "delete-ab-32",
  "delete-catalog-ab-32",
  "delete-o-16",
  "demo-dr-16",
  "demo-dr-24",
  "detach-16",
  "details-24",
  "details-ab-32",
  "device-status-32",
  "disable-ab-32",
  "disaster-recovery-ab-o-32",
  "disconnected-32",
  "discount-16",
  "discount-solid-16",
  "discovery-plan-ab-32",
  "disk-ab-32",
  "disk-nav-24",
  "disk-nav-dark-24",
  "dislike-16",
  "dislike-o-16",
  "dislikes-16",
  "document-export-o-32"
]

const meta = {
  title: 'Icons/Other C D',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const OtherCD: Story = {
  render: () => <IconGrid entries={icons} />,
}
