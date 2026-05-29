import type { Meta, StoryObj } from '@storybook/react-vite'
import { HeartbeatIcon } from '@/components/icons'

const MoreVerticalIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
  </svg>
)
import {
  WidgetProgressChunks,
  WidgetProgressChunksHeader,
  WidgetProgressChunksTitle,
  WidgetProgressChunksIcon,
  WidgetProgressChunksBody,
  WidgetProgressChunkRow,
  WidgetProgressChunksFooter,
} from '../widget-progress-chunks'

const meta = {
  title: 'UI/WidgetProgressChunks',
  component: WidgetProgressChunks,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof WidgetProgressChunks>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <WidgetProgressChunks className="w-[360px]">
      <WidgetProgressChunksHeader>
        <WidgetProgressChunksIcon><HeartbeatIcon /></WidgetProgressChunksIcon>
        <WidgetProgressChunksTitle>Backup Progress</WidgetProgressChunksTitle>
        <MoreVerticalIcon className="h-4 w-4 ml-auto text-muted-foreground" />
      </WidgetProgressChunksHeader>
      <WidgetProgressChunksBody>
        <WidgetProgressChunkRow
          label="Success"
          value={842}
          total={1000}
          color="var(--av-chart-success, #4caf50)"
        />
        <WidgetProgressChunkRow
          label="Warning"
          value={120}
          total={1000}
          color="var(--av-chart-warning, #ff9800)"
        />
        <WidgetProgressChunkRow
          label="Failed"
          value={38}
          total={1000}
          color="var(--av-chart-danger, #f44336)"
        />
      </WidgetProgressChunksBody>
    </WidgetProgressChunks>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <WidgetProgressChunks className="w-[360px]">
      <WidgetProgressChunksHeader>
        <WidgetProgressChunksIcon><HeartbeatIcon /></WidgetProgressChunksIcon>
        <WidgetProgressChunksTitle>Storage Usage</WidgetProgressChunksTitle>
      </WidgetProgressChunksHeader>
      <WidgetProgressChunksBody>
        <WidgetProgressChunkRow
          label="Documents"
          value={256}
          total={512}
          color="var(--av-chart-success, #4caf50)"
          formatValue={(v) => `${v} GB`}
          formatTotal={(t) => `${t} GB`}
        />
        <WidgetProgressChunkRow
          label="Media"
          value={180}
          total={512}
          color="var(--av-chart-warning, #ff9800)"
          formatValue={(v) => `${v} GB`}
          formatTotal={(t) => `${t} GB`}
        />
        <WidgetProgressChunkRow
          label="System"
          value={64}
          total={512}
          color="var(--av-chart-critical, #e91e63)"
          formatValue={(v) => `${v} GB`}
          formatTotal={(t) => `${t} GB`}
        />
      </WidgetProgressChunksBody>
      <WidgetProgressChunksFooter>
        Total used: 500 GB / 512 GB
      </WidgetProgressChunksFooter>
    </WidgetProgressChunks>
  ),
}

export const Interactive: Story = {
  render: () => (
    <WidgetProgressChunks interactive className="w-[360px]">
      <WidgetProgressChunksHeader>
        <WidgetProgressChunksIcon><HeartbeatIcon /></WidgetProgressChunksIcon>
        <WidgetProgressChunksTitle>Protection Coverage</WidgetProgressChunksTitle>
      </WidgetProgressChunksHeader>
      <WidgetProgressChunksBody>
        <WidgetProgressChunkRow
          label="Protected"
          value={75}
          total={100}
          color="var(--av-chart-success, #4caf50)"
          formatValue={(v) => `${v}%`}
          formatTotal={(t) => `${t}%`}
        />
        <WidgetProgressChunkRow
          label="Unprotected"
          value={25}
          total={100}
          color="var(--av-chart-danger, #f44336)"
          formatValue={(v) => `${v}%`}
          formatTotal={(t) => `${t}%`}
        />
      </WidgetProgressChunksBody>
    </WidgetProgressChunks>
  ),
}
