import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "website-16",
  "website-24",
  "website-32",
  "website-ab-16",
  "website-ab-32",
  "website-disabled-ill-96",
  "website-enabled-ill-96"
]

const meta = {
  title: 'Icons/Website',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Website: Story = {
  render: () => <IconGrid entries={icons} />,
}
