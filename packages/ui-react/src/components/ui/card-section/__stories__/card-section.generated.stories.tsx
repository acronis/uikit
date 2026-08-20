// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardSection } from '../card-section';

const meta = {
  title: 'UI/CardSection/All States (generated)',
  component: CardSection,
} satisfies Meta<typeof CardSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = [
  'slot',
  'tag',
  'list',
  'table-actions',
  'card-primary',
  'card-secondary',
] as const;

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
        <CardSection
          content="Arbitrary section content."
          contentList={
            <div className="py-2 text-sm leading-6">Title — Description</div>
          }
          contentTable={
            <div className="px-4 py-2 text-sm leading-6">Table row</div>
          }
          key={v}
          variant={v}
        />
      ))}
    </div>
  ),
};
