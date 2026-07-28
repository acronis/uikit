import type { Meta, StoryObj } from '@storybook/react-vite';
import { RectangleImageIcon } from '@acronis-platform/icons-react/stroke-mono';

import { DialogWelcome, type DialogWelcomeProps } from '../dialog-welcome';
import { DialogWelcomeSlide } from '../dialog-welcome';

const meta = {
  title: 'UI/DialogWelcome',
  component: DialogWelcome,
  // See CarouselDialog's own story meta for why `inline: false` — autodocs
  // mounts the primary story twice on one Docs page, and two simultaneously
  // open Dialogs fight over Base UI's modal manager.
  parameters: {
    layout: 'centered',
    docs: { story: { inline: false, height: '600px' } },
  },
  tags: ['autodocs'],
  // `children` is required (one `<DialogWelcomeSlide>` per slide); the
  // stories drive it via `render`, so satisfy the args type with an empty cast.
  args: {} as DialogWelcomeProps,
  argTypes: {
    children: {
      control: false,
      description:
        'One `<DialogWelcomeSlide>` per slide. Exactly one renders the `single` layout (CTA + Close); 2–5 render the `carousel` layout.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    variant: {
      control: 'select',
      options: ['carousel', 'single'],
      description:
        'Forces the `single`/`carousel` layout instead of deriving it from slide count. Optional — omit to auto-detect from `children`.',
      table: { type: { summary: "'carousel' | 'single'" }, category: 'Appearance' },
    },
    primaryLabel: {
      control: 'text',
      description: "The `single` layout's call-to-action button label.",
      table: { type: { summary: 'string' }, category: 'Content', defaultValue: { summary: 'Call to action' } },
    },
    onPrimaryAction: {
      control: false,
      description: "Fires when the `single` layout's CTA button is clicked.",
      table: { type: { summary: '() => void' }, category: 'Events' },
    },
    closeLabel: {
      control: 'text',
      description: 'The close control label, both layouts.',
      table: { type: { summary: 'string' }, category: 'Content', defaultValue: { summary: 'Close' } },
    },
    positionLabel: {
      control: 'text',
      description: "The `carousel` layout's position indicator accessible name.",
      table: { type: { summary: 'string' }, category: 'Content', defaultValue: { summary: 'Slide position' } },
    },
    backLabel: {
      control: 'text',
      description: "The `carousel` layout's Back button label.",
      table: { type: { summary: 'string' }, category: 'Content', defaultValue: { summary: 'Back' } },
    },
    nextLabel: {
      control: 'text',
      description: "The `carousel` layout's Next button label.",
      table: { type: { summary: 'string' }, category: 'Content', defaultValue: { summary: 'Next' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'large'],
      description: 'Popup max-width, forwarded to `DialogContent`.',
      table: { type: { summary: "'sm' | 'large'" }, category: 'Appearance', defaultValue: { summary: 'sm' } },
    },
  },
} satisfies Meta<typeof DialogWelcome>;

export default meta;
type Story = StoryObj<typeof meta>;

function placeholderImage() {
  return (
    <div className="flex size-full items-center justify-center">
      <RectangleImageIcon size={32} className="text-[var(--ui-glyph-on-surface-primary)]" />
    </div>
  );
}

function slides(count: number) {
  return Array.from({ length: count }, (_, index) => (
    <DialogWelcomeSlide
      key={index}
      image={placeholderImage()}
      title={`Feature ${index + 1}`}
      description="A short description of what this feature does and why it matters."
    />
  ));
}

export const Single: Story = {
  render: () => (
    <DialogWelcome open aria-label="Welcome">
      {slides(1)}
    </DialogWelcome>
  ),
};

// `animationDelay` (all three carousel-layout stories below): each mounts a
// real <Carousel> inside this Dialog's own animate-in zoom/fade — the
// dialog's resize as it scales in can retrigger Embla's layout measurement
// mid-transition, so the VR capture must wait for both to settle instead of
// racing a mid-scroll frame. `Single` has no Carousel, so it isn't exposed to
// this and doesn't need the delay.
// VR-flaky even with `animationDelay`: this is the only carousel-layout
// story seeded at the default (first) slide, and CI keeps landing on a
// diffuse ~1.5-2% pixel diff unrelated to any code change — the same Docker
// container rendering nondeterminism already worked around by deleting
// DialogFooterCarousel's Middle/TwoSlides/FourSlides stories. Kept here
// (skip: true) rather than deleted since it's the primary carousel-layout
// showcase; CarouselLastSlide/CarouselForcedSingleSlide still exercise the
// same layout deterministically.
export const Carousel: Story = {
  parameters: { snapshot: { skip: true } },
  render: () => (
    <DialogWelcome open aria-label="Welcome tour">
      {slides(3)}
    </DialogWelcome>
  ),
};

// The enforced maximum (5 slides), seeded at the last slide: Back shown, a
// 5-dot indicator with the last dot active, Close in place of Next.
export const CarouselLastSlide: Story = {
  parameters: { snapshot: { animationDelay: 400 } },
  render: () => (
    <DialogWelcome open aria-label="Welcome tour" opts={{ startIndex: 4 }}>
      {slides(5)}
    </DialogWelcome>
  ),
};

// `variant="carousel"` forces the carousel chrome (footer + position dot)
// for a single slide, instead of auto-detecting the `single` layout from
// slide count — matching Figma's own `variant` component property. The
// single-slide carousel resolves to DialogFooterCarousel's own 'last' state:
// no Next, Close reachable.
export const CarouselForcedSingleSlide: Story = {
  parameters: { snapshot: { animationDelay: 400 } },
  render: () => (
    <DialogWelcome open aria-label="Welcome" variant="carousel">
      {slides(1)}
    </DialogWelcome>
  ),
};
