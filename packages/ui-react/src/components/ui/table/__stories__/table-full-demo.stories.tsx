import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { BuildingIcon } from '@acronis-platform/icons-react/stroke-mono';

import {
  type TableColumnFilterState,
  useTableUrlState,
} from '@/hooks/use-table-url-state';

import { Checkbox } from '../../checkbox';
import {
  FilterSearch,
  FilterSearchActions,
  FilterSearchAppliedFilters,
  FilterSearchFilters,
  useFilterSearchFilters,
} from '../../filter-search';
import { InputSearch } from '../../input-search';
import { DateRangePicker, type DateRange } from '../../date-range-picker';
import {
  InputSelect,
  InputSelectContent,
  InputSelectField,
  InputSelectItem,
  InputSelectLabel,
  InputSelectTrigger,
  InputSelectValue,
} from '../../input-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../select';
import { Tag } from '../../tag';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';
import { TablePagination } from '../table-pagination';
import { TableViewOptions } from '../table-view-options';

// Kitchen-sink demo for the TanStack-free `Table` primitives: `useTableUrlState`
// (pagination + sorting + per-column filters, all bookmarked to the URL),
// `TableViewOptions` (show/hide columns), a `wrap`-enabled column, and
// `FilterSearchFilters` + `FilterSearchAppliedFilters` composed as the filter UI
// — wired to the hook's `columnFilters` by converting between its `{id,value}[]`
// array and `FilterSearchFilters`'s `Record<string,unknown>`, the same shape
// `DataTableToolbar` uses (mirrored here for the primitives-only path).

const PAGE_SIZE = 5;

// Paste these params onto the preview URL (they merge with Storybook's own
// params — the hook's keys are namespaced `tbl_*`) to load the demo pre-filtered
// to Servers, sorted by name descending, on page 2:
//   tbl_page=2&tbl_sort=name:desc&tbl_filter=type:Server
const EXAMPLE_QUERY = 'tbl_page=2&tbl_sort=name:desc&tbl_filter=type:Server';

type Severity = 'Critical' | 'Error' | 'Warning' | 'Running';

interface Workload {
  name: string;
  type: 'Server' | 'Workstation';
  severity: Severity;
  description: string;
}

const SEVERITY_VARIANT = {
  Critical: 'danger',
  Error: 'danger',
  Warning: 'warning',
  Running: 'info',
} as const;

const SEVERITIES: Severity[] = ['Critical', 'Error', 'Warning', 'Running'];

const DESCRIPTIONS = [
  'The scheduled backup completed with warnings; one archived volume was skipped because the destination storage was temporarily unreachable during the maintenance window.',
  'Replication lag exceeded the configured threshold — investigate the network path between this workload and its standby replica.',
  'No issues detected.',
];

const workloads: Workload[] = Array.from({ length: 20 }, (_, i) => ({
  name: `Workload ${i + 1}`,
  type: i % 2 === 0 ? 'Server' : 'Workstation',
  severity: SEVERITIES[i % SEVERITIES.length],
  description: DESCRIPTIONS[i % DESCRIPTIONS.length],
}));

const TENANT_ITEMS = {
  acme: 'Acme Corp',
  globex: 'Globex Inc',
} as const;

// The leading element of the toolbar row — a tenant/scope switcher, ahead of
// search and the filters popover (matches the Figma "FilterSearch" anatomy).
function TenantSwitcher() {
  return (
    <Select items={TENANT_ITEMS} defaultValue="acme">
      <SelectTrigger className="w-56">
        <BuildingIcon
          size={16}
          className="shrink-0 text-[var(--ui-input-select-normal-icon-expand-color-idle)]"
        />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(TENANT_ITEMS).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Mirror of DataTableToolbar's `filtersToRecord` / `recordToFilters` for the
// primitives-only path — the hook's column filters are `{ id, value: string }[]`
// while FilterSearchFilters works in `Record<string, unknown>`.
function filtersToRecord(
  columnFilters: TableColumnFilterState[]
): Record<string, unknown> {
  return Object.fromEntries(columnFilters.map((f) => [f.id, f.value]));
}

function recordToFilters(
  record: Record<string, unknown>
): TableColumnFilterState[] {
  return Object.entries(record)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([id, value]) => ({ id, value: String(value) }));
}

// Storybook's manager forwards unknown query params DOWN to the preview iframe
// on load (confirmed: pasting `tbl_page=2&...` onto the outer address bar and
// reloading does restore state), but the other direction never reaches the
// visible address bar — `history.pushState` inside a story only updates the
// iframe's own `window.location`, a separate browsing context from the
// manager's. Mirror this demo's `tbl_*` params up to the parent frame (when
// actually embedded in one) after every render, so a real interaction is
// reflected in the address bar the user is looking at, not just the iframe's.
function useSyncUrlToParentFrame() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !window.top ||
      window.top === window.self
    )
      return;
    try {
      const iframeUrl = new URL(window.location.href);
      const topUrl = new URL(window.top.location.href);
      let changed = false;
      for (const [key, value] of iframeUrl.searchParams.entries()) {
        if (key.startsWith('tbl_') && topUrl.searchParams.get(key) !== value) {
          topUrl.searchParams.set(key, value);
          changed = true;
        }
      }
      for (const key of Array.from(topUrl.searchParams.keys())) {
        if (key.startsWith('tbl_') && !iframeUrl.searchParams.has(key)) {
          topUrl.searchParams.delete(key);
          changed = true;
        }
      }
      // `URLSearchParams.toString()` percent-encodes every value it
      // serializes, including Storybook's own unrelated `path=/story/...`
      // param — `/` never needs escaping in a query string, so unescape it
      // back for a readable URL.
      if (changed) {
        window.top.history.replaceState(
          null,
          '',
          topUrl.toString().replace(/%2F/g, '/')
        );
      }
    } catch {
      // Cross-origin parent (e.g. an unrelated embed) — nothing to sync.
    }
  });
}

const TYPE_OPTIONS = {
  all: 'All',
  Server: 'Server',
  Workstation: 'Workstation',
} as const;

function TypeFilterField() {
  const { filters, setFilter } = useFilterSearchFilters();
  const value = (filters.type as string) ?? 'all';
  return (
    <InputSelect
      items={TYPE_OPTIONS}
      value={value}
      onValueChange={(next) =>
        setFilter('type', next === 'all' ? undefined : next)
      }
    >
      <InputSelectField>
        <InputSelectLabel>Type</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue />
        </InputSelectTrigger>
      </InputSelectField>
      <InputSelectContent>
        {Object.entries(TYPE_OPTIONS).map(([key, label]) => (
          <InputSelectItem key={key} value={key}>
            {label}
          </InputSelectItem>
        ))}
      </InputSelectContent>
    </InputSelect>
  );
}

const SEVERITY_OPTIONS = {
  all: 'All',
  Critical: 'Critical',
  Error: 'Error',
  Warning: 'Warning',
  Running: 'Running',
} as const;

function SeverityFilterField() {
  const { filters, setFilter } = useFilterSearchFilters();
  const value = (filters.severity as string) ?? 'all';
  return (
    <InputSelect
      items={SEVERITY_OPTIONS}
      value={value}
      onValueChange={(next) =>
        setFilter('severity', next === 'all' ? undefined : next)
      }
    >
      <InputSelectField>
        <InputSelectLabel>Severity</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue />
        </InputSelectTrigger>
      </InputSelectField>
      <InputSelectContent>
        {Object.entries(SEVERITY_OPTIONS).map(([key, label]) => (
          <InputSelectItem key={key} value={key}>
            {label}
          </InputSelectItem>
        ))}
      </InputSelectContent>
    </InputSelect>
  );
}

// A date-range filter field, wired to the FilterSearchFilters draft via the
// context hook — opening its calendar renders a second Popover on top of the
// already-open Filters popup (popover-over-popover).
function PeriodFilterField() {
  const { filters, setFilter } = useFilterSearchFilters();
  return (
    <DateRangePicker
      label="Period"
      placeholder="Select a date range"
      value={(filters.period as DateRange | undefined) ?? {}}
      onValueChange={(range) =>
        setFilter('period', range.from ? range : undefined)
      }
      className="w-64"
    />
  );
}

function FullDemo() {
  useSyncUrlToParentFrame();
  const { state, setPagination, setSorting, setColumnFilters } =
    useTableUrlState({ defaultPageSize: PAGE_SIZE });
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  const sort = state.sorting[0];
  const filterRecord = filtersToRecord(state.columnFilters);

  const rows = useMemo(() => {
    let result = workloads;
    for (const filter of state.columnFilters) {
      // Free-text `name` search is a substring match; every other filter
      // (Type / Severity, from the Select fields) is an exact match.
      result =
        filter.id === 'name'
          ? result.filter((row) =>
              row.name.toLowerCase().includes(filter.value.toLowerCase())
            )
          : result.filter(
              (row) => String(row[filter.id as keyof Workload]) === filter.value
            );
    }
    if (sort) {
      const factor = sort.desc ? -1 : 1;
      result = [...result].sort(
        (a, b) =>
          String(a[sort.id as keyof Workload]).localeCompare(
            String(b[sort.id as keyof Workload]),
            undefined,
            { numeric: true }
          ) * factor
      );
    }
    return result;
  }, [state.columnFilters, sort]);

  const { pageIndex, pageSize } = state.pagination;
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = rows.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );

  const toggleSort = (id: string) =>
    setSorting((current) => {
      const active = current[0];
      if (!active || active.id !== id) return [{ id, desc: false }];
      if (!active.desc) return [{ id, desc: true }];
      return [];
    });

  const sortDirection = (id: string) =>
    sort && sort.id === id ? (sort.desc ? 'desc' : 'asc') : (false as const);

  const handleFiltersChange = (next: Record<string, unknown>) => {
    setColumnFilters(recordToFilters(next));
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const toggleColumn = (id: string) =>
    setHidden((previous) => ({ ...previous, [id]: !previous[id] }));

  return (
    <div className="w-[720px] space-y-4">
      <p className="text-sm text-muted-foreground">
        Pagination, sorting and per-column filters are mirrored to the URL query
        string (namespaced <code>tbl_*</code> keys) so the view is bookmarkable.
        Append <code>{EXAMPLE_QUERY}</code> to the preview URL to load Servers,
        sorted by name descending, on page 2.
      </p>
      <div className="space-y-3">
        <FilterSearch>
          <TenantSwitcher />
          <InputSearch
            placeholder="Filter by name…"
            aria-label="Filter by name"
            className="w-56"
            value={(filterRecord.name as string) ?? ''}
            onChange={(event) =>
              handleFiltersChange({
                ...filterRecord,
                name: event.target.value || undefined,
              })
            }
          />
          <FilterSearchFilters
            value={filterRecord}
            onValueChange={handleFiltersChange}
          >
            <TypeFilterField />
            <SeverityFilterField />
          </FilterSearchFilters>
          <FilterSearchActions>
            <TableViewOptions
              columns={[
                { id: 'type', label: 'Type', hidden: !!hidden.type },
                {
                  id: 'severity',
                  label: 'Severity',
                  hidden: !!hidden.severity,
                },
                {
                  id: 'description',
                  label: 'Description',
                  hidden: !!hidden.description,
                },
              ]}
              onToggle={toggleColumn}
            />
          </FilterSearchActions>
        </FilterSearch>
        <FilterSearchAppliedFilters
          filters={filterRecord}
          onValueChange={handleFiltersChange}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox aria-label="Select all" />
            </TableHead>
            <TableHead
              sortable
              sortDirection={sortDirection('name')}
              onSort={() => toggleSort('name')}
            >
              Name
            </TableHead>
            {!hidden.type && <TableHead>Type</TableHead>}
            {!hidden.severity && (
              <TableHead
                sortable
                sortDirection={sortDirection('severity')}
                onSort={() => toggleSort('severity')}
              >
                Severity
              </TableHead>
            )}
            {!hidden.description && <TableHead wrap>Description</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageRows.length ? (
            pageRows.map((row) => (
              <TableRow key={row.name}>
                <TableCell>
                  <Checkbox aria-label={`Select ${row.name}`} />
                </TableCell>
                <TableCell className="font-medium">{row.name}</TableCell>
                {!hidden.type && <TableCell>{row.type}</TableCell>}
                {!hidden.severity && (
                  <TableCell>
                    <Tag variant={SEVERITY_VARIANT[row.severity]}>
                      {row.severity}
                    </Tag>
                  </TableCell>
                )}
                {!hidden.description && (
                  <TableCell wrap className="max-w-[280px]">
                    {row.description}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20]}
        totalRows={rows.length}
        onPageIndexChange={(next) =>
          setPagination((current) => ({ ...current, pageIndex: next }))
        }
        onPageSizeChange={(size) =>
          setPagination(() => ({ pageIndex: 0, pageSize: size }))
        }
      />
    </div>
  );
}

// The "Alerts screen" toolbar composition: a scope switcher, a free-text search,
// and a Filters popup (Filters button → popover) holding a Type select and a
// DateRangePicker period field — mirroring the real design where the date-range
// filter lives as one field inside the filters popup, not standalone in the
// toolbar row. Opening the period calendar stacks a second Popover on top of the
// open Filters popup. The table's own data/columns are unchanged from `FullDemo`'s
// `workloads`; the search narrows by name and the applied Type filter narrows by
// type.
function ToolbarWithDateRangeDemo() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, unknown>>({
    period: {
      from: new Date(2026, 6, 1),
      to: new Date(2026, 6, 15),
    } satisfies DateRange,
  });

  const type = filters.type as string | undefined;
  const rows = workloads.filter(
    (row) =>
      row.name.toLowerCase().includes(query.toLowerCase()) &&
      (!type || row.type === type)
  );

  return (
    <div className="w-[720px] space-y-4">
      <FilterSearch>
        <TenantSwitcher />
        <InputSearch
          placeholder="Filter by name…"
          aria-label="Filter by name"
          className="w-56"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <FilterSearchFilters value={filters} onValueChange={setFilters}>
          <TypeFilterField />
          <PeriodFilterField />
        </FilterSearchFilters>
      </FilterSearch>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Severity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.slice(0, PAGE_SIZE).map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>
                  <Tag variant={SEVERITY_VARIANT[row.severity]}>
                    {row.severity}
                  </Tag>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const meta = {
  title: 'UI/Table/Full Demo',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Combines `useTableUrlState` (pagination + sorting + per-column filters), `TableViewOptions`, a `wrap` column, and `FilterSearchFilters` + `FilterSearchAppliedFilters`. All state is bookmarked to the URL. To load a non-default state, append `tbl_page=2&tbl_sort=name:desc&tbl_filter=type:Server` to the preview URL — it filters to Servers, sorts by name descending, and opens page 2.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullDemoStory: Story = {
  name: 'Full demo',
  render: () => <FullDemo />,
};

// Restore from the documented example query string (the "arrived via bookmarked
// link" case): `beforeEach` seeds it before the story renders so the hook reads
// it in its initial state, then cleans up so it never leaks into another story.
export const RestoreFromExampleUrl: Story = {
  name: 'Restore from example URL',
  beforeEach: () => {
    const params = new URLSearchParams(window.location.search);
    params.set('tbl_page', '2');
    params.set('tbl_sort', 'name:desc');
    params.set('tbl_filter', 'type:Server');
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}?${params.toString()}`
    );
    return () => {
      const cleanup = new URLSearchParams(window.location.search);
      cleanup.delete('tbl_page');
      cleanup.delete('tbl_sort');
      cleanup.delete('tbl_filter');
      const query = cleanup.toString();
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${query ? `?${query}` : ''}`
      );
    };
  },
  render: () => <FullDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Filtered to 10 Servers at page size 5 → 2 pages, showing page 2.
    await expect(canvas.getByText('Page 2 of 2')).toBeInTheDocument();
    // Sorted by name descending.
    const nameHeader = canvas.getByRole('columnheader', { name: /Name/ });
    await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    // The type filter surfaces as an applied-filter chip.
    await expect(canvas.getByText('type: Server')).toBeInTheDocument();
    // Only Servers are shown (Workload 2 is a Workstation and is filtered out).
    await expect(canvas.getByText('Workload 9')).toBeInTheDocument();
    await expect(canvas.queryByText('Workload 2')).not.toBeInTheDocument();
  },
};

export const WithDateRangeFilter: Story = {
  name: 'With date-range filter',
  render: () => <ToolbarWithDateRangeDemo />,
};

// Same composition as above, but the `play` opens the Filters popover AND the
// Period field's calendar so the popover-over-popover state is captured for VR —
// the initial (closed) render above never exercises the nested overlay. `fullPage`
// is required because both popovers portal outside `#storybook-root`.
export const WithDateRangeFilterOpen: Story = {
  name: 'With date-range filter (open)',
  parameters: { snapshot: { fullPage: true, animationDelay: 400 } },
  render: () => <ToolbarWithDateRangeDemo />,
  play: async () => {
    const body = within(document.body);
    await userEvent.click(await body.findByRole('button', { name: 'Filters' }));
    await userEvent.click(await body.findByRole('button', { name: 'Period' }));
    // Wait for the dual-month calendar (two grids) to paint inside the nested popover.
    await body.findAllByRole('grid');
  },
};
