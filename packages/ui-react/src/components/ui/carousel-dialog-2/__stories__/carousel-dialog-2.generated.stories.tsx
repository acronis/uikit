// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { CarouselDialog2 } from '../carousel-dialog-2';

const meta = {
  title: 'UI/CarouselDialog2/All States (generated)',
  component: CarouselDialog2,
} satisfies Meta<typeof CarouselDialog2>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ['first', 'middle', 'last'] as const;

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {VARIANTS.map((v) => <CarouselDialog2 slideCount={3} selectedIndex={0} key={v} variant={v} />)}
    </div>
  ),
};
