'use client';

import { useState } from 'react';
import {
  BuildingIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import {
  FilterSearch,
  FilterSearchAppliedFilters,
  FilterSearchFilters,
  InputSelect,
  InputSelectContent,
  InputSelectField,
  InputSelectItem,
  InputSelectLabel,
  InputSelectTrigger,
  InputSelectValue,
  InputSearch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  useFilterSearchFilters,
} from '@acronis-platform/ui-react';

const TENANT_ITEMS = {
  all: 'All customers',
  acme: 'Acme Corp',
  globex: 'Globex Inc',
};

const TYPE_ITEMS = { all: 'All', device: 'Device', workload: 'Workload' };
const PRICING_ITEMS = { all: 'All', trial: 'Trial', paid: 'Paid' };
const STATUS_ITEMS = { all: 'All', active: 'Active', disabled: 'Disabled' };

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
      onValueChange={(next) => setFilter(filterKey, next === 'all' ? undefined : next)}
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

function DeviceFilterFields() {
  return (
    <>
      <SelectField filterKey="type" label="Type" items={TYPE_ITEMS} />
      <SelectField filterKey="pricingMode" label="Pricing mode" items={PRICING_ITEMS} />
      <Separator />
      <SelectField filterKey="status" label="Status" items={STATUS_ITEMS} />
    </>
  );
}

const FILTER_LABEL_BY_KEY: Record<string, string> = {
  type: 'Type',
  pricingMode: 'Pricing mode',
  status: 'Status',
};

export function FilterSearchDemo() {
  const [filters, setFilters] = useState<Record<string, unknown>>({
    pricingMode: 'trial',
  });

  return (
    <div className="flex flex-col gap-3">
      <FilterSearch>
        <Select items={TENANT_ITEMS} defaultValue="acme">
          <SelectTrigger className="w-56">
            <BuildingIcon size={16} className="shrink-0" />
            <SelectValue placeholder="All customers" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TENANT_ITEMS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <InputSearch
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
        getFilterChipLabel={(key, value) =>
          `${FILTER_LABEL_BY_KEY[key] ?? key}: ${String(value)}`
        }
      />
    </div>
  );
}
