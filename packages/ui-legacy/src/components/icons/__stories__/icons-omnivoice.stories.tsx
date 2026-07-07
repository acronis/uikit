import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "omnivoice-16",
  "omnivoice-24",
  "omnivoice-minute-packages-16",
  "omnivoice-minute-packages-o-24",
  "omnivoice-sms-packages-16",
  "omnivoice-sms-packages-24",
  "omnivoice-users-16",
  "omnivoice-users-24"
]

const meta = {
  title: 'Icons/Omnivoice',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Omnivoice: Story = {
  render: () => <IconGrid entries={icons} />,
}
