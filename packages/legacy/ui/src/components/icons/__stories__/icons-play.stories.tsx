import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "play-16",
  "play-24",
  "play-32",
  "play-mix-32",
  "play-o-16",
  "play-round-16",
  "play-round-24",
  "play-round-32"
]

const meta = {
  title: 'Icons/Play',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Play: Story = {
  render: () => <IconGrid entries={icons} />,
}
