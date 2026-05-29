import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "long-arrow-left-16",
  "long-arrow-left-24",
  "long-arrow-left-32",
  "long-arrow-right-16",
  "long-arrow-right-24",
  "long-arrow-right-32"
]

const meta = {
  title: 'Icons/Long',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Long: Story = {
  render: () => <IconGrid entries={icons} />,
}
