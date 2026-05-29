import type { Meta, StoryObj } from '@storybook/react-vite'
const BarChart3Icon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
  </svg>
)

const MoreVerticalIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
  </svg>
)
import {
  WidgetText,
  WidgetTextHeader,
  WidgetTextTitle,
  WidgetTextIcon,
  WidgetTextContent,
  WidgetTextValue,
  WidgetTextLabel,
  WidgetTextTrend,
  WidgetTextDivider,
  WidgetTextFooter,
} from '../widget-text'

const meta = {
  title: 'UI/WidgetText',
  component: WidgetText,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof WidgetText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <WidgetText className="w-[240px]">
      <WidgetTextHeader>
        <WidgetTextIcon><BarChart3Icon /></WidgetTextIcon>
        <WidgetTextTitle>Total Backups</WidgetTextTitle>
        <MoreVerticalIcon className="h-4 w-4 ml-auto text-muted-foreground" />
      </WidgetTextHeader>
      <WidgetTextContent>
        <WidgetTextValue>1,284</WidgetTextValue>
        <WidgetTextLabel>Backups completed this month</WidgetTextLabel>
      </WidgetTextContent>
    </WidgetText>
  ),
}

export const WithTrendUp: Story = {
  render: () => (
    <WidgetText className="w-[240px]">
      <WidgetTextHeader>
        <WidgetTextIcon><BarChart3Icon /></WidgetTextIcon>
        <WidgetTextTitle>Protected Devices</WidgetTextTitle>
      </WidgetTextHeader>
      <WidgetTextContent>
        <WidgetTextValue>842</WidgetTextValue>
        <WidgetTextTrend direction="up">+12% this week</WidgetTextTrend>
        <WidgetTextLabel>Compared to last week</WidgetTextLabel>
      </WidgetTextContent>
    </WidgetText>
  ),
}

export const WithTrendDown: Story = {
  render: () => (
    <WidgetText className="w-[240px]">
      <WidgetTextHeader>
        <WidgetTextIcon><BarChart3Icon /></WidgetTextIcon>
        <WidgetTextTitle>Failed Backups</WidgetTextTitle>
      </WidgetTextHeader>
      <WidgetTextContent>
        <WidgetTextValue>17</WidgetTextValue>
        <WidgetTextTrend direction="down">-5% this week</WidgetTextTrend>
        <WidgetTextLabel>Compared to last week</WidgetTextLabel>
      </WidgetTextContent>
    </WidgetText>
  ),
}

export const WithDividerAndFooter: Story = {
  render: () => (
    <WidgetText className="w-[240px]">
      <WidgetTextHeader>
        <WidgetTextIcon><BarChart3Icon /></WidgetTextIcon>
        <WidgetTextTitle>Storage Used</WidgetTextTitle>
      </WidgetTextHeader>
      <WidgetTextContent>
        <WidgetTextValue>4.8 TB</WidgetTextValue>
        <WidgetTextTrend direction="up">+320 GB</WidgetTextTrend>
        <WidgetTextLabel>of 10 TB total</WidgetTextLabel>
      </WidgetTextContent>
      <WidgetTextDivider />
      <WidgetTextFooter>Updated 5 min ago</WidgetTextFooter>
    </WidgetText>
  ),
}

export const MultipleMetrics: Story = {
  render: () => (
    <div className="flex gap-3">
      <WidgetText className="w-[200px]">
        <WidgetTextHeader>
          <WidgetTextIcon><BarChart3Icon /></WidgetTextIcon>
          <WidgetTextTitle>Backups</WidgetTextTitle>
        </WidgetTextHeader>
        <WidgetTextContent>
          <WidgetTextValue>1,284</WidgetTextValue>
          <WidgetTextTrend direction="up">+8%</WidgetTextTrend>
        </WidgetTextContent>
      </WidgetText>
      <WidgetText className="w-[200px]">
        <WidgetTextHeader>
          <WidgetTextIcon><BarChart3Icon /></WidgetTextIcon>
          <WidgetTextTitle>Failures</WidgetTextTitle>
        </WidgetTextHeader>
        <WidgetTextContent>
          <WidgetTextValue>17</WidgetTextValue>
          <WidgetTextTrend direction="down">-3%</WidgetTextTrend>
        </WidgetTextContent>
      </WidgetText>
      <WidgetText className="w-[200px]">
        <WidgetTextHeader>
          <WidgetTextIcon><BarChart3Icon /></WidgetTextIcon>
          <WidgetTextTitle>Devices</WidgetTextTitle>
        </WidgetTextHeader>
        <WidgetTextContent>
          <WidgetTextValue>842</WidgetTextValue>
          <WidgetTextTrend direction="neutral">No change</WidgetTextTrend>
        </WidgetTextContent>
      </WidgetText>
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <WidgetText interactive className="w-[240px]">
      <WidgetTextHeader>
        <WidgetTextIcon><BarChart3Icon /></WidgetTextIcon>
        <WidgetTextTitle>Click for details</WidgetTextTitle>
      </WidgetTextHeader>
      <WidgetTextContent>
        <WidgetTextValue>2,048</WidgetTextValue>
        <WidgetTextLabel>Total operations today</WidgetTextLabel>
      </WidgetTextContent>
    </WidgetText>
  ),
}
