import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "workstations-32",
  "workstations-o-16",
  "workstations-o-24",
  "workstations-premium-16",
  "workstations-premium-24"
]

const meta = {
  title: 'Icons/Workstations',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Workstations: Story = {
  render: () => <IconGrid entries={icons} />,
}
