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

export const Carousel: Story = {
  render: () => (
    <DialogWelcome open aria-label="Welcome tour">
      {slides(3)}
    </DialogWelcome>
  ),
};

// With only 2 slides, the footer never reaches its "middle" state — the very
// first navigation already lands on the last slide (Back appears, Next is
// replaced by Close). Mirrors CarouselDialog's own TwoSlides story.
export const CarouselTwoSlides: Story = {
  render: () => (
    <DialogWelcome open aria-label="Welcome tour">
      {slides(2)}
    </DialogWelcome>
  ),
};

// The enforced maximum (5 slides), seeded at the last slide: Back shown, a
// 5-dot indicator with the last dot active, Close in place of Next.
export const CarouselLastSlide: Story = {
  render: () => (
    <DialogWelcome open aria-label="Welcome tour" opts={{ startIndex: 4 }}>
      {slides(5)}
    </DialogWelcome>
  ),
};
