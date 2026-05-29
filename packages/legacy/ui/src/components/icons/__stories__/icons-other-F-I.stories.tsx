import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "failover-server-32",
  "fallback-server-24",
  "files-o-16",
  "files-o-24",
  "filter-16",
  "finalize-ab-32",
  "finish-flag-16",
  "firewall-24",
  "firewall-protection-16",
  "flavor-24",
  "floating-ips-16",
  "floating-ips-24",
  "forbidden-16",
  "forbidden-32",
  "forbidden-mix-32",
  "force-detach-16",
  "frame-16",
  "free-pool-32",
  "from-cloud-16",
  "from-cloud-24",
  "ftp-32",
  "ftp-ab-32",
  "full-size-16",
  "funnel-16",
  "g-suite-team-16",
  "g-suite-team-24",
  "g-suite-team-32",
  "general-info-32",
  "geo-replication-16",
  "geo-replication-24",
  "gift-24",
  "gift-tray-16",
  "globe-16",
  "globe-disabled-ill-96",
  "globe-enabled-ill-96",
  "go-to-end-16",
  "go-to-start-16",
  "greathorn-16",
  "greathorn-24",
  "greathorn-32",
  "grip-dots-16",
  "growth-16",
  "hard-reboot-16",
  "hci-vm-32",
  "hci-vm-running-32",
  "headset-16",
  "heartbeat-24",
  "heartbeat-32",
  "hitmap-16",
  "hl-group-32",
  "home-folder-24",
  "hyper-v-16",
  "hyper-v-24",
  "hyper-v-ab-24",
  "image-16",
  "image-24",
  "image-template-o-24",
  "import-16",
  "import-ab-32",
  "imported-pool-32"
]

const meta = {
  title: 'Icons/Other F I',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const OtherFI: Story = {
  render: () => <IconGrid entries={icons} />,
}
