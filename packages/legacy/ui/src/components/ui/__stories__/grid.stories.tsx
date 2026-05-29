import type { Meta, StoryObj } from '@storybook/react-vite'
import { Grid } from '../grid'

const meta = {
  title: 'UI/Grid',
  component: Grid,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Grid>

export default meta
type Story = StoryObj<typeof meta>

const Cell = ({ label }: { label: string }) => (
  <div className="flex h-16 items-center justify-center rounded-md bg-muted text-sm font-medium">
    {label}
  </div>
)

export const TwoColumns: Story = {
  render: () => (
    <Grid cols={2} className="w-[400px]">
      {Array.from({ length: 4 }, (_, i) => <Cell key={i} label={`Cell ${i + 1}`} />)}
    </Grid>
  ),
}

export const ThreeColumns: Story = {
  render: () => (
    <Grid cols={3} className="w-[500px]">
      {Array.from({ length: 6 }, (_, i) => <Cell key={i} label={`Cell ${i + 1}`} />)}
    </Grid>
  ),
}

export const FourColumns: Story = {
  render: () => (
    <Grid cols={4} className="w-[600px]">
      {Array.from({ length: 8 }, (_, i) => <Cell key={i} label={`Cell ${i + 1}`} />)}
    </Grid>
  ),
}

export const GapSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-[500px]">
      <div>
        <p className="text-xs text-muted-foreground mb-2">gap: sm</p>
        <Grid cols={3} gap="sm">
          {Array.from({ length: 3 }, (_, i) => <Cell key={i} label={`${i + 1}`} />)}
        </Grid>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">gap: md</p>
        <Grid cols={3} gap="md">
          {Array.from({ length: 3 }, (_, i) => <Cell key={i} label={`${i + 1}`} />)}
        </Grid>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">gap: lg</p>
        <Grid cols={3} gap="lg">
          {Array.from({ length: 3 }, (_, i) => <Cell key={i} label={`${i + 1}`} />)}
        </Grid>
      </div>
    </div>
  ),
}
