import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { DialogFooterCarousel2 } from '../dialog-footer-carousel-2';

const VARIANTS = ['start', 'middle', 'end'] as const;

const meta = {
  title: 'UI/Experimental/DialogFooterCarousel2',
  component: DialogFooterCarousel2,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
      description:
        'Which slide position this renders for — hides `Back` on `start`, and swaps `Next` for the call-to-action label on `end`.',
      table: {
        type: { summary: VARIANTS.map((v) => `'${v}'`).join(' | ') },
        defaultValue: { summary: "'start'" },
        category: 'Appearance',
      },
    },
    slideCount: {
      control: 'number',
      description: 'Total number of slides, used to render the dot indicator.',
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
      description: '`Next` button label (`variant="start" | "middle"`).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Next'" },
        category: 'Content',
      },
    },
    primaryLabel: {
      control: 'text',
      description: 'Call-to-action button label (`variant="end"`).',
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
      <div className="w-[512px] overflow-hidden rounded-[var(--ui-dialog-container-border-radius)] bg-[var(--ui-dialog-container-color)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DialogFooterCarousel2>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Start: Story = {
  render: () => <DialogFooterCarousel2 variant="start" slideCount={3} selectedIndex={0} />,
};

export const Middle: Story = {
  render: () => <DialogFooterCarousel2 variant="middle" slideCount={3} selectedIndex={1} />,
};

export const End: Story = {
  render: () => <DialogFooterCarousel2 variant="end" slideCount={3} selectedIndex={2} />,
};

export const Interactive: Story = {
  render: function InteractiveDialogFooterCarousel2() {
    const slideCount = 4;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const variant =
      selectedIndex === 0 ? 'start' : selectedIndex === slideCount - 1 ? 'end' : 'middle';
    return (
      <DialogFooterCarousel2
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
