import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "lock-status-16",
  "locked-16",
  "locked-32",
  "locked-mix-32",
  "lun-24",
  "lun-s-o-24",
  "lun-status-24",
  "mac-pc-24",
  "mac-pc-32",
  "mailbox-16",
  "mailbox-ab-32",
  "mailbox-encrypted-ab-32",
  "mailboxes-ab-32",
  "maintenance-mode-16",
  "maintenance-mode-24",
  "maintenance-o-16",
  "malware-o-16",
  "malware-o-24",
  "manage-accounts-ab-32",
  "manage-rules-16",
  "mandatory-16",
  "master-server-o-24",
  "mc-afee-24",
  "megaphone-32",
  "menu-24",
  "menu-ab-32",
  "messages-32",
  "microphone-24",
  "migrate-16",
  "migration-ab-32",
  "milestone-16",
  "minimize-24",
  "minio-32",
  "modal-o-32",
  "money-magnet-32",
  "money-tree-32",
  "more-16",
  "more-24",
  "mount-media-ab-32",
  "mssql-db-group-32",
  "mssql-instance-32",
  "multiple-16",
  "multiple-devices-32",
  "multiple-mix-32",
  "networks-o-32",
  "new-group-ab-32",
  "next-range-16",
  "nfs-24",
  "nfs-share-32",
  "nfs-share-ab-32",
  "node-16",
  "node-24",
  "node-s-o-24",
  "node-status-24",
  "notarized-16",
  "notarized-folder-ill-72",
  "notarized-mix-32",
  "notary-24",
  "notary-circle-d-32",
  "notary-o-16"
]

const meta = {
  title: 'Icons/Other L N',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const OtherLN: Story = {
  render: () => <IconGrid entries={icons} />,
}
