import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "devices-ab-32",
  "devices-access-point-24",
  "devices-android-smartphone-24",
  "devices-android-tablet-24",
  "devices-camera-24",
  "devices-desktop-24",
  "devices-esx-i-host-24",
  "devices-fitness-tracker-24",
  "devices-gaming-console-24",
  "devices-home-automation-hub-24",
  "devices-i-os-tv-os-24",
  "devices-i-pad-24",
  "devices-i-phone-24",
  "devices-ip-phone-24",
  "devices-laptop-o-24",
  "devices-linux-desktop-24",
  "devices-linux-laptop-24",
  "devices-mac-24",
  "devices-macbook-24",
  "devices-mediabox-24",
  "devices-memory-card-24",
  "devices-mi-home-24",
  "devices-network-video-recorder-24",
  "devices-pc-24",
  "devices-phone-o-24",
  "devices-printer-mfu-24",
  "devices-router-24",
  "devices-san-24",
  "devices-smart-display-24",
  "devices-smart-lock-24",
  "devices-smart-theater-system-24",
  "devices-storage-24",
  "devices-streaming-device-24",
  "devices-switch-24",
  "devices-tablet-24",
  "devices-thermostat-24",
  "devices-tv-24",
  "devices-unknown-24",
  "devices-ups-24",
  "devices-usb-24",
  "devices-virtual-machine-24",
  "devices-windows-desktop-24",
  "devices-windows-laptop-24",
  "devices-wireless-earbuds-24",
  "devices-wireless-speaker-24",
  "devices-with-agent-24",
  "devices-without-agent-24"
]

const meta = {
  title: 'Icons/Devices',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Devices: Story = {
  render: () => <IconGrid entries={icons} />,
}
