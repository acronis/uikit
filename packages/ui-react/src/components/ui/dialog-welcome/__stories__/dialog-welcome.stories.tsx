import type { Meta, StoryObj } from '@storybook/react-vite';

import { DialogWelcome } from '../dialog-welcome';

const VARIANTS = ['carousel', 'single'] as const;

const meta = {
  title: 'UI/DialogWelcome',
  component: DialogWelcome,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
      description: 'Selects the Figma-defined layout.',
      table: {
        type: { summary: "'carousel' | 'single'" },
        defaultValue: { summary: "'carousel'" },
        category: 'Appearance',
      },
    },
    slides: {
      control: false,
      description:
        "Slides shown one at a time (`variant=\"carousel\"`), each with an `image`, `title`, and `description`.",
      table: {
        type: { summary: 'Array<{ image?: ReactNode; title: string; description: string }>' },
        category: 'Content',
      },
    },
    selectedIndex: {
      control: 'number',
      description:
        'Controls the active slide (`variant="carousel"`). Uncontrolled when omitted.',
      table: { type: { summary: 'number' }, category: 'State' },
    },
    onSelectedIndexChange: {
      control: false,
      description: 'Fires whenever the active slide changes (`variant="carousel"`).',
      table: { type: { summary: '(index: number) => void' }, category: 'Events' },
    },
    backLabel: {
      control: 'text',
      description: '`Back` button label (`variant="carousel"`).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Back'" },
        category: 'Content',
      },
    },
    nextLabel: {
      control: 'text',
      description: '`Next` button label (`variant="carousel"`).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Next'" },
        category: 'Content',
      },
    },
    goToSlideLabel: {
      control: false,
      description: "Builds each carousel dot's accessible name (`variant=\"carousel\"`).",
      table: {
        type: { summary: '(index: number, count: number) => string' },
        category: 'Content',
      },
    },
    image: {
      control: false,
      description: 'Illustration/media (`variant="single"`).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    title: {
      control: 'text',
      description: '`variant="single"` title.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Title'" },
        category: 'Content',
      },
    },
    description: {
      control: 'text',
      description: '`variant="single"` description.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Feature description.'" },
        category: 'Content',
      },
    },
    closeLabel: {
      control: 'text',
      description: '`Close` link label (`variant="single"`).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Close'" },
        category: 'Content',
      },
    },
    onCloseAction: {
      control: false,
      description:
        'Fires when `Close` (`variant="single"`) is activated, before the dialog closes.',
      table: { type: { summary: '() => void' }, category: 'Events' },
    },
    primaryLabel: {
      control: 'text',
      description: 'Call-to-action button label.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Call to action'" },
        category: 'Content',
      },
    },
    onPrimaryAction: {
      control: false,
      description: 'Fires when the call-to-action button is activated.',
      table: { type: { summary: '() => void' }, category: 'Events' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Open on mount, uncontrolled.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state. Pair with `onOpenChange`.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    onOpenChange: {
      control: false,
      description: 'Fires when the dialog opens or closes.',
      table: { type: { summary: '(open, eventDetails) => void' }, category: 'Events' },
    },
    portal: {
      control: false,
      description: 'Render inside a portal (forwarded to `DialogContent`).',
      table: { type: { summary: 'boolean' }, category: 'Behavior' },
    },
  },
  args: { variant: 'carousel' },
} satisfies Meta<typeof DialogWelcome>;

export default meta;
type Story = StoryObj<typeof meta>;

const FEATURE_SLIDES = [
  {
    title: 'Automated backups',
    description: 'Your data is backed up on a schedule you control.',
  },
  {
    title: 'Instant recovery',
    description: 'Restore a full workload in minutes, not hours.',
  },
  {
    title: 'Built-in protection',
    description: 'Ransomware detection runs on every backup automatically.',
  },
];

export const Carousel: Story = {
  render: () => <DialogWelcome variant="carousel" slides={FEATURE_SLIDES} defaultOpen />,
};

export const CarouselMiddleSlide: Story = {
  render: () => (
    <DialogWelcome
      variant="carousel"
      slides={FEATURE_SLIDES}
      selectedIndex={1}
      defaultOpen
    />
  ),
};

export const CarouselLastSlide: Story = {
  render: () => (
    <DialogWelcome
      variant="carousel"
      slides={FEATURE_SLIDES}
      selectedIndex={2}
      primaryLabel="Get started"
      defaultOpen
    />
  ),
};

export const CarouselWithImages: Story = {
  render: () => (
    <DialogWelcome
      variant="carousel"
      slides={FEATURE_SLIDES.map((slide, index) => ({
        ...slide,
        image: (
          <span className="text-sm text-muted-foreground">
            Slide {index + 1} illustration
          </span>
        ),
      }))}
      defaultOpen
    />
  ),
};

export const Single: Story = {
  render: () => (
    <DialogWelcome
      variant="single"
      title="You're all set"
      description="Your workspace is ready to go."
      primaryLabel="Get started"
      defaultOpen
    />
  ),
};
