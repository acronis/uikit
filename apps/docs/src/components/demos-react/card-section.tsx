'use client';

import {
  ButtonIcon,
  Card,
  CardContent,
  CardHeader,
  CardSection,
  Tag,
} from '@acronis-platform/ui-react';
import { EllipsisIcon } from '@acronis-platform/icons-react/stroke-mono';

const rows: [string, string][] = [
  ['Network', '192.168.0.0/24'],
  ['Gateway', '192.168.0.1'],
  ['DNS', '8.8.8.8'],
];

const ListRows = (
  <>
    {rows.map(([term, value]) => (
      <div
        key={term}
        className="grid min-h-10 grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-6 py-2 text-sm leading-6"
      >
        <span className="text-[var(--ui-text-on-surface-primary)]">{term}</span>
        <span className="truncate text-[var(--ui-text-on-surface-primary)]">
          {value}
        </span>
      </div>
    ))}
  </>
);

const SubnetTable = (
  <table className="w-full text-sm leading-6">
    <thead>
      <tr className="border-b border-[var(--ui-border-on-surface-divider)]">
        <th className="px-4 py-2 text-start font-semibold">Subnet</th>
        <th className="px-4 py-2 text-start font-semibold">Hosts</th>
      </tr>
    </thead>
    <tbody>
      {[
        ['192.160.0.0/24', '25'],
        ['179.20.204.0/24', '87'],
      ].map(([subnet, hosts]) => (
        <tr
          key={subnet}
          className="border-b border-[var(--ui-border-on-surface-divider)] last:border-b-0"
        >
          <td className="px-4 py-2">{subnet}</td>
          <td className="px-4 py-2">{hosts}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export function CardSectionDemo() {
  return (
    <Card className="w-[560px]">
      <CardHeader title="Workload" />
      <CardContent className="p-0 pb-4">
        <CardSection
          variant="list"
          hasHeader
          title="Network details"
          hasBottomBorder
          contentList={ListRows}
        />
        <CardSection
          variant="tag"
          hasHeader
          title="Labels"
          extras={<Tag variant="info">3</Tag>}
          hasBottomBorder
          contentTag={
            <>
              <Tag variant="neutral">Production</Tag>
              <Tag variant="neutral">EU-West</Tag>
              <Tag variant="neutral">Tier 1</Tag>
            </>
          }
        />
        <CardSection
          variant="table-actions"
          hasHeader
          title="Subnets"
          actions={
            <ButtonIcon variant="ghost" aria-label="More">
              <EllipsisIcon size={16} />
            </ButtonIcon>
          }
          contentTable={SubnetTable}
        />
      </CardContent>
    </Card>
  );
}

export function CardSectionNestedCardDemo() {
  return (
    <Card className="w-[560px]">
      <CardHeader title="Backup plan" />
      <CardContent className="p-0 pb-4">
        <CardSection
          variant="card-primary"
          hasHeader
          title="Schedule"
          hasBottomBorder
        >
          <CardHeader title="Daily at 02:00" />
          <CardContent>Runs on every protected workload.</CardContent>
        </CardSection>
        <CardSection variant="card-secondary" hasHeader title="Retention">
          <CardHeader title="30 days" />
          <CardContent>Older recovery points are pruned nightly.</CardContent>
        </CardSection>
      </CardContent>
    </Card>
  );
}
