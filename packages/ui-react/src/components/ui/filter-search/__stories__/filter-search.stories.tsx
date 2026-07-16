import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { format, parseISO } from 'date-fns';
import { BuildingIcon } from '@acronis-platform/icons-react/stroke-mono';

import {
  FilterSearch,
  FilterSearchActions,
  FilterSearchAppliedFilters,
  FilterSearchFilters,
  useFilterSearchFilters,
} from '../filter-search';
import { InputSearch as Search } from '../../input-search/input-search';
import { ButtonMenu } from '../../button-menu/button-menu';
import { Button } from '../../button/button';
import { InputDatePicker } from '../../input-date-picker/input-date-picker';
import {
  DateRangePicker,
  type DateRange,
} from '../../date-range-picker/date-range-picker';
import { Separator } from '../../separator/separator';
import {
  InputSelect,
  InputSelectContent,
  InputSelectField,
  InputSelectItem,
  InputSelectLabel,
  InputSelectTrigger,
  InputSelectValue,
} from '../../input-select/input-select';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../select/select';

const meta = {
  title: 'UI/FilterSearch',
  component: FilterSearch,
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for the root container.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
    children: {
      control: false,
      description:
        'Compose Search, ButtonMenu, Select, FilterSearchActions, and other elements as children.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    // FilterSearch itself carries no padding — outer spacing is the
    // consumer's call (e.g. a page/card shell). The story canvas provides it
    // here so the toolbar row and any sibling row (FilterSearchAppliedFilters)
    // share the same left edge instead of drifting apart.
    (Story) => (
      <div className="w-full max-w-[1152px] px-4 py-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FilterSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <FilterSearch>
      <Search placeholder="Placeholder" aria-label="Search" className="w-56" />
      <ButtonMenu variant="secondary">Table filters</ButtonMenu>
    </FilterSearch>
  ),
};

const tenantItems = {
  all: 'All customers',
  acme: 'Acme Corp',
  globex: 'Globex Inc',
};

export const WithTenantSwitcher: Story = {
  render: () => (
    <FilterSearch>
      <Select items={tenantItems} defaultValue="all">
        <SelectTrigger className="w-56">
          <BuildingIcon
            size={16}
            className="shrink-0 text-[var(--ui-input-select-normal-icon-expand-color-idle)]"
          />
          <SelectValue placeholder="All customers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All customers</SelectItem>
          <SelectItem value="acme">Acme Corp</SelectItem>
          <SelectItem value="globex">Globex Inc</SelectItem>
        </SelectContent>
      </Select>
      <Search placeholder="Placeholder" aria-label="Search" className="w-56" />
      <ButtonMenu variant="secondary">Table filters</ButtonMenu>
    </FilterSearch>
  ),
};

// --- Example filter fields, each bound to the draft via the context hook. ---

const TYPE_ITEMS = { all: 'All', device: 'Device', workload: 'Workload' };
const PRICING_ITEMS = { all: 'All', trial: 'Trial', paid: 'Paid' };
const STATUS_ITEMS = { all: 'All', active: 'Active', disabled: 'Disabled' };
const MANAGEMENT_ITEMS = {
  all: 'All',
  managed: 'Managed',
  unmanaged: 'Unmanaged',
};
const BILLING_ITEMS = { all: 'All', monthly: 'Monthly', annual: 'Annual' };

function SelectField({
  filterKey,
  label,
  items,
}: {
  filterKey: string;
  label: string;
  items: Record<string, string>;
}) {
  const { filters, setFilter } = useFilterSearchFilters();
  const value = (filters[filterKey] as string) ?? 'all';
  return (
    <InputSelect
      items={items}
      value={value}
      onValueChange={(next) => setFilter(filterKey, next)}
    >
      <InputSelectField>
        <InputSelectLabel>{label}</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue />
        </InputSelectTrigger>
      </InputSelectField>
      <InputSelectContent>
        {Object.entries(items).map(([key, itemLabel]) => (
          <InputSelectItem key={key} value={key}>
            {itemLabel}
          </InputSelectItem>
        ))}
      </InputSelectContent>
    </InputSelect>
  );
}

function CeoBirthdayField() {
  const { filters, setFilter } = useFilterSearchFilters();
  return (
    <InputDatePicker
      label="CEO birthday"
      placeholder="Select date"
      value={(filters.ceoBirthday as string) ?? undefined}
      onClick={() => setFilter('ceoBirthday', '2001-01-01')}
    />
  );
}

function DeviceFilterFields() {
  return (
    <>
      <SelectField filterKey="type" label="Type" items={TYPE_ITEMS} />
      <SelectField
        filterKey="pricingMode"
        label="Pricing mode"
        items={PRICING_ITEMS}
      />
      <SelectField filterKey="status" label="Status" items={STATUS_ITEMS} />
      <SelectField
        filterKey="management"
        label="Management"
        items={MANAGEMENT_ITEMS}
      />
      <SelectField
        filterKey="billingMode"
        label="Billing mode"
        items={BILLING_ITEMS}
      />
      <Separator />
      <CeoBirthdayField />
    </>
  );
}

function getDeviceFilterChipLabel(
  key: string,
  value: unknown
): React.ReactNode {
  const labelByKey: Record<string, string> = {
    type: 'Type',
    pricingMode: 'Pricing mode',
    status: 'Status',
    management: 'Management',
    billingMode: 'Billing mode',
    ceoBirthday: 'CEO birthday',
  };
  return `${labelByKey[key] ?? key}: ${String(value)}`;
}

// A controlled wrapper so the story reflects real applied-filter state, laid
// out as two stacked rows — the toolbar, then the applied-filter chips —
// matching the real "Table filters" screen this was modeled on.
function FilterSearchWithFiltersExample({
  initialFilters,
}: {
  initialFilters?: Record<string, unknown>;
}) {
  const [filters, setFilters] = React.useState<Record<string, unknown>>(
    initialFilters ?? {}
  );
  return (
    <div className="flex flex-col gap-3">
      <FilterSearch>
        <Select items={tenantItems} defaultValue="acme">
          <SelectTrigger className="w-56">
            <BuildingIcon
              size={16}
              className="shrink-0 text-[var(--ui-input-select-normal-icon-expand-color-idle)]"
            />
            <SelectValue placeholder="All customers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All customers</SelectItem>
            <SelectItem value="acme">Acme Corp</SelectItem>
            <SelectItem value="globex">Globex Inc</SelectItem>
          </SelectContent>
        </Select>
        <Search
          placeholder="Enter text to filter"
          aria-label="Search"
          className="w-56"
        />
        <FilterSearchFilters
          value={filters}
          onValueChange={setFilters}
          label="Table filters"
        >
          <DeviceFilterFields />
        </FilterSearchFilters>
      </FilterSearch>
      <FilterSearchAppliedFilters
        filters={filters}
        onValueChange={setFilters}
        getFilterChipLabel={getDeviceFilterChipLabel}
      />
    </div>
  );
}

export const WithFiltersAndChips: Story = {
  name: 'With filter popover and applied-filter chips',
  render: () => (
    <FilterSearchWithFiltersExample initialFilters={{ pricingMode: 'trial' }} />
  ),
};

// A date-range filter field bound to the draft via the context hook — the
// primary real-world composition the DateRangePicker was designed for (a
// date-range filter living inside a filter-search flyout).
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
    />
  );
}

function AlertsFilterFields() {
  return (
    <>
      <SelectField filterKey="status" label="Status" items={STATUS_ITEMS} />
      <Separator />
      <PeriodFilterField />
    </>
  );
}

function getAlertsFilterChipLabel(
  key: string,
  value: unknown
): React.ReactNode {
  if (key === 'period') {
    const range = value as DateRange;
    const from = range.from?.toLocaleDateString();
    const to = range.to?.toLocaleDateString();
    return `Period: ${from ?? '…'} – ${to ?? '…'}`;
  }
  return `${key === 'status' ? 'Status' : key}: ${String(value)}`;
}

const ISO_DAY = 'yyyy-MM-dd';

// Serialize the applied filter set to a URL query string, round-tripping the
// `period` date-range as `from`/`to` ISO params — the realistic reason a
// date-range filter exists inside FilterSearch: its state syncs to the address
// bar so a filtered view is shareable/bookmarkable.
function filtersToQuery(filters: Record<string, unknown>): string {
  const params = new URLSearchParams();
  if (typeof filters.status === 'string') params.set('status', filters.status);
  const period = filters.period as DateRange | undefined;
  if (period?.from) params.set('from', format(period.from, ISO_DAY));
  if (period?.to) params.set('to', format(period.to, ISO_DAY));
  return params.toString();
}

function queryToFilters(query: string): Record<string, unknown> {
  const params = new URLSearchParams(query);
  const next: Record<string, unknown> = {};
  const status = params.get('status');
  if (status) next.status = status;
  const from = params.get('from');
  const to = params.get('to');
  if (from || to) {
    next.period = {
      from: from ? parseISO(from) : undefined,
      to: to ? parseISO(to) : undefined,
    } satisfies DateRange;
  }
  return next;
}

function FilterSearchWithDateRangeExample() {
  // The URL query string is the source of truth; filters derive from it and
  // every change writes back to it (shown below — no real navigation).
  const [query, setQuery] = React.useState('from=2026-07-01&to=2026-07-15');
  const filters = React.useMemo(() => queryToFilters(query), [query]);
  const setFilters = (next: Record<string, unknown>) =>
    setQuery(filtersToQuery(next));
  return (
    <div className="flex flex-col gap-3">
      <FilterSearch>
        <Search
          placeholder="Enter text to filter"
          aria-label="Search"
          className="w-56"
        />
        <FilterSearchFilters
          value={filters}
          onValueChange={setFilters}
          label="Table filters"
        >
          <AlertsFilterFields />
        </FilterSearchFilters>
      </FilterSearch>
      <FilterSearchAppliedFilters
        filters={filters}
        onValueChange={setFilters}
        getFilterChipLabel={getAlertsFilterChipLabel}
      />
      <code className="text-xs text-muted-foreground">
        ?{query || '(empty)'}
      </code>
    </div>
  );
}

export const WithDateRangeFilter: Story = {
  name: 'With date-range filter field',
  render: () => <FilterSearchWithDateRangeExample />,
};

// Same composition as above, but the `play` opens the Filters popover AND the
// Period field's calendar so the popover-over-popover state is captured for VR —
// the initial (closed) render above never exercises the nested overlay. `fullPage`
// is required because both popovers portal outside `#storybook-root`.
export const WithDateRangeFilterOpen: Story = {
  name: 'With date-range filter field (open)',
  parameters: { snapshot: { fullPage: true, animationDelay: 400 } },
  render: () => <FilterSearchWithDateRangeExample />,
  play: async () => {
    const body = within(document.body);
    await userEvent.click(
      await body.findByRole('button', { name: 'Table filters' })
    );
    await userEvent.click(await body.findByRole('button', { name: 'Period' }));
    // Wait for the dual-month calendar (two grids) to paint inside the nested popover.
    await body.findAllByRole('grid');
  },
};

export const WithButtons: Story = {
  render: () => (
    <FilterSearch>
      <Select items={tenantItems} defaultValue="all">
        <SelectTrigger className="w-56">
          <BuildingIcon
            size={16}
            className="shrink-0 text-[var(--ui-input-select-normal-icon-expand-color-idle)]"
          />
          <SelectValue placeholder="All customers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All customers</SelectItem>
          <SelectItem value="acme">Acme Corp</SelectItem>
          <SelectItem value="globex">Globex Inc</SelectItem>
        </SelectContent>
      </Select>
      <Search placeholder="Placeholder" aria-label="Search" className="w-56" />
      <ButtonMenu variant="secondary">Table filters</ButtonMenu>
      <FilterSearchActions>
        <ButtonMenu variant="secondary">Label</ButtonMenu>
        <ButtonMenu variant="secondary">Label</ButtonMenu>
        <Button>Label</Button>
      </FilterSearchActions>
    </FilterSearch>
  ),
};
