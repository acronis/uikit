'use client';

import { PageContent } from '@acronis-platform/ui-react';

export function PageContentDemo() {
  return (
    <div className="h-[240px] rounded-md bg-[var(--ui-background-surface-secondary)]">
      <PageContent className="rounded-md bg-background">
        <h1 className="text-lg font-semibold">Page content</h1>
        <p className="mt-2 text-sm text-[var(--ui-text-on-surface-secondary)]">
          The padded gutter region for a page body — nests inside AppShellMain.
        </p>
      </PageContent>
    </div>
  );
}
