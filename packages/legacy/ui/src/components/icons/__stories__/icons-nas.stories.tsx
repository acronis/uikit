import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "nas-16",
  "nas-24",
  "nas-ab-24",
  "nas-ab-32",
  "nas-included-16",
  "nas-included-24",
  "nas-synology-ab-24",
  "nas-synology-ab-32"
]

const meta = {
  title: 'Icons/Nas',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Nas: Story = {
  render: () => <IconGrid entries={icons} />,
}
