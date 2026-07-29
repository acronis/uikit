// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialogFooterCarousel } from '../dialog-footer-carousel';

const meta = {
  title: 'UI/DialogFooterCarousel/All States (generated)',
  component: DialogFooterCarousel,
} satisfies Meta<typeof DialogFooterCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ['start', 'middle', 'end'] as const;

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {VARIANTS.map((v) => <DialogFooterCarousel slideCount={3} selectedIndex={0} key={v} variant={v} />)}
    </div>
  ),
};
