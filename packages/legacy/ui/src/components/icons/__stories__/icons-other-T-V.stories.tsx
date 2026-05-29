import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "talk-minutes-package-16",
  "talk-minutes-package-24",
  "target-24",
  "target-group-24",
  "tasks-32",
  "test-replica-ab-32",
  "text-file-o-16",
  "text-sign-16",
  "time-hurry-tray-16",
  "time-no-more-tray-16",
  "time-registration-24",
  "time-tray-16",
  "times-32",
  "times-circle-16",
  "times-circle-d-32",
  "to-cloud-16",
  "to-cloud-24",
  "to-cloud-ab-32",
  "tooltip-16",
  "total-storage-16",
  "total-storage-24",
  "tower-32",
  "tower-mix-32",
  "training-o-16",
  "training-o-24",
  "training-o-32",
  "translate-o-16",
  "trash-o-24",
  "trash-o-32",
  "trial-tray-32",
  "trial-tray-mix-32",
  "tune-16",
  "tune-32",
  "twitter-16",
  "twitter-24",
  "two-way-syncfolder-24",
  "typing-16",
  "universal-quota-16",
  "universal-quota-24",
  "unpin-16",
  "unplanned-expenses-32",
  "unprotected-16",
  "unprotected-24",
  "unprotected-32",
  "unrecognized-pool-32",
  "unshelve-o-16",
  "update-24",
  "update-32",
  "update-catalog-ab-32",
  "upgrade-16",
  "upgrade-included-16",
  "upload-16",
  "upload-24",
  "upsell-16",
  "upsell-32",
  "url-filtering-tray-32",
  "users-16",
  "users-24",
  "users-32",
  "v-center-32"
]

const meta = {
  title: 'Icons/Other T V',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const OtherTV: Story = {
  render: () => <IconGrid entries={icons} />,
}
