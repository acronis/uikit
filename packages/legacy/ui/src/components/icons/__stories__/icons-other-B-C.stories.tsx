import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGrid } from './IconGrid'

const icons = [
  "box-16",
  "box-24",
  "bridge-24",
  "broken-backup-16",
  "broken-backup-24",
  "broken-backup-32",
  "broken-o-32",
  "bucket-16",
  "bucket-24",
  "bucket-32",
  "bullet-16",
  "bundle-tray-32",
  "burger-menu-32",
  "calculator-16",
  "calendar-16",
  "calendar-holidays-16",
  "calendar-trend-32",
  "calendars-32",
  "card-view-16",
  "case-16",
  "case-24",
  "case-o-16",
  "case-setting-24",
  "cd-16",
  "certificate-24",
  "certificate-32",
  "certificate-ab-32",
  "certificate-check-32",
  "chat-16",
  "chat-24",
  "chat-32",
  "checkbox-list-32",
  "circle-16",
  "circle-o-32",
  "circle-outline-16",
  "cis-16",
  "cisco-tray-32",
  "citrix-tray-32",
  "claim-16",
  "claim-32",
  "cleanup-plan-ab-32",
  "clock-16",
  "clock-o-24",
  "clone-copy-ab-32",
  "clone-o-32",
  "close-16",
  "close-24",
  "cluster-24",
  "cluster-32",
  "cluster-scale-32",
  "cmis-24",
  "col-expand-16",
  "collaboration-security-16",
  "collaboration-security-24",
  "collapse-16",
  "collapse-all-16",
  "collapse-menu-16",
  "communigate-32",
  "compare-32",
  "configure-machine-32"
]

const meta = {
  title: 'Icons/Other B C',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const OtherBC: Story = {
  render: () => <IconGrid entries={icons} />,
}
