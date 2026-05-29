import type { Meta, StoryObj } from '@storybook/react-vite'
import { TableIcon } from '@/components/icons'

const MoreVerticalIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
  </svg>
)
import {
  WidgetTableData,
  WidgetTableDataHeader,
  WidgetTableDataTitle,
  WidgetTableDataIcon,
  WidgetTableDataContent,
  WidgetTableDataTable,
  WidgetTableDataThead,
  WidgetTableDataTh,
  WidgetTableDataTbody,
  WidgetTableDataTr,
  WidgetTableDataTd,
  WidgetTableDataLink,
  WidgetTableDataFooter,
} from '../widget-table-data'

const meta = {
  title: 'UI/WidgetTableData',
  component: WidgetTableData,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof WidgetTableData>

export default meta
type Story = StoryObj<typeof meta>

const rows = [
  { name: 'Web Server 01', status: 'Success', last: 'Today, 10:00 AM', size: '2.4 GB' },
  { name: 'DB Server 02', status: 'Warning', last: 'Today, 8:30 AM', size: '12.1 GB' },
  { name: 'File Server', status: 'Failed', last: 'Yesterday', size: '54.7 GB' },
  { name: 'Mail Server', status: 'Success', last: 'Today, 6:00 AM', size: '8.9 GB' },
]

const statusColors: Record<string, string> = {
  Success: 'var(--av-chart-success, #4caf50)',
  Warning: 'var(--av-chart-warning, #ff9800)',
  Failed: 'var(--av-chart-danger, #f44336)',
}

export const Default: Story = {
  render: () => (
    <WidgetTableData className="w-[480px]">
      <WidgetTableDataHeader>
        <WidgetTableDataIcon><TableIcon /></WidgetTableDataIcon>
        <WidgetTableDataTitle>Recent Backups</WidgetTableDataTitle>
        <MoreVerticalIcon className="h-4 w-4 ml-auto text-muted-foreground" />
      </WidgetTableDataHeader>
      <WidgetTableDataContent>
        <WidgetTableDataTable>
          <WidgetTableDataThead>
            <WidgetTableDataTr>
              <WidgetTableDataTh>Name</WidgetTableDataTh>
              <WidgetTableDataTh>Status</WidgetTableDataTh>
              <WidgetTableDataTh>Last Backup</WidgetTableDataTh>
              <WidgetTableDataTh>Size</WidgetTableDataTh>
            </WidgetTableDataTr>
          </WidgetTableDataThead>
          <WidgetTableDataTbody>
            {rows.map((row) => (
              <WidgetTableDataTr key={row.name}>
                <WidgetTableDataTd>{row.name}</WidgetTableDataTd>
                <WidgetTableDataTd>
                  <span style={{ color: statusColors[row.status] }} className="font-semibold text-xs">
                    {row.status}
                  </span>
                </WidgetTableDataTd>
                <WidgetTableDataTd>{row.last}</WidgetTableDataTd>
                <WidgetTableDataTd>{row.size}</WidgetTableDataTd>
              </WidgetTableDataTr>
            ))}
          </WidgetTableDataTbody>
        </WidgetTableDataTable>
      </WidgetTableDataContent>
    </WidgetTableData>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <WidgetTableData className="w-[480px]">
      <WidgetTableDataHeader>
        <WidgetTableDataIcon><TableIcon /></WidgetTableDataIcon>
        <WidgetTableDataTitle>Recent Backups</WidgetTableDataTitle>
      </WidgetTableDataHeader>
      <WidgetTableDataContent>
        <WidgetTableDataTable>
          <WidgetTableDataThead>
            <WidgetTableDataTr>
              <WidgetTableDataTh>Name</WidgetTableDataTh>
              <WidgetTableDataTh>Status</WidgetTableDataTh>
              <WidgetTableDataTh>Size</WidgetTableDataTh>
            </WidgetTableDataTr>
          </WidgetTableDataThead>
          <WidgetTableDataTbody>
            {rows.map((row) => (
              <WidgetTableDataTr key={row.name}>
                <WidgetTableDataTd>{row.name}</WidgetTableDataTd>
                <WidgetTableDataTd>
                  <span style={{ color: statusColors[row.status] }} className="font-semibold text-xs">
                    {row.status}
                  </span>
                </WidgetTableDataTd>
                <WidgetTableDataTd>{row.size}</WidgetTableDataTd>
              </WidgetTableDataTr>
            ))}
          </WidgetTableDataTbody>
        </WidgetTableDataTable>
      </WidgetTableDataContent>
      <WidgetTableDataFooter>
        <WidgetTableDataLink>View all backups</WidgetTableDataLink>
      </WidgetTableDataFooter>
    </WidgetTableData>
  ),
}

export const Interactive: Story = {
  render: () => (
    <WidgetTableData interactive className="w-[480px]">
      <WidgetTableDataHeader>
        <WidgetTableDataIcon><TableIcon /></WidgetTableDataIcon>
        <WidgetTableDataTitle>Click to open full report</WidgetTableDataTitle>
      </WidgetTableDataHeader>
      <WidgetTableDataContent>
        <WidgetTableDataTable>
          <WidgetTableDataThead>
            <WidgetTableDataTr>
              <WidgetTableDataTh>Name</WidgetTableDataTh>
              <WidgetTableDataTh>Status</WidgetTableDataTh>
              <WidgetTableDataTh>Last Backup</WidgetTableDataTh>
            </WidgetTableDataTr>
          </WidgetTableDataThead>
          <WidgetTableDataTbody>
            {rows.slice(0, 3).map((row) => (
              <WidgetTableDataTr key={row.name}>
                <WidgetTableDataTd>{row.name}</WidgetTableDataTd>
                <WidgetTableDataTd>
                  <span style={{ color: statusColors[row.status] }} className="font-semibold text-xs">
                    {row.status}
                  </span>
                </WidgetTableDataTd>
                <WidgetTableDataTd>{row.last}</WidgetTableDataTd>
              </WidgetTableDataTr>
            ))}
          </WidgetTableDataTbody>
        </WidgetTableDataTable>
      </WidgetTableDataContent>
    </WidgetTableData>
  ),
}
