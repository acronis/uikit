import * as React from 'react'
import {
  PaginationFirstPage,
  PaginationMiddlePage,
  PaginationLastPage,
  PaginationSimple,
  PaginationCompact,
} from '@acronis-platform/shadcn-uikit-demos/pagination'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import paginationFirstPageCode from '../../../demos/src/pagination/PaginationFirstPage.tsx?raw'
import paginationMiddlePageCode from '../../../demos/src/pagination/PaginationMiddlePage.tsx?raw'
import paginationLastPageCode from '../../../demos/src/pagination/PaginationLastPage.tsx?raw'
import paginationSimpleCode from '../../../demos/src/pagination/PaginationSimple.tsx?raw'
import paginationCompactCode from '../../../demos/src/pagination/PaginationCompact.tsx?raw'

export function PaginationDemo() {
  return (
    <section className="demo-section">
      <h2>Pagination</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Navigation component for multi-page content with various states and
        configurations.
      </p>

      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold">Features</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>Responsive design with proper spacing</li>
          <li>Active page highlighting with brand colors</li>
          <li>Disabled state for boundary pages (first/last)</li>
          <li>Ellipsis for truncated page ranges</li>
          <li>Keyboard navigation support</li>
          <li>ARIA labels for accessibility</li>
          <li>Customizable page ranges and visibility</li>
          <li>Follows Acronis brand design tokens</li>
        </ul>
      </div>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Pagination - First Page"
          description="Shows the first page state with disabled previous button and visible first pages"
          code={paginationFirstPageCode}
        >
          <PaginationFirstPage />
        </DemoWithCode>

        <DemoWithCode
          title="Middle Page State"
          description="Shows a middle page with ellipsis on both sides and surrounding page numbers"
          code={paginationMiddlePageCode}
        >
          <PaginationMiddlePage />
        </DemoWithCode>

        <DemoWithCode
          title="Last Page State"
          description="Shows the last page state with disabled next button and visible last pages"
          code={paginationLastPageCode}
        >
          <PaginationLastPage />
        </DemoWithCode>

        <DemoWithCode
          title="Simple Pagination"
          description="Minimal pagination with just prev/next controls"
          code={paginationSimpleCode}
        >
          <PaginationSimple />
        </DemoWithCode>

        <DemoWithCode
          title="Compact Pagination"
          description="Pagination with fewer visible page numbers"
          code={paginationCompactCode}
        >
          <PaginationCompact />
        </DemoWithCode>
      </div>
    </section>
  );
}
