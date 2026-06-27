import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from '../section';

const meta = {
  title: 'UI/Section',
  component: Section,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Section className="w-[480px]">
      <SectionHeader>
        <SectionTitle>Backup plans</SectionTitle>
        <SectionDescription>
          Manage how your workloads are backed up and retained.
        </SectionDescription>
      </SectionHeader>
      <SectionContent>
        <div className="rounded-md bg-[var(--ui-background-surface-secondary)] px-4 py-6 text-sm">
          Section content
        </div>
      </SectionContent>
    </Section>
  ),
};
