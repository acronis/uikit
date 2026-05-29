import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "add-16",
  "add-32",
  "add-action-16",
  "add-admin-32",
  "add-create-ab-32",
  "add-disk-32",
  "add-document-32",
  "add-document-cloud-32",
  "add-to-group-ab-32",
  "add-unit-ab-32"
]

const meta = {
  title: 'Icons/Add',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Add: Story = {
  render: () => <IconGrid entries={icons} />,
}
