import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `PageContentProps` in
// page-content.tsx is `React.HTMLAttributes<HTMLDivElement>`, which expands to
// every `<div>` DOM attribute — a large, noisy table for a component whose only
// real API is `className`. (The runtime type lives in page-content.tsx; this
// file is never bundled.)

/** Props for `PageContent` — the padded gutter for a page's body. */
export interface PageContentProps {
  /**
   * Extra classes merged onto the region — use it to override the default page
   * padding (e.g. `p-0` for a full-bleed table).
   */
  className?: string;
  /** The page body. */
  children?: React.ReactNode;
}
