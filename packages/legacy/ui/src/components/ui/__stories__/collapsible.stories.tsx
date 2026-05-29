import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronUpdownIcon } from '@/components/icons'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../collapsible'
import { Button } from '../button'

const meta = {
  title: 'UI/Collapsible',
  component: Collapsible,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Collapsible className="w-[350px] space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">3 repositories starred</h4>
        <CollapsibleTrigger
          render={
            <Button variant="ghost" size="icon">
              <ChevronUpdownIcon className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          }
        />
      </div>
      <div className="rounded-md border px-4 py-3 text-sm">@radix-ui/primitives</div>
      <CollapsibleContent>
        <div className="space-y-2">
          <div className="rounded-md border px-4 py-3 text-sm">@radix-ui/colors</div>
          <div className="rounded-md border px-4 py-3 text-sm">@stitches/react</div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
}

export const Open: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-[350px] space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">3 repositories starred</h4>
        <CollapsibleTrigger
          render={
            <Button variant="ghost" size="icon">
              <ChevronUpdownIcon className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          }
        />
      </div>
      <div className="rounded-md border px-4 py-3 text-sm">@radix-ui/primitives</div>
      <CollapsibleContent>
        <div className="space-y-2">
          <div className="rounded-md border px-4 py-3 text-sm">@radix-ui/colors</div>
          <div className="rounded-md border px-4 py-3 text-sm">@stitches/react</div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
}
