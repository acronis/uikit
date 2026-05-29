import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "mail-16",
  "mail-24",
  "mail-archive-16",
  "mail-archive-24",
  "mail-archive-o-32",
  "mail-nav-24",
  "mail-nav-dark-24"
]

const meta = {
  title: 'Icons/Mail',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Mail: Story = {
  render: () => <IconGrid entries={icons} />,
}
