import React from 'react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@acronis-platform/shadcn-uikit/react';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
} from 'recharts'

const barChartData = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
]

const lineChartData = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 3000, expenses: 1398 },
  { month: 'Mar', revenue: 2000, expenses: 9800 },
  { month: 'Apr', revenue: 2780, expenses: 3908 },
  { month: 'May', revenue: 1890, expenses: 4800 },
  { month: 'Jun', revenue: 2390, expenses: 3800 },
]

const areaChartData = [
  { month: 'Jan', users: 400 },
  { month: 'Feb', users: 300 },
  { month: 'Mar', users: 600 },
  { month: 'Apr', users: 800 },
  { month: 'May', users: 500 },
  { month: 'Jun', users: 700 },
]

const pieChartData = [
  { name: 'Chrome', value: 400, fill: 'var(--color-chrome)' },
  { name: 'Safari', value: 300, fill: 'var(--color-safari)' },
  { name: 'Firefox', value: 200, fill: 'var(--color-firefox)' },
  { name: 'Edge', value: 100, fill: 'var(--color-edge)' },
]

const radialChartData = [
  { name: 'Desktop', value: 75, fill: 'var(--color-desktop)' },
  { name: 'Mobile', value: 60, fill: 'var(--color-mobile)' },
  { name: 'Tablet', value: 45, fill: 'var(--color-tablet)' },
]

const barChartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--av-primary))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--av-info))',
  },
}

const lineChartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--av-success))',
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--av-destructive))',
  },
}

const areaChartConfig = {
  users: {
    label: 'Users',
    color: 'hsl(var(--av-primary))',
  },
}

const pieChartConfig = {
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--av-primary))',
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--av-info))',
  },
  firefox: {
    label: 'Firefox',
    color: 'hsl(var(--av-warning))',
  },
  edge: {
    label: 'Edge',
    color: 'hsl(var(--av-success))',
  },
}

const radialChartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--av-primary))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--av-info))',
  },
  tablet: {
    label: 'Tablet',
    color: 'hsl(var(--av-warning))',
  },
}

export const ChartsShowcase: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold my-2">Charts Showcase</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Interactive charts using Recharts library with theme-aware colors
        </p>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Bar Chart</CardTitle>
            <CardDescription>Monthly desktop vs mobile users</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Line Chart</CardTitle>
            <CardDescription>Revenue vs expenses over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={lineChartConfig}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="var(--color-expenses)"
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Area Chart</CardTitle>
            <CardDescription>User growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={areaChartConfig}>
              <AreaChart data={areaChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="var(--color-users)"
                  fill="var(--color-users)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pie Chart</CardTitle>
            <CardDescription>Browser market share</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieChartConfig}>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Radial Bar Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Radial Bar Chart</CardTitle>
            <CardDescription>Device usage percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={radialChartConfig}
              className="mx-auto max-w-md"
            >
              <RadialBarChart
                data={radialChartData}
                innerRadius="10%"
                outerRadius="80%"
                barSize={10}
                startAngle={90}
                endAngle={-270}
              >
                <ChartTooltip content={<ChartTooltipContent />} />
                <RadialBar dataKey="value" background cornerRadius={10} />
                <ChartLegend content={<ChartLegendContent />} />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stacked Bar Chart</CardTitle>
          <CardDescription>Combined desktop and mobile metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barChartConfig}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="desktop"
                stackId="a"
                fill="var(--color-desktop)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="mobile"
                stackId="a"
                fill="var(--color-mobile)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
