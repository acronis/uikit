// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. The DataTable is a
// behavioral composition over the Table primitive (TanStack react-table); a Figma
// node would map the assembled table. Replace 'FIGMA_NODE_URL' and flip to
// COMPLETE via `/figma-component DataTable <url> --update`.
import figma from '@figma/code-connect';

import { DataTable } from './data-table';

figma.connect(DataTable, 'FIGMA_NODE_URL', {
  example: () => <DataTable columns={[]} data={[]} />,
});
