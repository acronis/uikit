'use client';

import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from '@acronis-platform/ui-react';

export function SectionDemo() {
  return (
    <div style={{ width: 480 }}>
      <Section>
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
    </div>
  );
}
