import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "workstation-16",
  "workstation-32",
  "workstation-3th-24",
  "workstation-arm-32",
  "workstation-ill-72",
  "workstation-included-16",
  "workstation-included-24",
  "workstation-mix-32",
  "workstation-nav-24",
  "workstation-nav-dark-24"
]

const meta = {
  title: 'Icons/Workstation',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Workstation: Story = {
  render: () => <IconGrid entries={icons} />,
}
