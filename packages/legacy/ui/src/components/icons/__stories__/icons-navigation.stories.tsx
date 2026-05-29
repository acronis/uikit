import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "disk-nav-24",
  "disk-nav-dark-24",
  "help-nav-24",
  "help-nav-dark-24",
  "mail-nav-24",
  "mail-nav-dark-24",
  "profile-nav-24",
  "profile-nav-dark-24",
  "services-nav-24",
  "services-nav-dark-24",
  "settings-nav-24",
  "settings-nav-dark-24",
  "workstation-nav-24",
  "workstation-nav-dark-24"
]

const meta = {
  title: 'Icons/Navigation',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Navigation: Story = {
  render: () => <IconGrid entries={icons} />,
}
