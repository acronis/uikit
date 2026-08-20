// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader, SectionContent } from '../section';
import { Section } from '../section';

const meta = {
  title: 'UI/Section/All States (generated)',
  component: Section,
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ['column1', 'column2-70-30', 'grid3', 'table'] as const;

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
        <Section key={v} variant={v}>
          <SectionHeader
            title="Section title"
            description="Supporting description text."
            hasDescription
          />
          <SectionContent>
            <div className="rounded-md bg-[var(--ui-background-surface-secondary)] px-3 py-2 text-sm">
              Card A
            </div>
            <div className="rounded-md bg-[var(--ui-background-surface-secondary)] px-3 py-2 text-sm">
              Card B
            </div>
            <div className="rounded-md bg-[var(--ui-background-surface-secondary)] px-3 py-2 text-sm">
              Card C
            </div>
          </SectionContent>
        </Section>
      ))}
    </div>
  ),
};
