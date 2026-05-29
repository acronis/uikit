import type { Meta, StoryObj } from '@storybook/react-vite'
import { ShieldIcon } from '@/components/icons'

const MoreVerticalIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
  </svg>
)
import {
  WidgetProtectionStatus,
  WidgetProtectionStatusHeader,
  WidgetProtectionStatusTitle,
  WidgetProtectionStatusIcon,
  WidgetProtectionStatusContent,
  WidgetProtectionStatusIndicator,
  WidgetProtectionStatusValue,
  WidgetProtectionStatusLabel,
  WidgetProtectionStatusFooter,
} from '../widget-protection-status'

const meta = {
  title: 'UI/WidgetProtectionStatus',
  component: WidgetProtectionStatus,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof WidgetProtectionStatus>

export default meta
type Story = StoryObj<typeof meta>

export const Success_: Story = {
  name: 'Success',
  render: () => (
    <WidgetProtectionStatus className="w-[240px]">
      <WidgetProtectionStatusHeader>
        <WidgetProtectionStatusIcon><ShieldIcon /></WidgetProtectionStatusIcon>
        <WidgetProtectionStatusTitle>Protected Devices</WidgetProtectionStatusTitle>
        <MoreVerticalIcon className="h-4 w-4 ml-auto text-muted-foreground" />
      </WidgetProtectionStatusHeader>
      <WidgetProtectionStatusContent>
        <WidgetProtectionStatusIndicator status="success">
          <WidgetProtectionStatusValue>1,284</WidgetProtectionStatusValue>
        </WidgetProtectionStatusIndicator>
        <WidgetProtectionStatusLabel>All devices protected</WidgetProtectionStatusLabel>
      </WidgetProtectionStatusContent>
    </WidgetProtectionStatus>
  ),
}

export const Warning_: Story = {
  name: 'Warning',
  render: () => (
    <WidgetProtectionStatus className="w-[240px]">
      <WidgetProtectionStatusHeader>
        <WidgetProtectionStatusIcon><ShieldIcon /></WidgetProtectionStatusIcon>
        <WidgetProtectionStatusTitle>At Risk</WidgetProtectionStatusTitle>
        <MoreVerticalIcon className="h-4 w-4 ml-auto text-muted-foreground" />
      </WidgetProtectionStatusHeader>
      <WidgetProtectionStatusContent>
        <WidgetProtectionStatusIndicator status="warning">
          <WidgetProtectionStatusValue>42</WidgetProtectionStatusValue>
        </WidgetProtectionStatusIndicator>
        <WidgetProtectionStatusLabel>Devices need attention</WidgetProtectionStatusLabel>
      </WidgetProtectionStatusContent>
    </WidgetProtectionStatus>
  ),
}

export const Danger_: Story = {
  name: 'Danger',
  render: () => (
    <WidgetProtectionStatus className="w-[240px]">
      <WidgetProtectionStatusHeader>
        <WidgetProtectionStatusIcon><ShieldIcon /></WidgetProtectionStatusIcon>
        <WidgetProtectionStatusTitle>Failed Backups</WidgetProtectionStatusTitle>
        <MoreVerticalIcon className="h-4 w-4 ml-auto text-muted-foreground" />
      </WidgetProtectionStatusHeader>
      <WidgetProtectionStatusContent>
        <WidgetProtectionStatusIndicator status="danger">
          <WidgetProtectionStatusValue>17</WidgetProtectionStatusValue>
        </WidgetProtectionStatusIndicator>
        <WidgetProtectionStatusLabel>Backups failed today</WidgetProtectionStatusLabel>
      </WidgetProtectionStatusContent>
      <WidgetProtectionStatusFooter>Last checked: 5 min ago</WidgetProtectionStatusFooter>
    </WidgetProtectionStatus>
  ),
}

export const AllStatuses: Story = {
  render: () => (
    <div className="flex gap-3 flex-wrap">
      {(['success', 'warning', 'critical', 'danger', 'info', 'neutral'] as const).map((status) => (
        <WidgetProtectionStatus key={status} className="w-[200px]">
          <WidgetProtectionStatusHeader>
            <WidgetProtectionStatusIcon><ShieldIcon /></WidgetProtectionStatusIcon>
            <WidgetProtectionStatusTitle className="capitalize">{status}</WidgetProtectionStatusTitle>
          </WidgetProtectionStatusHeader>
          <WidgetProtectionStatusContent>
            <WidgetProtectionStatusIndicator status={status}>
              <WidgetProtectionStatusValue>128</WidgetProtectionStatusValue>
            </WidgetProtectionStatusIndicator>
            <WidgetProtectionStatusLabel>Devices</WidgetProtectionStatusLabel>
          </WidgetProtectionStatusContent>
        </WidgetProtectionStatus>
      ))}
    </div>
  ),
}
