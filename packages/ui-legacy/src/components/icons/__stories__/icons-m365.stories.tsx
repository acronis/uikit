import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "m365-16",
  "m365-24",
  "m365-google-backups-16",
  "m365-google-backups-24",
  "m365-rooms-equipment-16",
  "m365-rooms-equipment-24",
  "m365-rooms-equipment-included-16",
  "m365-rooms-equipment-included-24",
  "m365-shared-mailboxes-16",
  "m365-shared-mailboxes-24",
  "m365-shared-mailboxes-included-16",
  "m365-shared-mailboxes-included-24"
]

const meta = {
  title: 'Icons/M365',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const M365: Story = {
  render: () => <IconGrid entries={icons} />,
}
