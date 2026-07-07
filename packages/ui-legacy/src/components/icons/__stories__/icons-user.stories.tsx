import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "user-16",
  "user-24",
  "user-32",
  "user-admin-24",
  "user-circle-16",
  "user-circle-24",
  "user-circle-32",
  "user-circle-web-16",
  "user-o-32",
  "user-placeholder-32",
  "user-setting-24",
  "user-tray-32",
  "user-web-16"
]

const meta = {
  title: 'Icons/User',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const User: Story = {
  render: () => <IconGrid entries={icons} />,
}
