import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "impossible-cloud-32",
  "infiniband-24",
  "infinity-32",
  "infrastructure-32",
  "ingress-24",
  "instagram-16",
  "instagram-24",
  "install-16",
  "install-32",
  "install-blue-16",
  "install-blue-32",
  "installer-16",
  "installer-ab-24",
  "installer-ab-32",
  "internet-32",
  "internet-access-16",
  "internet-access-o-16",
  "internet-access-o-24",
  "invalid-link-16",
  "invalid-link-24",
  "inventory-ab-32",
  "ionos-16",
  "ionos-24",
  "ionos-32",
  "ipn-16",
  "ipn-24",
  "ipn-32",
  "iscsi-24",
  "key-16",
  "key-24",
  "key-32",
  "label-24",
  "last-range-16",
  "layout-o-32",
  "left-arrow-16",
  "left-arrow-ab-32",
  "licence-tray-16",
  "light-disable-24",
  "light-enable-24",
  "like-16",
  "like-o-16",
  "likes-16",
  "likes-32",
  "linkedin-16",
  "linkedin-24",
  "linux-16",
  "linux-24",
  "linux-32",
  "linux-pc-32",
  "list-24",
  "list-view-ab-32",
  "loading-16",
  "loading-24",
  "loading-32",
  "loading-48",
  "local-backup-o-16",
  "local-backup-o-24",
  "local-backup-o-32",
  "lock-16",
  "lock-32"
]

const meta = {
  title: 'Icons/Other I L',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const OtherIL: Story = {
  render: () => <IconGrid entries={icons} />,
}
