import * as React from 'react';

import { cn } from '@/lib/utils';

// The page content region — the padded gutter for a page's body. Ported from
// `@acronis-platform`'s `page-content`. Rendered as a `<div>`, not `<main>` —
// `AppShellChatContentBody` doesn't provide a `main` landmark either, so wrap
// this in your own `<main>` regardless of whether it nests inside
// `AppShellChatContentBody` or is used standalone. Layout-only (flex-1 + page
// padding).
export type PageContentProps = React.HTMLAttributes<HTMLDivElement>;

const PageContent = React.forwardRef<HTMLDivElement, PageContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="page-content"
      className={cn('flex-1 p-6', className)}
      {...props}
    />
  )
);
PageContent.displayName = 'PageContent';

export { PageContent };
