import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "acronis-cloud-ill-72",
  "asz-ill-72",
  "connect-branded-ill-72",
  "connect-white-label-ill-72",
  "desktop-default-disabled-ill-96",
  "desktop-default-enabled-ill-96",
  "desktop-imac-disabled-ill-96",
  "desktop-imac-enabled-ill-96",
  "desktop-linux-disabled-ill-96",
  "desktop-linux-enabled-ill-96",
  "desktop-vm-disabled-ill-96",
  "desktop-vm-enabled-ill-96",
  "desktop-windows-disabled-ill-96",
  "desktop-windows-enabled-ill-96",
  "external-devices-disabled-ill-96",
  "external-devices-enabled-ill-96",
  "external-drive-ill-72",
  "folder-ill-72",
  "globe-disabled-ill-96",
  "globe-enabled-ill-96",
  "hdd-ill-72",
  "laptop-default-disabled-ill-96",
  "laptop-default-enabled-ill-96",
  "laptop-linux-disabled-ill-96",
  "laptop-linux-enabled-ill-96",
  "laptop-mac-book-disabled-ill-96",
  "laptop-mac-book-enabled-ill-96",
  "laptop-vm-disabled-ill-96",
  "laptop-vm-enabled-ill-96",
  "laptop-windows-disabled-ill-96",
  "laptop-windows-enabled-ill-96",
  "mobile-default-disabled-ill-96",
  "mobile-default-enabled-ill-96",
  "network-folder-ill-72",
  "notarized-folder-ill-72",
  "printer-disabled-ill-96",
  "printer-enabled-ill-96",
  "server-disabled-ill-96",
  "server-enabled-ill-96",
  "swiss-drive-ill-72",
  "unknown-disabled-ill-96",
  "unknown-enabled-ill-96",
  "website-disabled-ill-96",
  "website-enabled-ill-96",
  "workstation-ill-72"
]

const meta = {
  title: 'Icons/Illustrations',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Illustrations: Story = {
  render: () => <IconGrid entries={icons} />,
}
