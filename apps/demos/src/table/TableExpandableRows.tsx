import { Fragment, useMemo, useState } from 'react';
import { Button } from '@acronis-platform/shadcn-uikit/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@acronis-platform/shadcn-uikit/react';

const records = [
  {
    id: '2016-05-01',
    date: '2016-05-01',
    name: 'Tom',
    details:
      'Tom has a longer description that can be shown only when this row is expanded.',
  },
  {
    id: '2016-05-02',
    date: '2016-05-02',
    name: 'Bartholomew Roberts',
    details: 'Bartholomew details with additional metadata and notes.',
  },
  {
    id: '2016-05-03',
    date: '2016-05-03',
    name: 'Petti',
    details: 'Petti details with extra data for expanded rows.',
  },
  {
    id: '2016-05-04',
    date: '2016-05-04',
    name: 'Lakka',
    details: 'Lakka details with additional context.',
  },
  {
    id: '2016-05-05',
    date: '2016-05-05',
    name: 'Gunnar',
    details: 'Gunnar details with expanded content.',
  },
];

export function TableExpandableRows() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const allExpanded = useMemo(
    () => expandedRows.size === records.length,
    [expandedRows]
  );

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAllRows = () => {
    setExpandedRows(
      allExpanded ? new Set() : new Set(records.map((record) => record.id))
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => {
            const expanded = expandedRows.has(record.id);

            return (
              <Fragment key={record.id}>
                <TableRow>
                  <TableCell className="font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2 h-7 w-7 p-0"
                      onClick={() => toggleRow(record.id)}
                      aria-label={
                        expanded
                          ? `Collapse ${record.date}`
                          : `Expand ${record.date}`
                      }
                    >
                      {expanded ? '−' : '+'}
                    </Button>
                    {record.date}
                  </TableCell>
                  <TableCell>{record.name}</TableCell>
                </TableRow>
                {expanded && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={2}
                      className="h-auto py-3 text-sm text-muted-foreground"
                    >
                      {record.details}
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
          <TableRow>
            <TableCell colSpan={2} className="text-center">
              <Button variant="link" size="sm" onClick={toggleAllRows}>
                {allExpanded ? 'Collapse all rows' : 'Expand all rows'}
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
