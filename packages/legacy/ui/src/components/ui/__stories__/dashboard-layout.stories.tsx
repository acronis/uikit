import type { Meta, StoryObj } from '@storybook/react-vite'
import { DashboardLayout, DashboardGrid } from '../dashboard-layout'

const meta = {
  title: 'UI/DashboardLayout',
  component: DashboardLayout,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof DashboardLayout>

export default meta
type Story = StoryObj<typeof meta>

const Card = ({ label }: { label: string }) => (
  <div className="rounded-lg border bg-card p-4 text-sm font-medium">{label}</div>
)

export const TwoColumns: Story = {
  render: () => (
    <DashboardLayout>
      <DashboardGrid cols={2}>
        {Array.from({ length: 4 }, (_, i) => <Card key={i} label={`Widget ${i + 1}`} />)}
      </DashboardGrid>
    </DashboardLayout>
  ),
}

export const ThreeColumns: Story = {
  render: () => (
    <DashboardLayout>
      <DashboardGrid cols={3}>
        {Array.from({ length: 6 }, (_, i) => <Card key={i} label={`Widget ${i + 1}`} />)}
      </DashboardGrid>
    </DashboardLayout>
  ),
}

export const FourColumns: Story = {
  render: () => (
    <DashboardLayout>
      <DashboardGrid cols={4}>
        {Array.from({ length: 8 }, (_, i) => <Card key={i} label={`Widget ${i + 1}`} />)}
      </DashboardGrid>
    </DashboardLayout>
  ),
}

export const MultipleRows: Story = {
  render: () => (
    <DashboardLayout>
      <DashboardGrid cols={3}>
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i} label={`Top Widget ${i + 1}`} />
        ))}
      </DashboardGrid>
      <DashboardGrid cols={4}>
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i} label={`Bottom Widget ${i + 1}`} />
        ))}
      </DashboardGrid>
    </DashboardLayout>
  ),
}
