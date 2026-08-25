'use client';

import {
  Card,
  CardContent,
  CardHeader,
  Section,
  SectionContent,
  SectionHeader,
} from '@acronis-platform/ui-react';

function DemoCard({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent className="pt-4">
        <p className="text-sm">{body}</p>
      </CardContent>
    </Card>
  );
}

export function SectionDemo() {
  return (
    <div style={{ width: 720 }}>
      <Section hasBottomBorder>
        <SectionHeader
          title="General"
          description="Region, tenant, and naming."
          hasDescription
        />
        <SectionContent>
          <DemoCard title="Region" body="Frankfurt (eu-central-1)." />
        </SectionContent>
      </Section>
      <Section variant="grid3">
        <SectionHeader title="Protection" />
        <SectionContent>
          <DemoCard title="Backup" body="Nightly at 02:00." />
          <DemoCard title="Replication" body="Every 4 hours." />
          <DemoCard title="Archive" body="Monthly to cold storage." />
        </SectionContent>
      </Section>
    </div>
  );
}
