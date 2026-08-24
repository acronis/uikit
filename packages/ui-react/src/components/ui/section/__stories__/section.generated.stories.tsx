// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader, SectionContent } from '../section';
import { Card, CardHeader, CardContent } from '../../card';
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
            title="Protection"
            description="3 plans applied to 24 workloads."
            hasDescription
          />
          <SectionContent
            secondaryContent={
              <Card>
                <CardHeader title="Quota" />
                <CardContent className="pt-4">1.2 TB of 2 TB used.</CardContent>
              </Card>
            }
          >
            <Card>
              <CardHeader title="Backup" />
              <CardContent className="pt-4">Nightly at 02:00.</CardContent>
            </Card>
            <Card>
              <CardHeader title="Replication" />
              <CardContent className="pt-4">Every 4 hours.</CardContent>
            </Card>
            <Card>
              <CardHeader title="Archive" />
              <CardContent className="pt-4">
                Monthly to cold storage.
              </CardContent>
            </Card>
          </SectionContent>
        </Section>
      ))}
    </div>
  ),
};
