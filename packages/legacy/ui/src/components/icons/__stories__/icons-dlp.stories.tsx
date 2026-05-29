import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "dlp-16",
  "dlp-24",
  "dlp-server-16",
  "dlp-server-24",
  "dlp-server-o-16",
  "dlp-workstation-16",
  "dlp-workstation-24",
  "dlp-workstation-o-16",
  "dlp-workstation-o-24"
]

const meta = {
  title: 'Icons/Dlp',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Dlp: Story = {
  render: () => <IconGrid entries={icons} />,
}
