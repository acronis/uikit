import * as React from 'react'
import { DataTableFull } from '@acronis-platform/shadcn-uikit-demos/data-table'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import dataTableFullCode from '../../../demos/src/data-table/DataTableFull.tsx?raw'

export function DataTableDemo() {
  return (
    <section className="demo-section">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Data Table</h2>
        <p className="text-muted-foreground">
          A powerful table component with sorting, filtering, pagination, and
          row selection.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold">Features</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>Column sorting (click on column headers)</li>
          <li>Global search filtering (search by email)</li>
          <li>Row selection with checkboxes</li>
          <li>Pagination with customizable page size</li>
          <li>Column visibility toggle</li>
          <li>Responsive design</li>
          <li>Action menus per row</li>
          <li>Custom cell rendering (badges, formatted currency, dates)</li>
        </ul>
      </div>

      <div className="space-y-4">
        <DemoWithCode
          title="Full-Featured Data Table"
          description="Complete data table with all features: sorting, filtering, pagination, row selection, column visibility, and action menus."
          code={dataTableFullCode}
        >
          <DataTableFull />
        </DemoWithCode>
      </div>
    </section>
  );
}
