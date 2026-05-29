import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "protection-16",
  "protection-24",
  "protection-32",
  "protection-solid-16",
  "protection-status-off-32",
  "protection-status-protected-32",
  "protection-status-unprotected-32",
  "protection-status-warning-32"
]

const meta = {
  title: 'Icons/Protection',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Protection: Story = {
  render: () => <IconGrid entries={icons} />,
}
