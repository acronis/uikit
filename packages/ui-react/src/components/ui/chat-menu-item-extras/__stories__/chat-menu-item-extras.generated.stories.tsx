// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatMenuItemExtras } from '../chat-menu-item-extras';

const meta = {
  title: 'UI/ChatMenuItemExtras/All States (generated)',
  component: ChatMenuItemExtras,
} satisfies Meta<typeof ChatMenuItemExtras>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ['tag', 'shortcut'] as const;

export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
      }}
    >
      {VARIANTS.map((v) => (
        <ChatMenuItemExtras
          labelTag="Label"
          labelShortcut="⌘H"
          key={v}
          variant={v}
        />
      ))}
    </div>
  ),
};
