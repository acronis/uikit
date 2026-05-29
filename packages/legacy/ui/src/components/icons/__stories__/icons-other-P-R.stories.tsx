import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "plans-ab-32",
  "plugin-ab-24",
  "plugin-ab-32",
  "plus-16",
  "plus-24",
  "plus-rounded-16",
  "plus-small-16",
  "policy-24",
  "postgresql-32",
  "posts-32",
  "power-ab-32",
  "power-o-24",
  "power-off-o-16",
  "price-tags-32",
  "print-16",
  "printer-3th-24",
  "printer-disabled-ill-96",
  "printer-enabled-ill-96",
  "product-tray-32",
  "products-o-24",
  "products-o-32",
  "project-budget-32",
  "project-costs-32",
  "project-profit-32",
  "promo-24",
  "promo-32",
  "protect-16",
  "protect-group-ab-32",
  "proxmox-16",
  "proxmox-32",
  "proxmox-vm-32",
  "proxmox-vm-running-32",
  "psa-free-features-16",
  "psa-free-features-24",
  "psa-self-service-16",
  "psa-self-service-24",
  "quick-scan-32",
  "quote-24",
  "quote-mark-32",
  "r-panel-16",
  "raid-24",
  "raid-status-24",
  "ram-16",
  "ram-o-24",
  "ratios-32",
  "rdp-native-32",
  "rdp-web-32",
  "real-time-antivirus-protection-tray-32",
  "rebuild-catalog-ab-32",
  "recover-16",
  "recover-32",
  "recurring-ticket-16",
  "reddit-16",
  "reddit-24",
  "referee-16",
  "refresh-32",
  "refresh-scan-ab-32",
  "reinstall-16",
  "remove-circle-outline-16",
  "remove-from-group-ab-32"
]

const meta = {
  title: 'Icons/Other P R',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const OtherPR: Story = {
  render: () => <IconGrid entries={icons} />,
}
