import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "settings-16",
  "settings-24",
  "settings-32",
  "settings-ab-32",
  "settings-d-o-16",
  "settings-default-32",
  "settings-nav-24",
  "settings-nav-dark-24",
  "settings-o-24"
]

const meta = {
  title: 'Icons/Settings',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Settings: Story = {
  render: () => <IconGrid entries={icons} />,
}
