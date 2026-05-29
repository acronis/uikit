import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "ms-365-16",
  "ms-365-24",
  "ms-365-32",
  "ms-365-dynamics-backup-16",
  "ms-365-dynamics-backup-24",
  "ms-365-dynamics-backup-32",
  "ms-365-o-16",
  "ms-365-o-24",
  "ms-365-o-32",
  "ms-exchange-16",
  "ms-exchange-24",
  "ms-exchange-32",
  "ms-onedrive-16",
  "ms-onedrive-24",
  "ms-onedrive-32",
  "ms-onenote-32",
  "ms-outlook-16",
  "ms-outlook-24",
  "ms-sharepoint-16",
  "ms-sharepoint-24",
  "ms-sharepoint-32",
  "ms-teams-16",
  "ms-teams-24",
  "ms-teams-32",
  "ms-teams-tray-32",
  "ms-win-defender-24",
  "ms-windows-16",
  "ms-windows-24",
  "ms-windows-32",
  "ms-word-tray-32"
]

const meta = {
  title: 'Icons/Ms',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Ms: Story = {
  render: () => <IconGrid entries={icons} />,
}
