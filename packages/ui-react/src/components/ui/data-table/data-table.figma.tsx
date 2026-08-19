// Figma Code Connect — status: COMPLETE
// The Figma Table canvas (2948-2416) documents the *primitive* parts, which are
// mapped one-by-one in `table/table.figma.tsx`. DataTable is the behavioral
// composition over those parts (TanStack react-table: sorting, selection,
// column visibility, pagination), so it connects to the assembled example frame
// 4567-6801. This is the canonical Dev Mode connection for that shared node —
// `table.figma.tsx` intentionally does not also connect `Table` there (its own
// part-level connects cover the primitives), so this is the only snippet Figma
// shows for the assembled frame, offered as the batteries-included alternative
// a designer can pick instead of hand-composing the primitives.
//
// The frame's `hasCheckbox` / `hasSettings` / `hasActions` booleans are not
// DataTable props — selection and row actions come from the column definitions
// (a select column, an actions column), and the per-cell interaction states are
// the Table primitives' CSS. So there is nothing to map: the connection exists
// to surface the composed snippet.
import figma from '@figma/code-connect';
import type { ColumnDef } from '@tanstack/react-table';

import { DataTable } from './data-table';

interface Row {
  name: string;
  status: string;
}

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Table header' },
  { accessorKey: 'status', header: 'Table header' },
];

const data: Row[] = [{ name: 'Simple value', status: 'Simple value' }];

figma.connect(
  DataTable,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=4567-6801',
  {
    example: () => (
      <DataTable columns={columns} data={data} highlightCurrentRow />
    ),
  }
);
