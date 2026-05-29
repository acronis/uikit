import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@acronis-platform/shadcn-uikit/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@acronis-platform/shadcn-uikit/react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@acronis-platform/shadcn-uikit/react'
import { getChartColors, addColorsToData, CHART_COLORS_SEMANTIC } from '@/lib/chart-colors'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  ComposedChart,
  Treemap,
} from 'recharts'

const lineData = [
  { month: 'Jan', sales: 4000, revenue: 2400, profit: 2400 },
  { month: 'Feb', sales: 3000, revenue: 1398, profit: 2210 },
  { month: 'Mar', sales: 2000, revenue: 9800, profit: 2290 },
  { month: 'Apr', sales: 2780, revenue: 3908, profit: 2000 },
  { month: 'May', sales: 1890, revenue: 4800, profit: 2181 },
  { month: 'Jun', sales: 2390, revenue: 3800, profit: 2500 },
  { month: 'Jul', sales: 3490, revenue: 4300, profit: 2100 },
]

const areaData = [
  { date: '2024-01-01', desktop: 186, mobile: 80, tablet: 30 },
  { date: '2024-01-02', desktop: 305, mobile: 200, tablet: 45 },
  { date: '2024-01-03', desktop: 237, mobile: 120, tablet: 60 },
  { date: '2024-01-04', desktop: 373, mobile: 290, tablet: 80 },
  { date: '2024-01-05', desktop: 309, mobile: 330, tablet: 100 },
  { date: '2024-01-06', desktop: 245, mobile: 380, tablet: 120 },
]

const barData = [
  { product: 'Product A', sales: 4000, returns: 240 },
  { product: 'Product B', sales: 3000, returns: 139 },
  { product: 'Product C', sales: 2000, returns: 980 },
  { product: 'Product D', sales: 2780, returns: 390 },
  { product: 'Product E', sales: 1890, returns: 480 },
]

const pieData = addColorsToData([
  { name: 'Desktop', value: 400 },
  { name: 'Mobile', value: 300 },
  { name: 'Tablet', value: 200 },
  { name: 'Other', value: 100 },
])

const radialData = addColorsToData(
  [
    { name: '18-24', uv: 31.47 },
    { name: '25-29', uv: 26.69 },
    { name: '30-34', uv: 15.69 },
    { name: '35-39', uv: 8.22 },
    { name: '40-49', uv: 8.63 },
  ],
  'fill'
)

const scatterData = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
]

const composedData = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
]

const treemapData = [
  {
    name: 'Organizations',
    children: [
      {
        name: 'Westfield Labs Platform',
        size: 84,
        status: 'warning',
        description: '84 unprotected files',
      },
      {
        name: 'Force Touch Cloud',
        size: 350,
        status: 'critical',
        description: '350 unprotected files',
      },
      {
        name: 'Blue Sky Group',
        size: 200,
        status: 'success',
        description: 'All files protected',
      },
      {
        name: 'Ingram Micro',
        size: 180,
        status: 'success',
        description: 'All files protected',
      },
      {
        name: 'Fusion Media',
        size: 1029,
        status: 'danger',
        description: '1 029',
      },
      {
        name: 'Triple C',
        size: 1256,
        status: 'danger',
        description: '1 256',
      },
      {
        name: 'Telstra',
        size: 170,
        status: 'critical',
        description: '170',
      },
      {
        name: 'Land UP',
        size: 43,
        status: 'warning',
        description: '43 unprotected files',
      },
      {
        name: 'Host Europe',
        size: 246,
        status: 'critical',
        description: '246 unprotected files',
      },
    ],
  },
]

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, status, description } = props

  const colorMap: Record<string, string> = {
    danger: CHART_COLORS_SEMANTIC.danger,
    critical: CHART_COLORS_SEMANTIC.critical,
    warning: CHART_COLORS_SEMANTIC.warning,
    success: CHART_COLORS_SEMANTIC.success,
  }

  const textColorMap: Record<string, string> = {
    danger: '#FFFFFF',
    critical: 'rgba(36, 49, 67, 0.9)',
    warning: 'rgba(36, 49, 67, 0.9)',
    success: 'rgba(36, 49, 67, 0.9)',
  }

  const fill = colorMap[status] || CHART_COLORS_SEMANTIC.primary
  const textColor = textColorMap[status] || '#FFFFFF'

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill,
          stroke: '#fff',
          strokeWidth: 4,
        }}
      />
      {width > 60 && height > 40 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 8}
            textAnchor="middle"
            fill={textColor}
            stroke="none"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 12}
            textAnchor="middle"
            fill={textColor}
            stroke="none"
          >
            {description}
          </text>
        </>
      )}
      {width > 30 && width <= 60 && height > 20 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 4}
          textAnchor="middle"
          fill={textColor}
          fontSize={12}
        >
          {description}
        </text>
      )}
    </g>
  )
}

export function ChartAll() {
  const lineColors = getChartColors(3)
  const areaColors = getChartColors(3)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="line" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="line">Line</TabsTrigger>
          <TabsTrigger value="area">Area</TabsTrigger>
          <TabsTrigger value="bar">Bar</TabsTrigger>
          <TabsTrigger value="pie">Pie</TabsTrigger>
          <TabsTrigger value="radial">Radial</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="line" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Line Chart</CardTitle>
              <CardDescription>
                Multi-line chart showing sales, revenue, and profit trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sales: {
                    label: 'Sales',
                    color: 'hsl(var(--primary))',
                  },
                  revenue: {
                    label: 'Revenue',
                    color: 'hsl(var(--secondary))',
                  },
                  profit: {
                    label: 'Profit',
                    color: 'hsl(var(--accent))',
                  },
                }}
                className="h-[400px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke={lineColors[0]}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke={lineColors[1]}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke={lineColors[2]}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="area" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Area Chart</CardTitle>
              <CardDescription>
                Stacked area chart showing device usage over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  desktop: {
                    label: 'Desktop',
                    color: 'hsl(var(--primary))',
                  },
                  mobile: {
                    label: 'Mobile',
                    color: 'hsl(var(--secondary))',
                  },
                  tablet: {
                    label: 'Tablet',
                    color: 'hsl(var(--accent))',
                  },
                }}
                className="h-[400px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="desktop"
                      stackId="1"
                      stroke={areaColors[0]}
                      fill={areaColors[0]}
                    />
                    <Area
                      type="monotone"
                      dataKey="mobile"
                      stackId="1"
                      stroke={areaColors[1]}
                      fill={areaColors[1]}
                    />
                    <Area
                      type="monotone"
                      dataKey="tablet"
                      stackId="1"
                      stroke={areaColors[2]}
                      fill={areaColors[2]}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bar Chart</CardTitle>
              <CardDescription>
                Grouped bar chart comparing sales and returns by product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sales: {
                    label: 'Sales',
                    color: 'hsl(var(--primary))',
                  },
                  returns: {
                    label: 'Returns',
                    color: 'hsl(var(--destructive))',
                  },
                }}
                className="h-[400px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="sales" fill={CHART_COLORS_SEMANTIC.primary} />
                    <Bar dataKey="returns" fill={CHART_COLORS_SEMANTIC.danger} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pie Chart</CardTitle>
              <CardDescription>Device distribution across different platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={(entry as any).color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Radial Bar Chart</CardTitle>
              <CardDescription>Age distribution of users</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="10%"
                    outerRadius="80%"
                    data={radialData}
                  >
                    <RadialBar
                      dataKey="uv"
                      cornerRadius={10}
                      fill="hsl(var(--chart-1))"
                    />
                    <Legend
                      iconSize={10}
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Scatter Chart</CardTitle>
                <CardDescription>Correlation between variables</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="x" type="number" name="stature" unit="cm" />
                      <YAxis dataKey="y" type="number" name="weight" unit="kg" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Scatter
                        name="A school"
                        data={scatterData}
                        fill={CHART_COLORS_SEMANTIC.primary}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Composed Chart</CardTitle>
                <CardDescription>Combination of line and bar charts</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    uv: {
                      label: 'UV',
                      color: 'hsl(var(--primary))',
                    },
                    pv: {
                      label: 'PV',
                      color: 'hsl(var(--secondary))',
                    },
                  }}
                  className="h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={composedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="pv" fill={CHART_COLORS_SEMANTIC.success} />
                      <Line
                        type="monotone"
                        dataKey="uv"
                        stroke={CHART_COLORS_SEMANTIC.primary}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Treemap</CardTitle>
                <CardDescription>Data protection map - 15 Organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                      data={treemapData}
                      dataKey="size"
                      nameKey="name"
                      stroke="#fff"
                      fill="#8884d8"
                      animationDuration={500}
                      content={<CustomTreemapContent />}
                    />
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
