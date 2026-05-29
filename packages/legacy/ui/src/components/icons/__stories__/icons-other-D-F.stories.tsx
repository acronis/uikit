import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "document-templates-16",
  "document-templates-24",
  "download-16",
  "download-24",
  "download-ab-32",
  "download-mix-32",
  "drawer-32",
  "drive-error-16",
  "dropbox-16",
  "dropbox-24",
  "duplicate-16",
  "edit-16",
  "edit-columns-16",
  "edit-o-16",
  "edit-rename-ab-32",
  "edr-16",
  "edr-24",
  "education-16",
  "education-24",
  "education-32",
  "egress-24",
  "eject-ab-32",
  "ellipsis-h-16",
  "ellipsis-h-24",
  "email-32",
  "email-security-16",
  "email-security-24",
  "emergency-16",
  "emergency-32",
  "empty-32",
  "empty-o-24",
  "empty-widget-32",
  "enable-ab-32",
  "entra-id-24",
  "entra-id-32",
  "envelope-o-32",
  "erase-ab-32",
  "error-tray-16",
  "esx-ab-32",
  "eth-esign-o-16",
  "eth-esign-o-24",
  "eth-notarize-o-16",
  "eth-notarize-o-24",
  "ethernet-24",
  "evacuate-16",
  "events-32",
  "exchange-cluster-32",
  "execute-runbook-24",
  "executive-16",
  "exit-16",
  "exit-32",
  "exit-full-size-o-16",
  "expand-16",
  "expand-24",
  "expand-all-16",
  "expand-menu-16",
  "export-ab-32",
  "facebook-16",
  "facebook-24",
  "failover-server-24"
]

const meta = {
  title: 'Icons/Other D F',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const OtherDF: Story = {
  render: () => <IconGrid entries={icons} />,
}
