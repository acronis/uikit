import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "backup-ab-32",
  "backup-dr-16",
  "backup-dr-24",
  "backup-dr-32",
  "backup-plan-ab-32",
  "backup-replication-plan-ab-32",
  "backup-tray-32"
]

const meta = {
  title: 'Icons/Backup',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Backup: Story = {
  render: () => <IconGrid entries={icons} />,
}
