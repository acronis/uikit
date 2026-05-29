import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "active-directory-16",
  "active-directory-24",
  "active-protection-16",
  "active-protection-24",
  "active-protection-ab-32"
]

const meta = {
  title: 'Icons/Active',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = {
  render: () => <IconGrid entries={icons} />,
}
