// Figma Code Connect — status: NEEDS_FIGMA_URL
// Informed by the "pre-release" Table design in the shadcn-uikit Figma
// (node 2948-2416), but not yet wired to a "ready for dev" node. Table is a
// compositional primitive set (no variant/size props), so there are no property
// mappings to verify — only the node URL is missing. Replace 'FIGMA_NODE_URL'
// with the component-set link and flip the status to COMPLETE via
// `/figma-component Table <url> --update`, then validate with `figma:connect`.
import figma from '@figma/code-connect';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

figma.connect(Table, 'FIGMA_NODE_URL', {
  example: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead sortable>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Smith</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
});
