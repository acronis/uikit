import type { Meta, StoryObj } from '@storybook/react-vite';

import { Carousel, CarouselContent, CarouselItem } from '../../carousel';
import { DialogContent, DialogRoot } from '../../dialog';
import { DialogFooterCarousel } from '../dialog-footer-carousel';

// Rendered inside a real <Carousel> with `opts.startIndex` seeding the slide —
// in an actual browser (Storybook/VR), Embla measures real box metrics, so
// canScrollPrev/canScrollNext (and therefore the footer's first/middle/last
// state) come out correctly, unlike jsdom/happy-dom in Vitest (see the test
// file for why that environment needs a mocked useCarousel() instead).
//
// Also wrapped in `DialogRoot`/`DialogContent` — Dialog's own headerless
// primitive parts, never the `Dialog` recipe (which would render its own
// header and default Cancel/Label footer around this footer bar). The
// last-state Close control composes with `DialogClose`, which needs that
// Dialog context. `DialogContent` carries an `aria-label` because this
// primitive-only composition has no `DialogTitle` to name it.
function FooterAtIndex({ startIndex }: { startIndex: number }) {
  return (
    <DialogRoot open>
      <DialogContent aria-label="Carousel dialog">
        <Carousel
          opts={{ startIndex }}
          className="w-full border border-border"
        >
          <CarouselContent>
            <CarouselItem className="flex h-40 items-center justify-center">
              Slide 1
            </CarouselItem>
            <CarouselItem className="flex h-40 items-center justify-center">
              Slide 2
            </CarouselItem>
            <CarouselItem className="flex h-40 items-center justify-center">
              Slide 3
            </CarouselItem>
          </CarouselContent>
          <DialogFooterCarousel />
        </Carousel>
      </DialogContent>
    </DialogRoot>
  );
}

// A single-slide dialog: canScrollPrev/canScrollNext are both false, which
// getFooterState special-cases to 'last' so Close renders (see its own
// comment) instead of leaving no reachable way to close the dialog. The dot
// indicator correctly renders exactly 1 dot (one per real slide), not a
// fixed count.
function SingleSlideFooter() {
  return (
    <DialogRoot open>
      <DialogContent aria-label="Carousel dialog">
        <Carousel className="w-full border border-border">
          <CarouselContent>
            <CarouselItem className="flex h-40 items-center justify-center">
              Only slide
            </CarouselItem>
          </CarouselContent>
          <DialogFooterCarousel />
        </Carousel>
      </DialogContent>
    </DialogRoot>
  );
}

const meta = {
  title: 'UI/DialogFooterCarousel',
  component: DialogFooterCarousel,
  // Every story here mounts a real <Carousel> inside an animating Dialog
  // (data-[open]:animate-in zoom/fade) — the dialog's own resize as it scales
  // in can retrigger Embla's layout measurement mid-transition, so the VR
  // capture must wait for both to settle instead of racing a mid-scroll
  // frame (same `animationDelay` convention as tooltip/select's own popup
  // stories).
  parameters: { layout: 'centered', snapshot: { animationDelay: 400 } },
  tags: ['autodocs'],
} satisfies Meta<typeof DialogFooterCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const First: Story = {
  render: () => <FooterAtIndex startIndex={0} />,
};

export const Last: Story = {
  render: () => <FooterAtIndex startIndex={2} />,
};

export const SingleSlide: Story = {
  render: () => <SingleSlideFooter />,
};
