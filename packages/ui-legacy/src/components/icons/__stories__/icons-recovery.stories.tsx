import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "recovery-ab-32",
  "recovery-point-16",
  "recovery-point-24",
  "recovery-server-24",
  "recovery-server-state-24"
]

const meta = {
  title: 'Icons/Recovery',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Recovery: Story = {
  render: () => <IconGrid entries={icons} />,
}
