import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "adv-16",
  "adv-agentless-security-vm-pack-16",
  "adv-agentless-security-vm-pack-24",
  "adv-backup-pack-g-suite-16",
  "adv-backup-pack-g-suite-24",
  "adv-backup-pack-nas-16",
  "adv-backup-pack-nas-24",
  "adv-backup-pack-office-365-16",
  "adv-backup-pack-office-365-24",
  "adv-backup-pack-server-16",
  "adv-backup-pack-server-24",
  "adv-backup-pack-virtual-machines-16",
  "adv-backup-pack-virtual-machines-24",
  "adv-backup-pack-web-hosting-server-16",
  "adv-backup-pack-web-hosting-server-24",
  "adv-backup-pack-workstation-16",
  "adv-backup-pack-workstation-24",
  "adv-dlp-pack-16",
  "adv-dlp-pack-24",
  "adv-management-pack-16",
  "adv-management-pack-24",
  "adv-mobile-pack-16",
  "adv-mobile-pack-24",
  "adv-network-monitoring-16",
  "adv-network-monitoring-24",
  "adv-security-pack-16",
  "adv-security-pack-24",
  "adv-security-pack-edr-16",
  "adv-security-pack-edr-24",
  "adv-security-pack-mdr-adv-16",
  "adv-security-pack-mdr-adv-24",
  "adv-security-pack-mdr-std-16",
  "adv-security-pack-mdr-std-24",
  "adv-security-pack-xdr-16",
  "adv-security-pack-xdr-24"
]

const meta = {
  title: 'Icons/Adv',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Adv: Story = {
  render: () => <IconGrid entries={icons} />,
}
