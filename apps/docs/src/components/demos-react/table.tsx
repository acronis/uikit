'use client';

import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
} from '@acronis-platform/ui-react';

export function TableDemo() {
  return (
    <Table style={{ width: 560 }}>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox aria-label="Select all" />
          </TableHead>
          <TableHead sortable sortDirection="asc">
            Workload
          </TableHead>
          <TableHead sortable>Last backup</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow selected>
          <TableCell>
            <Checkbox defaultChecked aria-label="Select row" />
          </TableCell>
          <TableCell>web-server-01</TableCell>
          <TableCell>26 Jan, 2026</TableCell>
          <TableCell>
            <Tag>Protected</Tag>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Checkbox aria-label="Select row" />
          </TableCell>
          <TableCell>db-primary</TableCell>
          <TableCell>26 Jan, 2026</TableCell>
          <TableCell>
            <Tag>Protected</Tag>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Checkbox aria-label="Select row" />
          </TableCell>
          <TableCell>cache-node-3</TableCell>
          <TableCell>24 Jan, 2026</TableCell>
          <TableCell>
            <Tag>Pending</Tag>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
