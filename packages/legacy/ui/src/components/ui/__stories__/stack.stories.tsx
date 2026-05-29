import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '../stack'

const meta = {
  title: 'UI/Stack',
  component: Stack,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

const Box = ({ label }: { label: string }) => (
  <div className="flex h-10 w-20 items-center justify-center rounded-md bg-muted text-sm font-medium">
    {label}
  </div>
)

export const Vertical: Story = {
  render: () => (
    <Stack>
      <Box label="Item 1" />
      <Box label="Item 2" />
      <Box label="Item 3" />
    </Stack>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <Stack direction="horizontal" gap="md" align="center">
      <Box label="Item 1" />
      <Box label="Item 2" />
      <Box label="Item 3" />
    </Stack>
  ),
}

export const Gaps: Story = {
  render: () => (
    <Stack gap="lg">
      <Stack direction="horizontal" gap="xs" align="center">
        <span className="w-8 text-xs text-muted-foreground">xs</span>
        <Box label="A" />
        <Box label="B" />
        <Box label="C" />
      </Stack>
      <Stack direction="horizontal" gap="sm" align="center">
        <span className="w-8 text-xs text-muted-foreground">sm</span>
        <Box label="A" />
        <Box label="B" />
        <Box label="C" />
      </Stack>
      <Stack direction="horizontal" gap="md" align="center">
        <span className="w-8 text-xs text-muted-foreground">md</span>
        <Box label="A" />
        <Box label="B" />
        <Box label="C" />
      </Stack>
      <Stack direction="horizontal" gap="lg" align="center">
        <span className="w-8 text-xs text-muted-foreground">lg</span>
        <Box label="A" />
        <Box label="B" />
        <Box label="C" />
      </Stack>
      <Stack direction="horizontal" gap="xl" align="center">
        <span className="w-8 text-xs text-muted-foreground">xl</span>
        <Box label="A" />
        <Box label="B" />
        <Box label="C" />
      </Stack>
    </Stack>
  ),
}

export const JustifyBetween: Story = {
  render: () => (
    <Stack direction="horizontal" justify="between" align="center" className="w-[400px] border rounded-md p-4">
      <Box label="Left" />
      <Box label="Right" />
    </Stack>
  ),
}

export const Wrap: Story = {
  render: () => (
    <Stack direction="horizontal" wrap gap="sm" className="w-[250px]">
      {Array.from({ length: 8 }, (_, i) => (
        <Box key={i} label={`${i + 1}`} />
      ))}
    </Stack>
  ),
}
