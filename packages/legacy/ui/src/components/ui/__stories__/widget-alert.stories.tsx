import type { Meta, StoryObj } from '@storybook/react-vite'
import { InfoIcon, CheckCircleIcon, WarningCircleIcon, TimesCircleIcon } from '@/components/icons'

const MoreVerticalIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
  </svg>
)
import {
  WidgetAlert,
  WidgetAlertIcon,
  WidgetAlertContent,
  WidgetAlertTitle,
  WidgetAlertDate,
  WidgetAlertDescription,
  WidgetAlertActions,
} from '../widget-alert'

const meta = {
  title: 'UI/WidgetAlert',
  component: WidgetAlert,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof WidgetAlert>

export default meta
type Story = StoryObj<typeof meta>

export const Info_: Story = {
  name: 'Info',
  render: () => (
    <WidgetAlert variant="info" className="w-[420px]">
      <WidgetAlertIcon><InfoIcon /></WidgetAlertIcon>
      <WidgetAlertContent>
        <WidgetAlertTitle>Backup completed</WidgetAlertTitle>
        <WidgetAlertDate>Today, 10:32 AM</WidgetAlertDate>
      </WidgetAlertContent>
      <WidgetAlertActions><MoreVerticalIcon /></WidgetAlertActions>
    </WidgetAlert>
  ),
}

export const Success_: Story = {
  name: 'Success',
  render: () => (
    <WidgetAlert variant="success" className="w-[420px]">
      <WidgetAlertIcon><CheckCircleIcon /></WidgetAlertIcon>
      <WidgetAlertContent>
        <WidgetAlertTitle>Protection active</WidgetAlertTitle>
        <WidgetAlertDate>Today, 9:15 AM</WidgetAlertDate>
      </WidgetAlertContent>
      <WidgetAlertActions><MoreVerticalIcon /></WidgetAlertActions>
    </WidgetAlert>
  ),
}

export const Warning_: Story = {
  name: 'Warning',
  render: () => (
    <WidgetAlert variant="warning" className="w-[420px]">
      <WidgetAlertIcon><WarningCircleIcon /></WidgetAlertIcon>
      <WidgetAlertContent>
        <WidgetAlertTitle>License expiring soon</WidgetAlertTitle>
        <WidgetAlertDate>Expires in 7 days</WidgetAlertDate>
        <WidgetAlertDescription>Renew your license to continue protection.</WidgetAlertDescription>
      </WidgetAlertContent>
      <WidgetAlertActions><MoreVerticalIcon /></WidgetAlertActions>
    </WidgetAlert>
  ),
}

export const Danger_: Story = {
  name: 'Danger',
  render: () => (
    <WidgetAlert variant="danger" className="w-[420px]">
      <WidgetAlertIcon><TimesCircleIcon /></WidgetAlertIcon>
      <WidgetAlertContent>
        <WidgetAlertTitle>Backup failed</WidgetAlertTitle>
        <WidgetAlertDate>Yesterday, 11:45 PM</WidgetAlertDate>
        <WidgetAlertDescription>Check your network connection and retry.</WidgetAlertDescription>
      </WidgetAlertContent>
      <WidgetAlertActions><MoreVerticalIcon /></WidgetAlertActions>
    </WidgetAlert>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[420px]">
      <WidgetAlert variant="info">
        <WidgetAlertIcon><InfoIcon /></WidgetAlertIcon>
        <WidgetAlertContent><WidgetAlertTitle>Info alert</WidgetAlertTitle></WidgetAlertContent>
      </WidgetAlert>
      <WidgetAlert variant="success">
        <WidgetAlertIcon><CheckCircleIcon /></WidgetAlertIcon>
        <WidgetAlertContent><WidgetAlertTitle>Success alert</WidgetAlertTitle></WidgetAlertContent>
      </WidgetAlert>
      <WidgetAlert variant="warning">
        <WidgetAlertIcon><WarningCircleIcon /></WidgetAlertIcon>
        <WidgetAlertContent><WidgetAlertTitle>Warning alert</WidgetAlertTitle></WidgetAlertContent>
      </WidgetAlert>
      <WidgetAlert variant="danger">
        <WidgetAlertIcon><TimesCircleIcon /></WidgetAlertIcon>
        <WidgetAlertContent><WidgetAlertTitle>Danger alert</WidgetAlertTitle></WidgetAlertContent>
      </WidgetAlert>
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <WidgetAlert variant="warning" interactive className="w-[420px]">
      <WidgetAlertIcon><WarningCircleIcon /></WidgetAlertIcon>
      <WidgetAlertContent>
        <WidgetAlertTitle>Disk space running low</WidgetAlertTitle>
        <WidgetAlertDate>Today, 2:00 PM</WidgetAlertDate>
        <WidgetAlertDescription>Only 10% storage remaining. Click for details.</WidgetAlertDescription>
      </WidgetAlertContent>
      <WidgetAlertActions><MoreVerticalIcon /></WidgetAlertActions>
    </WidgetAlert>
  ),
}
