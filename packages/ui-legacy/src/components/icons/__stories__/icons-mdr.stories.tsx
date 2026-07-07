import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "mdr-16",
  "mdr-24",
  "mdr-adv-16",
  "mdr-adv-24",
  "mdr-std-16",
  "mdr-std-24"
]

const meta = {
  title: 'Icons/Mdr',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Mdr: Story = {
  render: () => <IconGrid entries={icons} />,
}
