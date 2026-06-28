// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from '../scroll-area';

const meta = {
  title: 'UI/ScrollArea/All States (generated)',
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <ScrollArea className="h-48 w-64 rounded-md border border-border [&_[data-slot=scroll-area-scrollbar]]:opacity-100">
        <div className="flex flex-col gap-2 p-4">
          {Array.from({ length: 16 }, (_, i) => (
            <div
              key={i}
              className="rounded-md bg-[var(--ui-background-surface-secondary)] px-3 py-2 text-sm"
            >
              Item {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};
