import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip'
import { Button } from '../button'

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const WithDelay: Story = {
  render: () => (
    <TooltipProvider delay={500}>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Hover me (500ms delay)</Button>} />
        <TooltipContent>
          <p>This tooltip has a 500ms delay</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}
