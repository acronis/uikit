import type { Meta, StoryObj } from '@storybook/react-vite'
import { AspectRatio } from '../aspect-ratio'

const meta = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

export const SixteenByNine: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Photo"
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
}

export const Square: Story = {
  render: () => (
    <div className="w-[200px]">
      <AspectRatio ratio={1} className="bg-muted rounded-md overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=400&dpr=2&q=80"
          alt="Photo"
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
}

export const FourByThree: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio ratio={4 / 3} className="bg-muted rounded-md flex items-center justify-center">
        <span className="text-muted-foreground text-sm">4 / 3</span>
      </AspectRatio>
    </div>
  ),
}
