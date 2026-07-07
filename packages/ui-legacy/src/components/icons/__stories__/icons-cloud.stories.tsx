import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "cloud-16",
  "cloud-32",
  "cloud-app-backup-plan-ab-32",
  "cloud-apps-24",
  "cloud-fail-tray-16",
  "cloud-hurry-tray-16",
  "cloud-mix-32",
  "cloud-o-16",
  "cloud-server-16",
  "cloud-server-24",
  "cloud-storage-16",
  "cloud-storage-24",
  "cloud-to-cloud-16",
  "cloud-to-cloud-24",
  "cloud-tray-16",
  "cloud-tray-32",
  "cloud-tray-mix-32"
]

const meta = {
  title: 'Icons/Cloud',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Cloud: Story = {
  render: () => <IconGrid entries={icons} />,
}
