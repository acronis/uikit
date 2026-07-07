import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "license-16",
  "license-32",
  "license-keys-32",
  "license-solid-16",
  "license-tray-32"
]

const meta = {
  title: 'Icons/License',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const License: Story = {
  render: () => <IconGrid entries={icons} />,
}
