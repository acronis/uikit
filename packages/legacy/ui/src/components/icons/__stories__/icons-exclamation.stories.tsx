import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "exclamation-circle-16",
  "exclamation-circle-32",
  "exclamation-circle-d-32",
  "exclamation-triangle-16",
  "exclamation-triangle-24"
]

const meta = {
  title: 'Icons/Exclamation',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Exclamation: Story = {
  render: () => <IconGrid entries={icons} />,
}
