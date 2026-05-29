import * as React from 'react'
import {
  TableBasic,
  TableWithFooter,
  TableWithSelection,
  TableWithActions,
  TableWithBadges,
  TableCompact,
  TableStriped,
  TableEmpty,
  TableScrollable,
  TableSortable,
} from '@acronis-platform/shadcn-uikit-demos/table'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import tableBasicCode from '../../../demos/src/table/TableBasic.tsx?raw'
import tableWithFooterCode from '../../../demos/src/table/TableWithFooter.tsx?raw'
import tableWithSelectionCode from '../../../demos/src/table/TableWithSelection.tsx?raw'
import tableWithActionsCode from '../../../demos/src/table/TableWithActions.tsx?raw'
import tableWithBadgesCode from '../../../demos/src/table/TableWithBadges.tsx?raw'
import tableCompactCode from '../../../demos/src/table/TableCompact.tsx?raw'
import tableStripedCode from '../../../demos/src/table/TableStriped.tsx?raw'
import tableEmptyCode from '../../../demos/src/table/TableEmpty.tsx?raw'
import tableScrollableCode from '../../../demos/src/table/TableScrollable.tsx?raw'
import tableSortableCode from '../../../demos/src/table/TableSortable.tsx?raw'

export function TableDemo() {
  return (
    <section className="demo-section">
      <h2>Table Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used to present large amounts of data in a structured form so that they can be easily
        scanned, compared, and analyzed.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Table"
          description="Simple table with headers and rows."
          code={tableBasicCode}
        >
          <TableBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Table with Footer"
          description="Table with a footer row showing totals."
          code={tableWithFooterCode}
        >
          <TableWithFooter />
        </DemoWithCode>

        <DemoWithCode
          title="Table with Selection"
          description="Table with checkboxes for row selection."
          code={tableWithSelectionCode}
        >
          <TableWithSelection />
        </DemoWithCode>

        <DemoWithCode
          title="Table with Actions"
          description="Table with action buttons in each row."
          code={tableWithActionsCode}
        >
          <TableWithActions />
        </DemoWithCode>

        <DemoWithCode
          title="Table with Badges"
          description="Table with status badges."
          code={tableWithBadgesCode}
        >
          <TableWithBadges />
        </DemoWithCode>

        <DemoWithCode
          title="Compact Table"
          description="Table with reduced padding for compact display."
          code={tableCompactCode}
        >
          <TableCompact />
        </DemoWithCode>

        <DemoWithCode
          title="Striped Table"
          description="Table with alternating row colors."
          code={tableStripedCode}
        >
          <TableStriped />
        </DemoWithCode>

        <DemoWithCode
          title="Empty State"
          description="Table with no data."
          code={tableEmptyCode}
        >
          <TableEmpty />
        </DemoWithCode>

        <DemoWithCode
          title="Scrollable Table"
          description="Table with horizontal scroll for many columns."
          code={tableScrollableCode}
        >
          <TableScrollable />
        </DemoWithCode>

        <DemoWithCode
          title="Data Table with Sorting"
          description="Table with sortable column headers."
          code={tableSortableCode}
        >
          <TableSortable />
        </DemoWithCode>
      </div>
    </section>
  );
}
