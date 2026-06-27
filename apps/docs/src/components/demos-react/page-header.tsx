'use client';

import {
  Button,
  PageHeader,
  PageHeaderActions,
  PageHeaderBreadcrumb,
  PageHeaderDescription,
  PageHeaderRow,
  PageHeaderTitle,
} from '@acronis-platform/ui-react';

export function PageHeaderDemo() {
  return (
    <div className="w-full">
      <PageHeader>
        <PageHeaderBreadcrumb>Home / Reports</PageHeaderBreadcrumb>
        <PageHeaderRow>
          <PageHeaderTitle>Reports</PageHeaderTitle>
          <PageHeaderActions>
            <Button variant="ghost">Export</Button>
            <Button>New report</Button>
          </PageHeaderActions>
        </PageHeaderRow>
        <PageHeaderDescription>
          All scheduled and on-demand reports for your workloads.
        </PageHeaderDescription>
      </PageHeader>
    </div>
  );
}
