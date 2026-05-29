import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "remove-from-list-32",
  "replica-32",
  "replica-running-32",
  "replication-ab-32",
  "reply-16",
  "reports-custom-24",
  "reports-custom-32",
  "reports-import-32",
  "resize-handle-32",
  "resource-ab-32",
  "resource-pool-32",
  "resources-o-32",
  "restart-16",
  "restore-16",
  "resume-16",
  "reverse-16",
  "reverse-o-16",
  "revert-32",
  "revoke-16",
  "revoke-24",
  "revoke-ab-32",
  "right-arrow-16",
  "right-arrow-ab-32",
  "rocket-16",
  "rocket-24",
  "rocket-32",
  "root-o-24",
  "root-setting-o-24",
  "rotate-16",
  "router-16",
  "router-24",
  "router-ab-32",
  "routing-24",
  "s3-24",
  "s3-32",
  "sale-items-24",
  "sale-tray-16",
  "sale-tray-32",
  "salesforce-16",
  "salesforce-24",
  "san-ab-24",
  "san-ab-32",
  "save-16",
  "scan-plan-ab-32",
  "schedule-ab-32",
  "scissors-ab-32",
  "scroll-check-32",
  "search-16",
  "search-24",
  "search-o-32",
  "security-essentials-24",
  "send-16",
  "send-email-ab-32",
  "servers-16",
  "service-desk-16",
  "service-desk-32",
  "sftp-ab-32",
  "share-16",
  "share-32",
  "shared-folder-24"
]

const meta = {
  title: 'Icons/Other R S',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const OtherRS: Story = {
  render: () => <IconGrid entries={icons} />,
}
