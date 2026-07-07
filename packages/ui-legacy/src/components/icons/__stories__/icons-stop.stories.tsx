import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "stop-16",
  "stop-32",
  "stop-mix-32",
  "stop-o-16",
  "stop-plan-ab-32",
  "stop-server-o-24"
]

const meta = {
  title: 'Icons/Stop',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Stop: Story = {
  render: () => <IconGrid entries={icons} />,
}
