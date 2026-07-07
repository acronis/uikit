import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "mobile-16",
  "mobile-32",
  "mobile-default-disabled-ill-96",
  "mobile-default-enabled-ill-96",
  "mobile-device-16",
  "mobile-device-24",
  "mobile-device-32",
  "mobile-devices-o-16",
  "mobile-devices-o-24",
  "mobile-o-32",
  "mobile-tray-16"
]

const meta = {
  title: 'Icons/Mobile',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Mobile: Story = {
  render: () => <IconGrid entries={icons} />,
}
