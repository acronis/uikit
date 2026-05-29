import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '../chart'

const meta = {
  title: 'UI/Chart',
  component: ChartContainer,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ChartContainer>

export default meta
type Story = StoryObj<typeof meta>

const barData = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
]

const barConfig = {
  desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' },
  mobile: { label: 'Mobile', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig

export const Bar_: Story = {
  args: {} as React.ComponentProps<typeof ChartContainer>,
  render: () => (
    <ChartContainer config={barConfig} className="h-[300px] w-[500px]">
      <BarChart data={barData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} isAnimationActive={false} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  ),
}

export const Line_: Story = {
  args: {} as React.ComponentProps<typeof ChartContainer>,
  render: () => (
    <ChartContainer config={barConfig} className="h-[300px] w-[500px]">
      <LineChart data={barData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line type="monotone" dataKey="desktop" stroke="var(--color-desktop)" strokeWidth={2} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="mobile" stroke="var(--color-mobile)" strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ChartContainer>
  ),
}

export const Area_: Story = {
  args: {} as React.ComponentProps<typeof ChartContainer>,
  render: () => (
    <ChartContainer config={barConfig} className="h-[300px] w-[500px]">
      <AreaChart data={barData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area type="monotone" dataKey="desktop" stroke="var(--color-desktop)" fill="var(--color-desktop)" fillOpacity={0.2} strokeWidth={2} isAnimationActive={false} />
        <Area type="monotone" dataKey="mobile" stroke="var(--color-mobile)" fill="var(--color-mobile)" fillOpacity={0.2} strokeWidth={2} isAnimationActive={false} />
      </AreaChart>
    </ChartContainer>
  ),
}

const pieData = [
  { name: 'Chrome', value: 400 },
  { name: 'Firefox', value: 300 },
  { name: 'Safari', value: 200 },
  { name: 'Edge', value: 100 },
]

const pieConfig = {
  Chrome: { label: 'Chrome', color: 'var(--av-chart-blue)' },
  Firefox: { label: 'Firefox', color: 'var(--av-chart-red)' },
  Safari: { label: 'Safari', color: 'var(--av-chart-yellow)' },
  Edge: { label: 'Edge', color: 'var(--av-chart-green)' },
} satisfies ChartConfig;

export const Pie_: Story = {
  args: {} as React.ComponentProps<typeof ChartContainer>,
  render: () => (
    <ChartContainer config={pieConfig} className="h-[300px] w-[400px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          isAnimationActive={false}
        >
          {pieData.map((entry) => (
            <Cell key={entry.name} fill={`var(--color-${entry.name})`} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  ),
};

const stackedData = [
  { month: 'Jan', desktop: 186, mobile: 80, tablet: 40 },
  { month: 'Feb', desktop: 305, mobile: 200, tablet: 90 },
  { month: 'Mar', desktop: 237, mobile: 120, tablet: 60 },
  { month: 'Apr', desktop: 73, mobile: 190, tablet: 30 },
  { month: 'May', desktop: 209, mobile: 130, tablet: 70 },
  { month: 'Jun', desktop: 214, mobile: 140, tablet: 80 },
]

const stackedConfig = {
  desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' },
  mobile: { label: 'Mobile', color: 'hsl(var(--chart-2))' },
  tablet: { label: 'Tablet', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig

export const StackedBar: Story = {
  args: {} as React.ComponentProps<typeof ChartContainer>,
  render: () => (
    <ChartContainer config={stackedConfig} className="h-[300px] w-[500px]">
      <BarChart data={stackedData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" stackId="a" fill="var(--color-desktop)" isAnimationActive={false} />
        <Bar dataKey="mobile" stackId="a" fill="var(--color-mobile)" isAnimationActive={false} />
        <Bar dataKey="tablet" stackId="a" fill="var(--color-tablet)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  ),
}
