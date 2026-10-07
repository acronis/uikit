import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  CogIcon,
  EllipsisIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { useSortState } from '@/hooks';

import { ButtonIcon } from '../../button-icon';
import { Checkbox } from '../../checkbox';
import {
  Table,
  TableActionsCell,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectCell,
  TableSettingsCell,
} from '../table';
import { TablePagination } from '../table-pagination';

const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description:
        'Composed parts — `TableHeader`/`TableBody`/`TableFooter` with `TableRow`, `TableHead`, `TableCell`, and an optional `TableCaption`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the `<table>`.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table className="w-[520px]">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-end">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-end">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className="text-end">$350.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-end">$750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

type Archive = {
  id: string;
  name: string;
  created: string;
  size: number;
};

const ARCHIVE_ROWS: Archive[] = [
  { id: 'a1', name: 'Backup archive', created: '26 Jan, 2026', size: 4567890 },
  { id: 'a2', name: 'Disk image', created: '24 Jan, 2026', size: 1204050 },
];

// Sortable headers render the sort affordance (inactive ⇅ / active ↑ / active ↓),
// set `aria-sort`, and are wired to `useSortState` so clicking a header actually
// re-sorts the rows.
function SortableHeadersDemo() {
  const { sortedData, getSortDirection, toggleSort } = useSortState({
    data: ARCHIVE_ROWS,
    initialSort: { columnId: 'name', direction: 'asc' },
  });

  return (
    <Table className="w-[520px]">
      <TableHeader>
        <TableRow>
          <TableHead
            sortable
            sortDirection={getSortDirection('name')}
            onSort={() => toggleSort('name')}
          >
            Name
          </TableHead>
          <TableHead
            sortable
            sortDirection={getSortDirection('created')}
            onSort={() => toggleSort('created')}
          >
            Created
          </TableHead>
          <TableHead
            sortable
            sortDirection={getSortDirection('size')}
            onSort={() => toggleSort('size')}
            className="text-end"
          >
            Size
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.created}</TableCell>
            <TableCell className="text-end">
              {row.size.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const SortableHeaders: Story = {
  render: () => <SortableHeadersDemo />,
};

const SELECTION_ROWS = [
  { id: 'r1', name: 'web-server-01' },
  { id: 'r2', name: 'db-primary' },
  { id: 'r3', name: 'mail-relay' },
];

// Tri-state "select all" header checkbox driven by per-row selection state:
// unchecked when no rows are selected, `indeterminate` when some (but not all)
// are, checked when every row is. Toggling the header checks/unchecks all rows.
function RowSelectionStatesDemo() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const selectedCount = SELECTION_ROWS.filter((row) => selected[row.id]).length;
  const allSelected = selectedCount === SELECTION_ROWS.length;
  const someSelected = selectedCount > 0 && !allSelected;

  const toggleAll = () =>
    setSelected(
      allSelected
        ? {}
        : Object.fromEntries(SELECTION_ROWS.map((row) => [row.id, true]))
    );

  return (
    <Table className="w-[520px]">
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              aria-label="Select all"
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={toggleAll}
            />
          </TableHead>
          <TableHead>Workload</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SELECTION_ROWS.map((row) => (
          <TableRow key={row.id} selected={!!selected[row.id]}>
            <TableCell>
              <Checkbox
                aria-label={`Select ${row.name}`}
                checked={!!selected[row.id]}
                onCheckedChange={(value) =>
                  setSelected((previous) => ({ ...previous, [row.id]: !!value }))
                }
              />
            </TableCell>
            <TableCell>{row.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const RowSelectionStates: Story = {
  render: () => <RowSelectionStatesDemo />,
};

/* --------------------------------------------------------- Scrollable body */

interface ScrollRow {
  id: string;
  name: string;
  size: number;
}

const TOTAL_ROWS = 60;
// A page deliberately holds more rows than the scroll viewport can show at
// once, so scrolling within the page is actually necessary (not just a
// pagination-sized coincidence).
const PAGE_SIZE = 20;
const SCROLL_ROWS: ScrollRow[] = Array.from({ length: TOTAL_ROWS }, (_, i) => ({
  id: `row-${i + 1}`,
  name: `Workload ${i + 1}`,
  size: ((i * 37) % 100) + 1,
}));

// A fixed-height, vertically scrolling table body — the header and pagination
// stay put while the rows scroll underneath. `Table` already renders its own
// `overflow-auto` wrapper (for horizontal scroll); nesting a SECOND
// `overflow-auto`/`overflow-y-auto` div around it would give `position: sticky`
// two candidate scrolling ancestors, and it locks onto the nearest one — that
// inner, Table-owned wrapper, which never itself scrolls (it's sized to fit its
// content) — so the header wouldn't stick. Instead, size and scroll Table's OWN
// wrapper directly via a child-selector utility (`[&>div]:...`), so there's
// only one scrolling ancestor. `sticky top-0` goes on each header CELL, not the
// `<tr>` — browsers don't reliably support `position: sticky` on table rows.
function ScrollableBodyDemo() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const pageCount = Math.ceil(SCROLL_ROWS.length / pageSize);
  const pageRows = SCROLL_ROWS.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );

  return (
    <div className="w-[420px] space-y-4">
      <div className="rounded-md border border-(--ui-table-global-row-border-color) [&>div]:max-h-[220px] [&>div]:overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-10 bg-background">
                Name
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-background text-end">
                Size
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell className="text-end">{row.size}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        totalRows={SCROLL_ROWS.length}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />
    </div>
  );
}

export const ScrollableBody: Story = {
  render: () => <ScrollableBodyDemo />,
};

/**
 * The full design anatomy: a leading selection column (`TableSelectCell`), a
 * trailing settings column in the header (`TableSettingsCell`) and a trailing
 * row-actions column in the body (`TableActionsCell`).
 */
export const WithSelectionAndActions: Story = {
  render: () => (
    <Table className="w-[640px]">
      <TableHeader>
        <TableRow>
          <TableSelectCell header>
            <Checkbox aria-label="Select all rows" />
          </TableSelectCell>
          <TableHead sortable>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableSettingsCell>
            <ButtonIcon aria-label="Column settings">
              <CogIcon />
            </ButtonIcon>
          </TableSettingsCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          { name: 'web-server-01', status: 'Protected' },
          { name: 'db-primary', status: 'Protected' },
          { name: 'mail-relay', status: 'Not protected' },
        ].map((row, index) => (
          <TableRow key={row.name} selected={index === 1}>
            <TableSelectCell>
              <Checkbox
                checked={index === 1}
                aria-label={`Select ${row.name}`}
              />
            </TableSelectCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableActionsCell>
              <ButtonIcon aria-label={`Actions for ${row.name}`}>
                <EllipsisIcon />
              </ButtonIcon>
            </TableActionsCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// ---------------------------------------------------------------------------
// 1:1 mirrors of the Figma part/state matrices so a reviewer can diff a story
// against its design frame directly.
//
// The pure CSS interaction states (hover / press / focus) can't all coexist in
// one screenshot, so the *matrix* stories depict each state by applying that
// state's own `--ui-*` token to a static cell — the same token the live
// `hover:` / `active:` / `has-[:focus-visible]:` utility resolves to. The
// checkbox hover stories further down capture the live `:hover` state instead,
// via the test runner's `parameters.snapshot.hoverSelector` (a real
// Playwright mouse move — synthetic pointer events can't set `:hover`).
// ---------------------------------------------------------------------------

const STATE_LABEL = 'text-xs text-muted-foreground';

/** Figma: TableHeaderCell component set (node 3427-207) — idle/hover/active/focus. */
export const TableHeaderCellStates: Story = {
  render: () => (
    <Table className="w-[560px]">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead sortable className="bg-[var(--ui-table-header-cell-color-idle)]">
            idle
          </TableHead>
          <TableHead sortable className="bg-[var(--ui-table-header-cell-color-hover)]">
            hover
          </TableHead>
          <TableHead sortable className="bg-[var(--ui-table-header-cell-color-active)]">
            active
          </TableHead>
          <TableHead
            sortable
            className="ring-[3px] ring-inset ring-[var(--ui-focus-primary)]"
          >
            focus
          </TableHead>
        </TableRow>
      </TableHeader>
    </Table>
  ),
};

/** Figma: TableDataCell states (node 4536-97) — idle/hover/active. */
export const TableDataCellStates: Story = {
  render: () => (
    <Table className="w-[480px]">
      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell className="bg-[var(--ui-table-data-cell-color-idle)]">
            idle
          </TableCell>
          <TableCell className="bg-[var(--ui-table-data-cell-color-hover)]">
            hover
          </TableCell>
          <TableCell className="bg-[var(--ui-table-data-cell-color-active)]">
            active
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/** Figma: TableSettings component set (node 3698-497) — idle/hover/active/focus. */
export const TableSettingsStates: Story = {
  render: () => (
    <Table className="w-[240px]">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableSettingsCell className="hover:bg-[var(--ui-table-header-cell-color-idle)]">
            <ButtonIcon aria-label="Column settings">
              <CogIcon />
            </ButtonIcon>
          </TableSettingsCell>
          <TableSettingsCell className="bg-[var(--ui-table-header-cell-color-hover)]">
            <ButtonIcon aria-label="Column settings, hover">
              <CogIcon />
            </ButtonIcon>
          </TableSettingsCell>
          <TableSettingsCell className="bg-[var(--ui-table-header-cell-color-active)]">
            <ButtonIcon aria-label="Column settings, pressed">
              <CogIcon />
            </ButtonIcon>
          </TableSettingsCell>
          <TableSettingsCell className="ring-[3px] ring-inset ring-[var(--ui-focus-primary)]">
            <ButtonIcon aria-label="Column settings, focused">
              <CogIcon />
            </ButtonIcon>
          </TableSettingsCell>
        </TableRow>
      </TableHeader>
    </Table>
  ),
};

/** Figma: TableActions component set (node 4536-414) — idle/hover/active/focus. */
export const TableActionsStates: Story = {
  render: () => (
    <Table className="w-[240px]">
      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableActionsCell className="hover:bg-[var(--ui-table-data-cell-color-idle)]">
            <ButtonIcon aria-label="Row actions">
              <EllipsisIcon />
            </ButtonIcon>
          </TableActionsCell>
          <TableActionsCell className="bg-[var(--ui-table-data-cell-color-hover)]">
            <ButtonIcon aria-label="Row actions, hover">
              <EllipsisIcon />
            </ButtonIcon>
          </TableActionsCell>
          <TableActionsCell className="bg-[var(--ui-table-data-cell-color-active)]">
            <ButtonIcon aria-label="Row actions, pressed">
              <EllipsisIcon />
            </ButtonIcon>
          </TableActionsCell>
          <TableActionsCell className="ring-[3px] ring-inset ring-[var(--ui-focus-primary)]">
            <ButtonIcon aria-label="Row actions, focused">
              <EllipsisIcon />
            </ButtonIcon>
          </TableActionsCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/** Figma: TableCheckbox component set (node 3698-746) — the cell's checkbox variants. */
export const TableCheckboxStates: Story = {
  render: () => (
    <Table className="w-[200px]">
      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableSelectCell>
            <Checkbox aria-label="Unchecked" />
          </TableSelectCell>
          <TableSelectCell>
            <Checkbox checked aria-label="Checked" />
          </TableSelectCell>
          <TableSelectCell>
            <Checkbox indeterminate aria-label="Indeterminate" />
          </TableSelectCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/** Figma: TableHeaderRow (node 3698-538) — hasCheckbox × hasSettings. */
export const TableHeaderRowVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(
        [
          [false, false],
          [true, false],
          [false, true],
          [true, true],
        ] as const
      ).map(([hasCheckbox, hasSettings]) => (
        <div key={`${hasCheckbox}-${hasSettings}`} className="flex flex-col gap-1">
          <span className={STATE_LABEL}>
            {`hasCheckbox=${hasCheckbox} hasSettings=${hasSettings}`}
          </span>
          <Table className="w-[520px]">
            <TableHeader>
              <TableRow>
                {hasCheckbox && (
                  <TableSelectCell header>
                    <Checkbox aria-label="Select all rows" />
                  </TableSelectCell>
                )}
                <TableHead sortable>Table header</TableHead>
                <TableHead sortable>Table header</TableHead>
                {hasSettings && (
                  <TableSettingsCell>
                    <ButtonIcon aria-label="Column settings">
                      <CogIcon />
                    </ButtonIcon>
                  </TableSettingsCell>
                )}
              </TableRow>
            </TableHeader>
          </Table>
        </div>
      ))}
    </div>
  ),
};

/** Figma: TableDataRow (node 4536-175) — idle/selected × hasCheckbox/hasActions. */
export const TableDataRowVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(
        [
          [false, false, false],
          [true, true, false],
          [true, true, true],
        ] as const
      ).map(([hasCheckbox, hasActions, selected]) => (
        <div
          key={`${hasCheckbox}-${hasActions}-${selected}`}
          className="flex flex-col gap-1"
        >
          <span className={STATE_LABEL}>
            {`hasCheckbox=${hasCheckbox} hasActions=${hasActions} state=${
              selected ? 'selected' : 'idle'
            }`}
          </span>
          <Table className="w-[520px]">
            <TableBody>
              <TableRow selected={selected}>
                {hasCheckbox && (
                  <TableSelectCell>
                    <Checkbox checked={selected} aria-label="Select row" />
                  </TableSelectCell>
                )}
                <TableCell>Simple value</TableCell>
                <TableCell>Simple value</TableCell>
                {hasActions && (
                  <TableActionsCell>
                    <ButtonIcon aria-label="Row actions">
                      <EllipsisIcon />
                    </ButtonIcon>
                  </TableActionsCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Figma section "Basic table behavior" (node 5916-12271) — the "Table with
// Checkbox" column. The captions there state the rule these stories encode:
// once any row is checked, *that row's* single-row actions disappear (bulk
// actions move to the toolbar, which is a separate deferred component).
// ---------------------------------------------------------------------------

const CHECKBOX_ROWS = [
  { name: 'web-server-01', status: 'Protected' },
  { name: 'db-primary', status: 'Protected' },
  { name: 'mail-relay', status: 'Not protected' },
];

function CheckboxTable({ selected = [] }: { selected?: string[] }) {
  const allSelected = selected.length === CHECKBOX_ROWS.length;
  return (
    <Table className="w-[560px]">
      <TableHeader>
        <TableRow>
          <TableSelectCell header>
            <Checkbox
              checked={allSelected}
              indeterminate={selected.length > 0 && !allSelected}
              aria-label="Select all rows"
            />
          </TableSelectCell>
          <TableHead sortable>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableSettingsCell>
            <ButtonIcon aria-label="Column settings">
              <CogIcon />
            </ButtonIcon>
          </TableSettingsCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {CHECKBOX_ROWS.map((row) => {
          const isSelected = selected.includes(row.name);
          return (
            <TableRow key={row.name} selected={isSelected}>
              <TableSelectCell>
                <Checkbox checked={isSelected} aria-label={`Select ${row.name}`} />
              </TableSelectCell>
              <TableCell data-testid={`cell-${row.name}`}>{row.name}</TableCell>
              <TableCell>{row.status}</TableCell>
              {/* The design hides a checked row's single-row actions. */}
              <TableActionsCell>
                {!isSelected && (
                  <ButtonIcon aria-label={`Actions for ${row.name}`}>
                    <EllipsisIcon />
                  </ButtonIcon>
                )}
              </TableActionsCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

/** Figma: "Table with Checkbox / Idle state". */
export const WithCheckboxIdleState: Story = {
  render: () => <CheckboxTable />,
};

/**
 * Figma: "Table with Checkbox / Hover on Row (Outside checkbox cell)".
 *
 * The hover is driven by the test runner at the Playwright level
 * (`parameters.snapshot.hoverSelector`) — only a real mouse move puts the
 * browser into the `:hover` pseudo-class the `hover:` utilities key off.
 */
export const WithCheckboxHoverOnRow: Story = {
  render: () => <CheckboxTable />,
  parameters: { snapshot: { hoverSelector: '[data-testid="cell-db-primary"]' } },
};

/** Figma: "Table with Checkbox / Hover on Checkbox". */
export const WithCheckboxHoverOnCheckbox: Story = {
  render: () => <CheckboxTable />,
  parameters: {
    snapshot: { hoverSelector: '[aria-label="Select db-primary"]' },
  },
};

/**
 * Figma: "Table with Checkbox / Checkbox checked (All single row actions
 * disappeared)" — the checked row's overflow trigger is gone.
 */
export const RowSelectionHidesActions: Story = {
  render: () => <CheckboxTable selected={['db-primary']} />,
};

/**
 * Figma: "Table with Checkbox / Multiple checkboxes checked (All single row
 * actions disappeared)" — plus the tri-state select-all becomes indeterminate.
 */
export const MultipleRowSelectionHidesActions: Story = {
  render: () => <CheckboxTable selected={['web-server-01', 'db-primary']} />,
};
