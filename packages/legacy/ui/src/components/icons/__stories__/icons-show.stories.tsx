import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "show-16",
  "show-32",
  "show-backups-ab-32",
  "show-coordinate-16",
  "show-panel-24",
  "show-version-ab-32",
  "show-way-16"
]

const meta = {
  title: 'Icons/Show',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Show: Story = {
  render: () => <IconGrid entries={icons} />,
}
