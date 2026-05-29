import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "tape-16",
  "tape-32",
  "tape-cleaning-32",
  "tape-device-24",
  "tape-device-ab-32",
  "tape-drive-32",
  "tape-library-32",
  "tape-library-group-32",
  "tape-pool-32",
  "tape-pool-group-32",
  "tape-set-ab-32",
  "tape-slot-32",
  "tape-slot-empty-32",
  "tape-worm-32"
]

const meta = {
  title: 'Icons/Tape',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Tape: Story = {
  render: () => <IconGrid entries={icons} />,
}
