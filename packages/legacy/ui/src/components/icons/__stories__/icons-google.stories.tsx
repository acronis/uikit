import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "google-16",
  "google-24",
  "google-32",
  "google-drive-16",
  "google-drive-24",
  "google-drive-32",
  "google-gmail-16",
  "google-gmail-24",
  "google-gmail-32"
]

const meta = {
  title: 'Icons/Google',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Google: Story = {
  render: () => <IconGrid entries={icons} />,
}
