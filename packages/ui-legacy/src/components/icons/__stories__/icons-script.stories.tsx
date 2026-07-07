import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "script-24",
  "script-32",
  "script-ab-24",
  "script-ab-32",
  "script-ab-o-32"
]

const meta = {
  title: 'Icons/Script',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Script: Story = {
  render: () => <IconGrid entries={icons} />,
}
