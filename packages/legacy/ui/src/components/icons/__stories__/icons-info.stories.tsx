import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "info-16",
  "info-32",
  "info-circle-16",
  "info-circle-o-16",
  "info-circle-small-16",
  "info-mix-32"
]

const meta = {
  title: 'Icons/Info',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  render: () => <IconGrid entries={icons} />,
}
