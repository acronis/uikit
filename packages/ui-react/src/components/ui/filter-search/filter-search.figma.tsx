// Figma Code Connect — status: COMPLETE
// Mapped to the "FilterSearch" component in the ui-react Figma file.
// Props: hasTenants (bool), hasFilters (bool), ListActions (slot).
//
// The Figma node's own props only toggle visibility of the tenant switcher,
// filters trigger, and actions slot — it does not model the filter popover's
// fields or the applied-filter chips (see the two NEEDS_FIGMA_URL skeletons
// below, for FilterSearchFilters and FilterSearchAppliedFilters).
import * as React from 'react';
import figma from '@figma/code-connect';

import {
  FilterSearch,
  FilterSearchActions,
  FilterSearchAppliedFilters,
  FilterSearchFilters,
} from './filter-search';
import { InputSearch as Search } from '../input-search/input-search';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../select/select';

figma.connect(
  FilterSearch,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3897-7681',
  {
    props: {
      tenantSelect: figma.boolean('hasTenants', {
        true: (
          <Select defaultValue="all">
            <SelectTrigger className="w-56">
              <SelectValue placeholder="All customers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All customers</SelectItem>
            </SelectContent>
          </Select>
        ),
        false: undefined,
      }),
      filters: figma.boolean('hasFilters', {
        true: (
          <FilterSearchFilters value={{}} onValueChange={() => {}} label="Table filters">
            {/* consumer-supplied filter fields, wired via useFilterSearchFilters */}
          </FilterSearchFilters>
        ),
        false: undefined,
      }),
      actions: figma.children('ListActions'),
    },
    example: ({ tenantSelect, filters, actions }: { tenantSelect: React.ReactNode; filters: React.ReactNode; actions: React.ReactNode }) => (
      <FilterSearch>
        {tenantSelect}
        <Search placeholder="Placeholder" aria-label="Search" className="w-56" />
        {filters}
        <FilterSearchActions>{actions}</FilterSearchActions>
      </FilterSearch>
    ),
  }
);

// Figma Code Connect — status: NEEDS_FIGMA_URL
// The filter popover has no "ready for dev" node yet — placeholder URL below.
figma.connect(FilterSearchFilters, 'FIGMA_NODE_URL', {
  props: {
    label: figma.string('label'),
  },
  example: ({ label }: { label: string }) => (
    <FilterSearchFilters value={{}} onValueChange={() => {}} label={label}>
      {/* consumer-supplied filter fields, wired via useFilterSearchFilters */}
    </FilterSearchFilters>
  ),
});

// Figma Code Connect — status: NEEDS_FIGMA_URL
// The applied-filter chip row has no "ready for dev" node yet — placeholder URL below.
figma.connect(FilterSearchAppliedFilters, 'FIGMA_NODE_URL', {
  example: () => (
    <FilterSearchAppliedFilters filters={{}} onValueChange={() => {}} />
  ),
});
