import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "shelve-16",
  "shield-32",
  "shield-mix-32",
  "shopping-cart-16",
  "shopping-cart-24",
  "shopping-cart-o-32",
  "shut-down-16",
  "shut-down-24",
  "sign-32",
  "signature-32",
  "simplify-view-24",
  "simplify-view-ab-32",
  "skull-32",
  "slack-16",
  "slack-24",
  "smb-24",
  "sms-packages-16",
  "sms-packages-24",
  "soft-reboot-16",
  "software-32",
  "sort-16",
  "spiceworks-16",
  "spiceworks-24",
  "splashtop-16",
  "splashtop-24",
  "splashtop-32",
  "sql-24",
  "sql-cluster-32",
  "ssd-24",
  "ssd-status-24",
  "stamp-16",
  "standard-pack-office-365-management-16",
  "standard-pack-office-365-management-24",
  "start-server-o-24",
  "start-tray-16",
  "state-alert-d-16",
  "state-download-d-16",
  "state-pause-d-16",
  "state-upload-d-16",
  "stopped-circle-16",
  "stops-o-16",
  "stopwatch-16",
  "stopwatch-24",
  "subroot-16",
  "subroot-24",
  "subscriptions-24",
  "success-16",
  "success-32",
  "success-mix-32",
  "support-access-16",
  "support-access-24",
  "support-portal-access-16",
  "support-portal-access-24",
  "suspend-o-16",
  "swiss-drive-ill-72",
  "synology-16",
  "synology-32",
  "table-32",
  "table-rows-32",
  "table-view-16"
]

const meta = {
  title: 'Icons/Other S T',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const OtherST: Story = {
  render: () => <IconGrid entries={icons} />,
}
