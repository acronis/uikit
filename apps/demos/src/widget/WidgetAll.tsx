import * as React from 'react'
import {
  Widget,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetActions,
  WidgetContent,
  WidgetFooter,
  // WidgetValue,
  // WidgetLabel,
  // WidgetDivider,
  WidgetAlert,
  WidgetAlertIcon,
  WidgetAlertContent,
  WidgetAlertTitle,
  WidgetAlertDate,
  WidgetAlertDescription,
  WidgetAlertActions,
  WidgetProgressTiers,
  WidgetProgressTiersHeader,
  WidgetProgressTiersTitle,
  WidgetProgressTiersIcon,
  WidgetProgressTiersBar,
  WidgetProgressTiersLegend,
  WidgetProgressTiersLegendItem,
  WidgetProgressTiersFooter,
  WidgetProgressChunks,
  WidgetProgressChunksHeader,
  WidgetProgressChunksTitle,
  WidgetProgressChunksIcon,
  WidgetProgressChunksBody,
  WidgetProgressChunkRow,
  WidgetProgressChunksFooter,
  WidgetPlaceholder,
  WidgetPlaceholderHeader,
  WidgetPlaceholderTitle,
  WidgetPlaceholderIcon,
  WidgetPlaceholderContent,
  WidgetPlaceholderImage,
  WidgetPlaceholderText,
  WidgetPlaceholderAction,
  WidgetProtectionStatus,
  WidgetProtectionStatusHeader,
  WidgetProtectionStatusTitle,
  WidgetProtectionStatusIcon,
  WidgetProtectionStatusContent,
  WidgetProtectionStatusIndicator,
  WidgetProtectionStatusValue,
  WidgetProtectionStatusLabel,
  WidgetProtectionSummary,
  WidgetProtectionSummaryHeader,
  WidgetProtectionSummaryTitle,
  WidgetProtectionSummaryIcon,
  WidgetProtectionSummaryContent,
  WidgetProtectionSummaryRow,
  WidgetProtectionSummaryDivider,
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
  WidgetText,
  WidgetTextHeader,
  WidgetTextTitle,
  WidgetTextIcon,
  WidgetTextContent,
  WidgetTextValue,
  // WidgetTextLabel,
  WidgetTextTrend,
  // WidgetTextFooter,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@acronis-platform/shadcn-uikit/react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Treemap,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  CheckCircleIcon,
  EllipsisHIcon,
  FileTextIcon,
  InfoIcon,
  ShieldIcon,
  TimesCircleIcon,
  WarningCircleIcon,
} from '@acronis-platform/shadcn-uikit'
import { DatabaseIcon } from '../icons/missing-icons'
// ── Sample Data ──

const barData = [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 200 },
  { name: 'Wed', value: 150 },
  { name: 'Thu', value: 280 },
  { name: 'Fri', value: 190 },
  { name: 'Sat', value: 90 },
  { name: 'Sun', value: 60 },
]

const lineData = [
  { name: 'Jan', value: 400, prev: 300 },
  { name: 'Feb', value: 300, prev: 350 },
  { name: 'Mar', value: 600, prev: 400 },
  { name: 'Apr', value: 800, prev: 500 },
  { name: 'May', value: 500, prev: 450 },
  { name: 'Jun', value: 700, prev: 600 },
]

const areaData = [
  { name: 'Jan', a: 400, b: 240, c: 100 },
  { name: 'Feb', a: 300, b: 139, c: 200 },
  { name: 'Mar', a: 200, b: 980, c: 300 },
  { name: 'Apr', a: 278, b: 390, c: 150 },
  { name: 'May', a: 189, b: 480, c: 250 },
  { name: 'Jun', a: 239, b: 380, c: 180 },
]

const donutData = [
  { name: 'Protected', value: 68, color: 'var(--av-chart-success)' },
  { name: 'Unprotected', value: 22, color: 'var(--av-chart-danger)' },
  { name: 'Partial', value: 10, color: 'var(--av-chart-warning)' },
]

const treemapData = [
  { name: 'Org', children: [
    { name: 'Cloud', size: 350, color: 'var(--av-chart-danger)' },
    { name: 'On-Prem', size: 200, color: 'var(--av-chart-success)' },
    { name: 'Hybrid', size: 180, color: 'var(--av-chart-warning)' },
    { name: 'Edge', size: 84, color: 'var(--av-chart-critical)' },
    { name: 'Archive', size: 43, color: 'var(--av-chart-neutral)' },
  ]}
]

const progressTiers = [
  { label: 'Success', value: 45, color: 'var(--av-chart-success)' },
  { label: 'Warning', value: 20, color: 'var(--av-chart-warning)' },
  { label: 'Critical', value: 15, color: 'var(--av-chart-critical)' },
  { label: 'Danger', value: 10, color: 'var(--av-chart-danger)' },
  { label: 'Neutral', value: 10, color: 'var(--av-chart-neutral)' },
]

const TreemapContent = (props: any) => {
  const { x, y, width, height, name, color } = props
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} style={{ fill: color || '#8884d8', stroke: '#fff', strokeWidth: 3 }} />
      {width > 50 && height > 25 && (
        <text x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle" fill="#fff" fontSize={12}>{name}</text>
      )}
    </g>
  )
}

export function WidgetAll() {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="charts">Chart Widgets</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="data">Data & Text</TabsTrigger>
        </TabsList>

        {/* ── Chart Widgets ── */}
        <TabsContent value="charts" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Bar Chart Widget */}
            <Widget size="lg" interactive>
              <WidgetHeader>
                <WidgetIcon><DatabaseIcon className="h-4 w-4" /></WidgetIcon>
                <WidgetTitle>Backup Jobs</WidgetTitle>
                <WidgetActions><EllipsisHIcon className="h-4 w-4" /></WidgetActions>
              </WidgetHeader>
              <WidgetContent className="flex-1">
                <ChartContainer config={{ value: { label: 'Jobs', color: 'var(--av-chart-blue)' } }} className="h-[160px] w-full">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="var(--av-chart-blue)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </WidgetContent>
              <WidgetFooter>
                <span className="text-xs text-muted-foreground">Last 7 days</span>
              </WidgetFooter>
            </Widget>

            {/* Line Chart Widget */}
            <Widget size="lg" interactive>
              <WidgetHeader>
                <WidgetIcon><DatabaseIcon className="h-4 w-4" /></WidgetIcon>
                <WidgetTitle>Recovery Points</WidgetTitle>
                <WidgetActions><EllipsisHIcon className="h-4 w-4" /></WidgetActions>
              </WidgetHeader>
              <WidgetContent className="flex-1">
                <ChartContainer config={{
                  value: { label: 'Current', color: 'var(--av-chart-blue)' },
                  prev: { label: 'Previous', color: 'var(--av-chart-grey)' },
                }} className="h-[160px] w-full">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="prev" stroke="var(--av-chart-grey)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    <Line type="monotone" dataKey="value" stroke="var(--av-chart-blue)" strokeWidth={2} />
                  </LineChart>
                </ChartContainer>
              </WidgetContent>
              <WidgetFooter>
                <span className="text-xs text-muted-foreground">Monthly trend</span>
              </WidgetFooter>
            </Widget>

            {/* Donut Chart Widget */}
            <Widget size="lg" interactive>
              <WidgetHeader>
                <WidgetIcon><ShieldIcon className="h-4 w-4" /></WidgetIcon>
                <WidgetTitle>Protection Coverage</WidgetTitle>
                <WidgetActions><EllipsisHIcon className="h-4 w-4" /></WidgetActions>
              </WidgetHeader>
              <WidgetContent className="flex-1 flex items-center justify-center">
                <ChartContainer config={{}} className="h-[160px] w-[200px]">
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={2}>
                      {donutData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </WidgetContent>
              <WidgetFooter>
                <div className="flex gap-4 text-xs">
                  {donutData.map((d, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: d.color }} />
                      <span>{d.name}: {d.value}%</span>
                    </div>
                  ))}
                </div>
              </WidgetFooter>
            </Widget>

            {/* Stacked Area Widget */}
            <Widget size="lg" interactive>
              <WidgetHeader>
                <WidgetIcon><DatabaseIcon className="h-4 w-4" /></WidgetIcon>
                <WidgetTitle>Storage Usage</WidgetTitle>
                <WidgetActions><EllipsisHIcon className="h-4 w-4" /></WidgetActions>
              </WidgetHeader>
              <WidgetContent className="flex-1">
                <ChartContainer config={{
                  a: { label: 'Cloud', color: 'var(--av-chart-blue)' },
                  b: { label: 'Local', color: 'var(--av-chart-green)' },
                  c: { label: 'Archive', color: 'var(--av-chart-purple)' },
                }} className="h-[160px] w-full">
                  <AreaChart data={areaData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="c" stackId="1" stroke="var(--av-chart-purple)" fill="var(--av-chart-purple)" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="b" stackId="1" stroke="var(--av-chart-green)" fill="var(--av-chart-green)" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="a" stackId="1" stroke="var(--av-chart-blue)" fill="var(--av-chart-blue)" fillOpacity={0.6} />
                  </AreaChart>
                </ChartContainer>
              </WidgetContent>
              <WidgetFooter>
                <span className="text-xs text-muted-foreground">6-month overview</span>
              </WidgetFooter>
            </Widget>

            {/* Treemap Widget */}
            <Widget size="lg" interactive className="md:col-span-2">
              <WidgetHeader>
                <WidgetIcon><DatabaseIcon className="h-4 w-4" /></WidgetIcon>
                <WidgetTitle>Data Protection Map — Organizations</WidgetTitle>
                <WidgetActions><EllipsisHIcon className="h-4 w-4" /></WidgetActions>
              </WidgetHeader>
              <WidgetContent className="flex-1">
                <ChartContainer config={{}} className="h-[200px] w-full">
                  <Treemap data={treemapData} dataKey="size" nameKey="name" stroke="#fff" animationDuration={300} content={<TreemapContent />} />
                </ChartContainer>
              </WidgetContent>
            </Widget>
          </div>
        </TabsContent>

        {/* ── Progress Widgets ── */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Progress Tiers */}
            <WidgetProgressTiers interactive>
              <WidgetProgressTiersHeader>
                <WidgetProgressTiersIcon><ShieldIcon className="h-4 w-4" /></WidgetProgressTiersIcon>
                <WidgetProgressTiersTitle>Protection Status</WidgetProgressTiersTitle>
              </WidgetProgressTiersHeader>
              <WidgetProgressTiersBar tiers={progressTiers} />
              <WidgetProgressTiersLegend>
                {progressTiers.map((tier, i) => (
                  <WidgetProgressTiersLegendItem key={i} color={tier.color} label={tier.label} value={`${tier.value}%`} />
                ))}
              </WidgetProgressTiersLegend>
              <WidgetProgressTiersFooter>
                <span>100 total devices</span>
              </WidgetProgressTiersFooter>
            </WidgetProgressTiers>

            {/* Progress Chunks */}
            <WidgetProgressChunks interactive>
              <WidgetProgressChunksHeader>
                <WidgetProgressChunksIcon><DatabaseIcon className="h-4 w-4" /></WidgetProgressChunksIcon>
                <WidgetProgressChunksTitle>Storage Quotas</WidgetProgressChunksTitle>
              </WidgetProgressChunksHeader>
              <WidgetProgressChunksBody>
                <WidgetProgressChunkRow label="Cloud Storage" value={75} total={100} color="var(--av-chart-success)" />
                <WidgetProgressChunkRow label="Local Storage" value={45} total={100} color="var(--av-chart-warning)" />
                <WidgetProgressChunkRow label="Archive" value={92} total={100} color="var(--av-chart-danger)" />
                <WidgetProgressChunkRow label="Temporary" value={12} total={100} color="var(--av-chart-info)" />
              </WidgetProgressChunksBody>
              <WidgetProgressChunksFooter>
                <span>Updated 5 minutes ago</span>
              </WidgetProgressChunksFooter>
            </WidgetProgressChunks>

            {/* Protection Status */}
            <WidgetProtectionStatus interactive>
              <WidgetProtectionStatusHeader>
                <WidgetProtectionStatusIcon><ShieldIcon className="h-4 w-4" /></WidgetProtectionStatusIcon>
                <WidgetProtectionStatusTitle>Overall Status</WidgetProtectionStatusTitle>
              </WidgetProtectionStatusHeader>
              <WidgetProtectionStatusContent>
                <WidgetProtectionStatusIndicator status="success">
                  <WidgetProtectionStatusLabel>All systems operational</WidgetProtectionStatusLabel>
                </WidgetProtectionStatusIndicator>
                <WidgetProtectionStatusValue>98.5%</WidgetProtectionStatusValue>
                <WidgetProtectionStatusLabel>Uptime this month</WidgetProtectionStatusLabel>
              </WidgetProtectionStatusContent>
            </WidgetProtectionStatus>

            {/* Protection Summary */}
            <WidgetProtectionSummary interactive>
              <WidgetProtectionSummaryHeader>
                <WidgetProtectionSummaryIcon><ShieldIcon className="h-4 w-4" /></WidgetProtectionSummaryIcon>
                <WidgetProtectionSummaryTitle>Protection Summary</WidgetProtectionSummaryTitle>
              </WidgetProtectionSummaryHeader>
              <WidgetProtectionSummaryContent>
                <WidgetProtectionSummaryRow label="Protected" value="1,234" status="success" />
                <WidgetProtectionSummaryRow label="Unprotected" value="56" status="danger" />
                <WidgetProtectionSummaryRow label="Partially Protected" value="89" status="warning" />
                <WidgetProtectionSummaryDivider />
                <WidgetProtectionSummaryRow label="Total Devices" value="1,379" />
              </WidgetProtectionSummaryContent>
            </WidgetProtectionSummary>
          </div>
        </TabsContent>

        {/* ── Alert Widgets ── */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <WidgetAlert variant="info" interactive>
              <WidgetAlertIcon><InfoIcon className="h-4 w-4" /></WidgetAlertIcon>
              <WidgetAlertContent>
                <WidgetAlertTitle>System Update Available</WidgetAlertTitle>
                <WidgetAlertDate>Feb 23, 2026 — 14:30</WidgetAlertDate>
                <WidgetAlertDescription>A new version of the backup agent is available for download.</WidgetAlertDescription>
              </WidgetAlertContent>
              <WidgetAlertActions><EllipsisHIcon className="h-4 w-4" /></WidgetAlertActions>
            </WidgetAlert>

            <WidgetAlert variant="success" interactive>
              <WidgetAlertIcon><CheckCircleIcon className="h-4 w-4" /></WidgetAlertIcon>
              <WidgetAlertContent>
                <WidgetAlertTitle>Backup Completed</WidgetAlertTitle>
                <WidgetAlertDate>Feb 23, 2026 — 12:00</WidgetAlertDate>
                <WidgetAlertDescription>All 156 devices backed up successfully.</WidgetAlertDescription>
              </WidgetAlertContent>
              <WidgetAlertActions><EllipsisHIcon className="h-4 w-4" /></WidgetAlertActions>
            </WidgetAlert>

            <WidgetAlert variant="warning" interactive>
              <WidgetAlertIcon><WarningCircleIcon className="h-4 w-4" /></WidgetAlertIcon>
              <WidgetAlertContent>
                <WidgetAlertTitle>Storage Running Low</WidgetAlertTitle>
                <WidgetAlertDate>Feb 23, 2026 — 10:15</WidgetAlertDate>
                <WidgetAlertDescription>Cloud storage is at 92% capacity. Consider upgrading your plan.</WidgetAlertDescription>
              </WidgetAlertContent>
              <WidgetAlertActions><EllipsisHIcon className="h-4 w-4" /></WidgetAlertActions>
            </WidgetAlert>

            <WidgetAlert variant="danger" interactive>
              <WidgetAlertIcon><TimesCircleIcon className="h-4 w-4" /></WidgetAlertIcon>
              <WidgetAlertContent>
                <WidgetAlertTitle>Backup Failed</WidgetAlertTitle>
                <WidgetAlertDate>Feb 23, 2026 — 08:45</WidgetAlertDate>
                <WidgetAlertDescription>3 devices failed to complete backup. Check agent connectivity.</WidgetAlertDescription>
              </WidgetAlertContent>
              <WidgetAlertActions><EllipsisHIcon className="h-4 w-4" /></WidgetAlertActions>
            </WidgetAlert>
          </div>

          {/* Compact alerts (no description) */}
          <h3 className="text-lg font-semibold mt-6">Compact Alerts</h3>
          <div className="space-y-2">
            <WidgetAlert variant="info">
              <WidgetAlertIcon><InfoIcon className="h-4 w-4" /></WidgetAlertIcon>
              <WidgetAlertContent>
                <WidgetAlertTitle>Scheduled maintenance window: Sunday 02:00–04:00 UTC</WidgetAlertTitle>
              </WidgetAlertContent>
            </WidgetAlert>
            <WidgetAlert variant="success">
              <WidgetAlertIcon><CheckCircleIcon className="h-4 w-4" /></WidgetAlertIcon>
              <WidgetAlertContent>
                <WidgetAlertTitle>All recovery tests passed successfully</WidgetAlertTitle>
              </WidgetAlertContent>
            </WidgetAlert>
          </div>
        </TabsContent>

        {/* ── Data & Text Widgets ── */}
        <TabsContent value="data" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Text Widgets */}
            <WidgetText interactive>
              <WidgetTextHeader>
                <WidgetTextIcon><DatabaseIcon className="h-4 w-4" /></WidgetTextIcon>
                <WidgetTextTitle>Total Backups</WidgetTextTitle>
              </WidgetTextHeader>
              <WidgetTextContent>
                <WidgetTextValue>12,847</WidgetTextValue>
                <WidgetTextTrend direction="up">+12.5% vs last month</WidgetTextTrend>
              </WidgetTextContent>
            </WidgetText>

            <WidgetText interactive>
              <WidgetTextHeader>
                <WidgetTextIcon><ShieldIcon className="h-4 w-4" /></WidgetTextIcon>
                <WidgetTextTitle>Protected Devices</WidgetTextTitle>
              </WidgetTextHeader>
              <WidgetTextContent>
                <WidgetTextValue>1,234</WidgetTextValue>
                <WidgetTextTrend direction="up">+3.2% vs last month</WidgetTextTrend>
              </WidgetTextContent>
            </WidgetText>

            <WidgetText interactive>
              <WidgetTextHeader>
                <WidgetTextIcon><FileTextIcon className="h-4 w-4" /></WidgetTextIcon>
                <WidgetTextTitle>Failed Jobs</WidgetTextTitle>
              </WidgetTextHeader>
              <WidgetTextContent>
                <WidgetTextValue>23</WidgetTextValue>
                <WidgetTextTrend direction="down">-8.0% vs last month</WidgetTextTrend>
              </WidgetTextContent>
            </WidgetText>
          </div>

          {/* Table Data Widget */}
          <WidgetTableData interactive>
            <WidgetTableDataHeader>
              <WidgetTableDataIcon><DatabaseIcon className="h-4 w-4" /></WidgetTableDataIcon>
              <WidgetTableDataTitle>Recent Backup Jobs</WidgetTableDataTitle>
            </WidgetTableDataHeader>
            <WidgetTableDataContent>
              <WidgetTableDataTable>
                <WidgetTableDataThead>
                  <tr>
                    <WidgetTableDataTh>Device</WidgetTableDataTh>
                    <WidgetTableDataTh>Status</WidgetTableDataTh>
                    <WidgetTableDataTh>Size</WidgetTableDataTh>
                    <WidgetTableDataTh>Duration</WidgetTableDataTh>
                    <WidgetTableDataTh>Time</WidgetTableDataTh>
                  </tr>
                </WidgetTableDataThead>
                <WidgetTableDataTbody>
                  <WidgetTableDataTr>
                    <WidgetTableDataTd><WidgetTableDataLink>server-prod-01</WidgetTableDataLink></WidgetTableDataTd>
                    <WidgetTableDataTd><span className="text-[var(--av-chart-success)]">Success</span></WidgetTableDataTd>
                    <WidgetTableDataTd>2.4 GB</WidgetTableDataTd>
                    <WidgetTableDataTd>12m 34s</WidgetTableDataTd>
                    <WidgetTableDataTd>14:30</WidgetTableDataTd>
                  </WidgetTableDataTr>
                  <WidgetTableDataTr>
                    <WidgetTableDataTd><WidgetTableDataLink>server-prod-02</WidgetTableDataLink></WidgetTableDataTd>
                    <WidgetTableDataTd><span className="text-[var(--av-chart-success)]">Success</span></WidgetTableDataTd>
                    <WidgetTableDataTd>1.8 GB</WidgetTableDataTd>
                    <WidgetTableDataTd>8m 12s</WidgetTableDataTd>
                    <WidgetTableDataTd>14:28</WidgetTableDataTd>
                  </WidgetTableDataTr>
                  <WidgetTableDataTr>
                    <WidgetTableDataTd><WidgetTableDataLink>workstation-dev-05</WidgetTableDataLink></WidgetTableDataTd>
                    <WidgetTableDataTd><span className="text-[var(--av-chart-danger)]">Failed</span></WidgetTableDataTd>
                    <WidgetTableDataTd>—</WidgetTableDataTd>
                    <WidgetTableDataTd>—</WidgetTableDataTd>
                    <WidgetTableDataTd>14:15</WidgetTableDataTd>
                  </WidgetTableDataTr>
                  <WidgetTableDataTr>
                    <WidgetTableDataTd><WidgetTableDataLink>nas-backup-01</WidgetTableDataLink></WidgetTableDataTd>
                    <WidgetTableDataTd><span className="text-[var(--av-chart-warning)]">Warning</span></WidgetTableDataTd>
                    <WidgetTableDataTd>5.1 GB</WidgetTableDataTd>
                    <WidgetTableDataTd>45m 02s</WidgetTableDataTd>
                    <WidgetTableDataTd>13:50</WidgetTableDataTd>
                  </WidgetTableDataTr>
                </WidgetTableDataTbody>
              </WidgetTableDataTable>
            </WidgetTableDataContent>
            <WidgetTableDataFooter>
              <span>Showing 4 of 156 jobs</span>
              <WidgetTableDataLink>View all →</WidgetTableDataLink>
            </WidgetTableDataFooter>
          </WidgetTableData>

          {/* Placeholder Widget */}
          <div className="grid gap-4 md:grid-cols-2">
            <WidgetPlaceholder interactive>
              <WidgetPlaceholderHeader>
                <WidgetPlaceholderIcon><DatabaseIcon className="h-4 w-4" /></WidgetPlaceholderIcon>
                <WidgetPlaceholderTitle>Disaster Recovery</WidgetPlaceholderTitle>
              </WidgetPlaceholderHeader>
              <WidgetPlaceholderContent>
                <WidgetPlaceholderImage>
                  <ShieldIcon className="h-[72px] w-[72px]" />
                </WidgetPlaceholderImage>
                <WidgetPlaceholderText>No disaster recovery plans configured yet.</WidgetPlaceholderText>
                <WidgetPlaceholderAction>Set up disaster recovery →</WidgetPlaceholderAction>
              </WidgetPlaceholderContent>
            </WidgetPlaceholder>

            <WidgetPlaceholder>
              <WidgetPlaceholderHeader>
                <WidgetPlaceholderIcon><FileTextIcon className="h-4 w-4" /></WidgetPlaceholderIcon>
                <WidgetPlaceholderTitle>Reports</WidgetPlaceholderTitle>
              </WidgetPlaceholderHeader>
              <WidgetPlaceholderContent>
                <WidgetPlaceholderImage>
                  <FileTextIcon className="h-[72px] w-[72px]" />
                </WidgetPlaceholderImage>
                <WidgetPlaceholderText>No reports have been generated.</WidgetPlaceholderText>
                <WidgetPlaceholderAction>Generate a report →</WidgetPlaceholderAction>
              </WidgetPlaceholderContent>
            </WidgetPlaceholder>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
