import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "v-host-16",
  "v-host-24",
  "v-logo-32",
  "validation-plan-ab-32",
  "vcd-virtual-machines-16",
  "vcd-virtual-machines-24",
  "veil-engine-16",
  "veil-engine-32",
  "veil-vm-32",
  "veil-vm-running-32",
  "verify-32",
  "videos-32",
  "view-open-ab-32",
  "virtuozzo-24",
  "virtuozzo-32",
  "virtuozzo-ab-24",
  "virtuozzo-platform-ab-24",
  "virus-16",
  "virus-32",
  "virus-mix-32",
  "virustotal-16",
  "vlan-24",
  "vms-templates-32",
  "volume-iso-24",
  "volume-snapshot-24",
  "vp-16",
  "vp-24",
  "vp-32",
  "vpn-24",
  "vpn-con-16",
  "vpn-con-24",
  "vtl-24",
  "vulnerability-16",
  "vulnerability-o-24",
  "vz-container-32",
  "vz-container-running-32",
  "vz-virtual-32",
  "vz-virtual-running-32",
  "wasabi-32",
  "whatsapp-16",
  "windows-pc-24",
  "windows-pc-32",
  "wrench-o-16",
  "x-twitter-24",
  "xdr-16",
  "xdr-24",
  "youtube-16",
  "youtube-24",
  "zendesk-16",
  "zendesk-24",
  "zoom-in-16",
  "zoom-out-16",
  "zoom-tray-32",
  "ztc-esign-o-16",
  "ztc-esign-o-24",
  "ztc-notarize-o-16",
  "ztc-notarize-o-24"
]

const meta = {
  title: 'Icons/Other V Z',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const OtherVZ: Story = {
  render: () => <IconGrid entries={icons} />,
}
