import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../carousel';
import { Card, CardContent } from '@/components/ui/card';

// Not part of the public API — `Carousel` (and `CarouselContent`/
// `CarouselPrevious`/`CarouselNext`/`useCarousel`) isn't exported from
// `@acronis-platform/ui-react`'s package entry; only consumed internally by
// `DialogWelcome`'s `carousel` layout. Kept under `Internal/` (not `UI/`) so
// it's still visible here for reference/dev purposes without implying it's a
// supported export.
const meta = {
  title: 'Internal/Carousel',
  component: Carousel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Scroll axis.',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: 'horizontal' },
        category: 'Appearance',
      },
    },
    opts: {
      control: false,
      description:
        'Embla carousel options (loop, align, …). Passed through verbatim.',
      table: { type: { summary: 'EmblaOptionsType' }, category: 'Behavior' },
    },
    plugins: {
      control: false,
      description: 'Embla plugins (autoplay, wheel gestures, …).',
      table: { type: { summary: 'EmblaPluginType[]' }, category: 'Behavior' },
    },
    setApi: {
      control: false,
      description:
        'Receives the underlying Embla API instance once initialized.',
      table: {
        type: { summary: '(api: CarouselApi) => void' },
        category: 'Behavior',
      },
    },
    children: {
      control: false,
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-4xl font-semibold">{index + 1}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const MultipleItems: Story = {
  render: () => (
    <Carousel className="w-full max-w-sm">
      <CarouselContent className="-ml-2 md:-ml-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <CarouselItem key={index} className="pl-2 md:basis-1/2 md:pl-4">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-2xl font-semibold">{index + 1}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Carousel orientation="vertical" className="w-full max-w-xs">
      <CarouselContent className="h-[200px]">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <span className="text-4xl font-semibold">{index + 1}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const Loop: Story = {
  render: () => (
    <Carousel opts={{ loop: true }} className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-4xl font-semibold">{index + 1}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};
