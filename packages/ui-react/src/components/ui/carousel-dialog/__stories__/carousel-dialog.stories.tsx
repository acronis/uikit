import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { CarouselDialog } from '../carousel-dialog';

const VARIANTS = ['first', 'middle', 'last'] as const;

const meta = {
  title: 'UI/CarouselDialog',
  component: CarouselDialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
      description:
        'Which slide position this renders for — hides `Back` on `first`, and swaps `Next` for the call-to-action label on `last`.',
      table: {
        type: { summary: VARIANTS.map((v) => `'${v}'`).join(' | ') },
        defaultValue: { summary: "'first'" },
        category: 'Appearance',
      },
    },
    slideCount: {
      control: 'number',
      description: 'Total number of slides, used to render the dot `ListIndicator`.',
      table: { type: { summary: 'number' }, category: 'Content' },
    },
    selectedIndex: {
      control: 'number',
      description: 'The currently active slide index (0-based).',
      table: { type: { summary: 'number' }, category: 'State' },
    },
    backLabel: {
      control: 'text',
      description: '`Back` button label.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Back'" },
        category: 'Content',
      },
    },
    nextLabel: {
      control: 'text',
      description: '`Next` button label (`variant="first" | "middle"`).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Next'" },
        category: 'Content',
      },
    },
    primaryLabel: {
      control: 'text',
      description: 'Call-to-action button label (`variant="last"`).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Call to action'" },
        category: 'Content',
      },
    },
    goToSlideLabel: {
      control: false,
      description: "Builds each dot's accessible name from its index and the slide count.",
      table: {
        type: { summary: '(index: number, count: number) => string' },
        category: 'Content',
      },
    },
    onSelectIndex: {
      control: false,
      description: 'Fires when a dot is activated, with its slide index.',
      table: { type: { summary: '(index: number) => void' }, category: 'Events' },
    },
    onBack: {
      control: false,
      description: 'Fires when `Back` is activated.',
      table: { type: { summary: '() => void' }, category: 'Events' },
    },
    onNext: {
      control: false,
      description: 'Fires when `Next` is activated.',
      table: { type: { summary: '() => void' }, category: 'Events' },
    },
    onPrimaryAction: {
      control: false,
      description: 'Fires when the call-to-action button is activated.',
      table: { type: { summary: '() => void' }, category: 'Events' },
    },
  },
  args: { slideCount: 3, selectedIndex: 0 },
  decorators: [
    (Story) => (
      <div className="w-[512px] rounded-[var(--ui-dialog-container-border-radius)] bg-[var(--ui-dialog-container-color)] p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CarouselDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const First: Story = {
  render: () => <CarouselDialog variant="first" slideCount={3} selectedIndex={0} />,
};

export const Middle: Story = {
  render: () => <CarouselDialog variant="middle" slideCount={3} selectedIndex={1} />,
};

export const Last: Story = {
  render: () => <CarouselDialog variant="last" slideCount={3} selectedIndex={2} />,
};

export const Interactive: Story = {
  render: function InteractiveCarouselDialog() {
    const slideCount = 4;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const variant =
      selectedIndex === 0 ? 'first' : selectedIndex === slideCount - 1 ? 'last' : 'middle';
    return (
      <CarouselDialog
        variant={variant}
        slideCount={slideCount}
        selectedIndex={selectedIndex}
        onSelectIndex={setSelectedIndex}
        onBack={() => setSelectedIndex((i) => Math.max(i - 1, 0))}
        onNext={() => setSelectedIndex((i) => Math.min(i + 1, slideCount - 1))}
        onPrimaryAction={() => setSelectedIndex(0)}
      />
    );
  },
};
