import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "a-logo-32",
  "account-32",
  "account-tray-16",
  "actions-o-16",
  "activities-ab-32",
  "activities-arrow-ab-32",
  "address-book-32",
  "alert-tray-16",
  "alerts-ab-32",
  "allow-propagating-support-portal-16",
  "analysis-16",
  "android-24",
  "android-32",
  "angle-left-32",
  "angle-right-32",
  "api-calls-esign-o-24",
  "api-calls-files-o-24",
  "apple-16",
  "apple-24",
  "apple-32",
  "appliance-24",
  "application-24",
  "apps-16",
  "apps-24",
  "apps-o-24",
  "area-chart-32",
  "asz-32",
  "asz-ab-24",
  "asz-ab-32",
  "asz-ill-72",
  "attach-16",
  "attention-16",
  "autodiscovery-24",
  "automation-24",
  "aws-24",
  "aws-32",
  "back-ab-32",
  "back-o-24",
  "backups-ab-24",
  "backups-ab-32",
  "backups-ab-o-32",
  "backups-mix-32",
  "ball-o-16",
  "ban-16",
  "ban-o-16",
  "ban-o-24",
  "ban-o-32",
  "bell-24",
  "bell-o-24",
  "bell-o-32",
  "bell-off-o-24",
  "big-star-16",
  "big-star-o-16",
  "blacklist-o-32",
  "blog-16",
  "blog-24",
  "bond-24",
  "bootable-media-24",
  "bootable-media-ab-24",
  "bootable-media-ab-32"
]

const meta = {
  title: 'Icons/Other A B',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const OtherAB: Story = {
  render: () => <IconGrid entries={icons} />,
}
