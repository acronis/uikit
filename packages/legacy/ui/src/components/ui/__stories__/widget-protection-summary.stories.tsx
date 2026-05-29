import type { Meta, StoryObj } from '@storybook/react-vite'
import { ShieldIcon } from '@/components/icons'

const MoreVerticalIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
  </svg>
)
import {
  WidgetProtectionSummary,
  WidgetProtectionSummaryHeader,
  WidgetProtectionSummaryTitle,
  WidgetProtectionSummaryIcon,
  WidgetProtectionSummaryContent,
  WidgetProtectionSummaryRow,
  WidgetProtectionSummaryDivider,
  WidgetProtectionSummaryFooter,
} from '../widget-protection-summary'

const meta = {
  title: 'UI/WidgetProtectionSummary',
  component: WidgetProtectionSummary,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof WidgetProtectionSummary>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <WidgetProtectionSummary className="w-[320px]">
      <WidgetProtectionSummaryHeader>
        <WidgetProtectionSummaryIcon><ShieldIcon /></WidgetProtectionSummaryIcon>
        <WidgetProtectionSummaryTitle>Protection Summary</WidgetProtectionSummaryTitle>
        <MoreVerticalIcon className="h-4 w-4 ml-auto text-muted-foreground" />
      </WidgetProtectionSummaryHeader>
      <WidgetProtectionSummaryContent>
        <WidgetProtectionSummaryRow label="Protected" value={842} status="success" />
        <WidgetProtectionSummaryRow label="Warning" value={56} status="warning" />
        <WidgetProtectionSummaryRow label="Critical" value={12} status="critical" />
        <WidgetProtectionSummaryRow label="Failed" value={7} status="danger" />
      </WidgetProtectionSummaryContent>
    </WidgetProtectionSummary>
  ),
}

export const WithDivider: Story = {
  render: () => (
    <WidgetProtectionSummary className="w-[320px]">
      <WidgetProtectionSummaryHeader>
        <WidgetProtectionSummaryIcon><ShieldIcon /></WidgetProtectionSummaryIcon>
        <WidgetProtectionSummaryTitle>Backup Summary</WidgetProtectionSummaryTitle>
      </WidgetProtectionSummaryHeader>
      <WidgetProtectionSummaryContent>
        <WidgetProtectionSummaryRow label="Successful" value={1240} status="success" />
        <WidgetProtectionSummaryRow label="In Progress" value={38} status="info" />
        <WidgetProtectionSummaryDivider />
        <WidgetProtectionSummaryRow label="Warning" value={24} status="warning" />
        <WidgetProtectionSummaryRow label="Failed" value={9} status="danger" />
      </WidgetProtectionSummaryContent>
    </WidgetProtectionSummary>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <WidgetProtectionSummary className="w-[320px]">
      <WidgetProtectionSummaryHeader>
        <WidgetProtectionSummaryIcon><ShieldIcon /></WidgetProtectionSummaryIcon>
        <WidgetProtectionSummaryTitle>Device Status</WidgetProtectionSummaryTitle>
      </WidgetProtectionSummaryHeader>
      <WidgetProtectionSummaryContent>
        <WidgetProtectionSummaryRow label="Online" value={684} status="success" />
        <WidgetProtectionSummaryRow label="Offline" value={120} status="neutral" />
        <WidgetProtectionSummaryRow label="Unreachable" value={18} status="warning" />
      </WidgetProtectionSummaryContent>
      <WidgetProtectionSummaryFooter>Total: 822 devices</WidgetProtectionSummaryFooter>
    </WidgetProtectionSummary>
  ),
}

export const Interactive: Story = {
  render: () => (
    <WidgetProtectionSummary interactive className="w-[320px]">
      <WidgetProtectionSummaryHeader>
        <WidgetProtectionSummaryIcon><ShieldIcon /></WidgetProtectionSummaryIcon>
        <WidgetProtectionSummaryTitle>Click for details</WidgetProtectionSummaryTitle>
      </WidgetProtectionSummaryHeader>
      <WidgetProtectionSummaryContent>
        <WidgetProtectionSummaryRow label="Protected" value={512} status="success" />
        <WidgetProtectionSummaryRow label="At Risk" value={34} status="warning" />
        <WidgetProtectionSummaryRow label="Failed" value={5} status="danger" />
      </WidgetProtectionSummaryContent>
    </WidgetProtectionSummary>
  ),
}
