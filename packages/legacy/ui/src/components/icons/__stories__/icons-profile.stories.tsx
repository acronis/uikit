import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "profile-16",
  "profile-24",
  "profile-32",
  "profile-nav-24",
  "profile-nav-dark-24"
]

const meta = {
  title: 'Icons/Profile',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Profile: Story = {
  render: () => <IconGrid entries={icons} />,
}
