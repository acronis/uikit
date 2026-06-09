// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from '../tag';

const meta = {
  title: 'UI/Tag/All States (generated)',
  component: Tag,
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ['info', 'success', 'warning', 'critical', 'danger', 'neutral'] as const;
const SIZES = ['default', 'sm'] as const;

export const Matrix: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${SIZES.length + 1}, max-content)`,
        gap: 12,
        alignItems: 'center',
      }}
    >
      <span />
      {SIZES.map((s) => (
        <span key={s} style={{ fontSize: 12, opacity: 0.6 }}>
          {s}
        </span>
      ))}
      {VARIANTS.flatMap((v) => [
        <span key={`${v}-label`} style={{ fontSize: 12, opacity: 0.6 }}>
          {v}
        </span>,
        ...SIZES.map((s) => <Tag key={`${v}-${s}`} variant={v} size={s}>Label</Tag>),
      ])}
    </div>
  ),
};
