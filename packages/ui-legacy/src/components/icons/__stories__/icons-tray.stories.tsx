import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "account-tray-16",
  "alert-tray-16",
  "backup-tray-32",
  "bundle-tray-32",
  "cisco-tray-32",
  "citrix-tray-32",
  "cloud-fail-tray-16",
  "cloud-hurry-tray-16",
  "cloud-tray-16",
  "cloud-tray-32",
  "error-tray-16",
  "gift-tray-16",
  "licence-tray-16",
  "license-tray-32",
  "mobile-tray-16",
  "ms-teams-tray-32",
  "ms-word-tray-32",
  "offer-tray-16",
  "ok-tray-16",
  "pause-tray-16",
  "pirate-tray-16",
  "product-tray-32",
  "progress-tray-16",
  "real-time-antivirus-protection-tray-32",
  "sale-tray-16",
  "sale-tray-32",
  "start-tray-16",
  "time-hurry-tray-16",
  "time-no-more-tray-16",
  "time-tray-16",
  "trial-tray-32",
  "url-filtering-tray-32",
  "user-tray-32",
  "zoom-tray-32"
]

const meta = {
  title: 'Icons/Tray',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Tray: Story = {
  render: () => <IconGrid entries={icons} />,
}
