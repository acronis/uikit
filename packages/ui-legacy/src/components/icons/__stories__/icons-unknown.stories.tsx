import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "unknown-16",
  "unknown-32",
  "unknown-3th-24",
  "unknown-disabled-ill-96",
  "unknown-enabled-ill-96",
  "unknown-mix-32"
]

const meta = {
  title: 'Icons/Unknown',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Unknown: Story = {
  render: () => <IconGrid entries={icons} />,
}
