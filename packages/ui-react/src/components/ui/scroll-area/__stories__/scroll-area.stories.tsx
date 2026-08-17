import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ScrollArea } from '../scroll-area';

const meta = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'both'],
      description: 'Which scrollbar(s) to render.',
      table: { type: { summary: "'vertical' | 'horizontal' | 'both'" } },
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const Rows = () => (
  <div className="flex flex-col gap-2 p-4">
    {Array.from({ length: 24 }, (_, i) => (
      <div
        key={i}
        className="rounded-md bg-[var(--ui-background-surface-secondary)] px-3 py-2 text-sm"
      >
        Item {i + 1}
      </div>
    ))}
  </div>
);

// args drive the Controls panel; render spreads them so changing a control
// re-renders the ScrollArea.
export const Default: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <ScrollArea
      {...args}
      className="h-64 w-72 rounded-md border border-border"
    >
      <Rows />
    </ScrollArea>
  ),
};

// The bar is hidden at rest and revealed on hover/scroll. This variant forces it
// visible so the thumb styling is captured in the visual baseline.
export const AlwaysVisible: Story = {
  render: () => (
    <ScrollArea className="h-64 w-72 rounded-md border border-border [&_[data-slot=scroll-area-scrollbar]]:opacity-100">
      <Rows />
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea
      orientation="horizontal"
      className="w-80 rounded-md border border-border [&_[data-slot=scroll-area-scrollbar]]:opacity-100"
    >
      <div className="flex w-max gap-3 p-4">
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={i}
            className="flex size-24 shrink-0 items-center justify-center rounded-md bg-[var(--ui-background-surface-secondary)] text-sm"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Both: Story = {
  render: () => (
    <ScrollArea
      orientation="both"
      className="h-64 w-80 rounded-md border border-border [&_[data-slot=scroll-area-scrollbar]]:opacity-100"
    >
      <div className="grid w-max grid-cols-8 gap-3 p-4">
        {Array.from({ length: 64 }, (_, i) => (
          <div
            key={i}
            className="flex size-16 shrink-0 items-center justify-center rounded-md bg-[var(--ui-background-surface-secondary)] text-sm"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

/** `viewportRef` reaches the element that actually scrolls — needed by virtualizers, `IntersectionObserver`, and programmatic `scrollTo`. The root is `overflow: hidden` and always reports `scrollTop: 0`. */
export const WithViewportRef: Story = {
  render: () => {
    const viewportRef = React.useRef<HTMLDivElement>(null);
    return (
      <div className="flex flex-col gap-3">
        <ScrollArea
          viewportRef={viewportRef}
          className="h-40 w-72 rounded-md border border-border"
        >
          <Rows />
        </ScrollArea>
        <button
          className="self-start text-sm underline"
          onClick={() => viewportRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Scroll to top via viewportRef
        </button>
      </div>
    );
  },
};
