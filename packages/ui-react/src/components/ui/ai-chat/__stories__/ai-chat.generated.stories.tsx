// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { AiChat } from '../ai-chat';

const meta = {
  title: 'UI/AiChat/All States (generated)',
  component: AiChat,
} satisfies Meta<typeof AiChat>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ['collapsed', 'expanded', 'full-width'] as const;

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {VARIANTS.map((v) => <AiChat key={v} variant={v} />)}
    </div>
  ),
};
