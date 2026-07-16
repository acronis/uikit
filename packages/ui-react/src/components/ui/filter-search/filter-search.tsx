import * as React from 'react';
import { ChevronDownIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { deepEqual } from '@/lib/deep-equal';
import { Button } from '../button';
import { Chip } from '../chip';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

// A composable toolbar for data tables: arranges a search field, optional
// filters button, optional tenant/scope switcher, and trailing action buttons
// in a single horizontal row. Maps to the Figma "FilterSearch" component. The
// root container uses 16px inter-item gap (Figma `gap/gap-16`) and centers
// children vertically. `FilterSearchActions` is a right-aligned flex area that
// pushes its content to the trailing edge.
//
// No dedicated token tier — spacing is the Figma `gap/gap-16` semantic token
// (16px), and each child (Search, ButtonMenu, Select) brings its own
// `--ui-*` tier.
//
// `FilterSearchFilters` and `FilterSearchAppliedFilters` are design-pending
// additions (no Figma node yet, unlike the FilterSearch node itself): the
// filter popover (trigger + form + Reset/Cancel/Apply) and the applied-filter
// chip row + top-level "Reset filters" affordance. Compose `FilterSearchFilters`
// as a child of `<FilterSearch>` in place of a plain filter trigger, and render
// `<FilterSearchAppliedFilters>` as a sibling row below it. Reconcile against
// the real design with `/figma-component FilterSearchFilters <url> --update`
// once a mockup lands.

export type FilterSearchProps = React.ComponentPropsWithoutRef<'div'>;

const FilterSearch = React.forwardRef<HTMLDivElement, FilterSearchProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-4', className)}
      {...props}
    />
  )
);
FilterSearch.displayName = 'FilterSearch';

export type FilterSearchActionsProps = React.ComponentPropsWithoutRef<'div'>;

const FilterSearchActions = React.forwardRef<
  HTMLDivElement,
  FilterSearchActionsProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex h-8 min-w-px flex-1 items-center justify-end gap-4', className)}
    {...props}
  />
));
FilterSearchActions.displayName = 'FilterSearchActions';

interface FilterSearchFiltersContextValue {
  /** The current draft filters being edited inside the popover. */
  filters: Record<string, unknown>;
  /** Set a single draft filter value by key. */
  setFilter: (key: string, value: unknown) => void;
}

const FilterSearchFiltersContext =
  React.createContext<FilterSearchFiltersContextValue | null>(null);

/**
 * Bind a filter field child (rendered inside `FilterSearchFilters`'s popover) to
 * the component's draft filters. Returns the current draft map and a per-key
 * setter. Field children are plain JSX (no render prop) and wire their own
 * `onChange` to `setFilter`; Apply commits the draft, Cancel/dismiss reverts it.
 */
export function useFilterSearchFilters(): FilterSearchFiltersContextValue {
  const context = React.useContext(FilterSearchFiltersContext);
  if (context === null) {
    throw new Error(
      'useFilterSearchFilters must be used within a <FilterSearchFilters> popover.'
    );
  }
  return context;
}

export interface FilterSearchFiltersProps {
  /** The applied filter values, keyed by an arbitrary consumer-chosen id. */
  value: Record<string, unknown>;
  /** Called with the committed filters when Apply is pressed. */
  onValueChange: (next: Record<string, unknown>) => void;
  /** Called with the newly applied filters when Apply is pressed (fires alongside `onValueChange`). */
  onApply?: (filters: Record<string, unknown>) => void;
  /** Label for the filter trigger button. */
  label?: React.ReactNode;
  /**
   * Filter field children rendered inside the popover form. Plain children —
   * wire each field to the draft via `useFilterSearchFilters`. Group fields with
   * a `Separator` as a layout convention if desired.
   */
  children?: React.ReactNode;
  /** Additional classes merged onto the trigger button. */
  className?: string;
}

const FilterSearchFilters = React.forwardRef<
  HTMLButtonElement,
  FilterSearchFiltersProps
>(({ value, onValueChange, onApply, label = 'Filters', children, className }, ref) => {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Record<string, unknown>>(value);

  const handleOpenChange = (nextOpen: boolean) => {
    // Snapshot the applied filters on open; revert the draft on any dismiss
    // (outside press / Escape) so an un-applied edit never leaks out.
    setDraft(value);
    setOpen(nextOpen);
  };

  const setFilter = React.useCallback((key: string, filterValue: unknown) => {
    setDraft((previous) => {
      if (filterValue === undefined) {
        if (!(key in previous)) return previous;
        const next = { ...previous };
        delete next[key];
        return next;
      }
      return { ...previous, [key]: filterValue };
    });
  }, []);

  const filterContext = React.useMemo<FilterSearchFiltersContextValue>(
    () => ({ filters: draft, setFilter }),
    [draft, setFilter]
  );

  const handleReset = () => setDraft({});

  const handleCancel = () => {
    setDraft(value);
    setOpen(false);
  };

  const handleApply = () => {
    onValueChange(draft);
    onApply?.(draft);
    setOpen(false);
  };

  const resetDisabled = Object.keys(draft).length === 0;
  const applyDisabled = deepEqual(draft, value);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        ref={ref}
        render={
          <Button
            variant="secondary"
            className={cn(
              'group data-[popup-open]:border-[var(--ui-button-secondary-container-border-color-active)] data-[popup-open]:bg-[var(--ui-button-secondary-container-color-active)] data-[popup-open]:text-[var(--ui-button-secondary-label-color-active)]',
              className
            )}
          />
        }
      >
        {label}
        <ChevronDownIcon
          size={16}
          className="transition-transform group-data-[popup-open]:rotate-180"
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-96 p-0">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleApply();
          }}
        >
          <div className="flex max-h-80 flex-col gap-4 overflow-y-auto p-4">
            <FilterSearchFiltersContext.Provider value={filterContext}>
              {children}
            </FilterSearchFiltersContext.Provider>
          </div>
          <div className="flex items-center gap-2 border-t border-border p-4">
            <Button
              type="button"
              variant="ghost"
              disabled={resetDisabled}
              onClick={handleReset}
            >
              Reset filters
            </Button>
            <div className="ms-auto flex items-center gap-2">
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="default" disabled={applyDisabled}>
                Apply
              </Button>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
});
FilterSearchFilters.displayName = 'FilterSearchFilters';

function defaultFilterChipLabel(key: string, value: unknown): string {
  const text = Array.isArray(value)
    ? value.map((entry) => String(entry)).join(', ')
    : typeof value === 'object' && value !== null
      ? JSON.stringify(value)
      : String(value);
  return `${key}: ${text}`;
}

export interface FilterSearchAppliedFiltersProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  /** The currently applied filter values, keyed by an arbitrary consumer-chosen id. */
  filters: Record<string, unknown>;
  /** Called with the remaining filters when a chip is removed or "Reset filters" clears all. */
  onValueChange: (next: Record<string, unknown>) => void;
  /** Format an applied-filter chip's label. Defaults to `"<key>: <value>"`. */
  getFilterChipLabel?: (key: string, value: unknown) => React.ReactNode;
}

/**
 * Renders one removable chip per applied filter plus a "Reset filters" action
 * that clears all filters immediately (no popover involved). Renders nothing
 * when `filters` is empty.
 */
const FilterSearchAppliedFilters = React.forwardRef<
  HTMLDivElement,
  FilterSearchAppliedFiltersProps
>(({ className, filters, onValueChange, getFilterChipLabel, ...props }, ref) => {
  const keys = Object.keys(filters);
  if (keys.length === 0) return null;

  const handleRemove = (key: string) => {
    const next = { ...filters };
    delete next[key];
    onValueChange(next);
  };

  return (
    <div
      ref={ref}
      className={cn('flex flex-wrap items-center gap-3', className)}
      {...props}
    >
      {keys.map((key) => (
        <Chip
          key={key}
          variant="removable"
          onRemove={() => handleRemove(key)}
          removeLabel={`Remove ${key} filter`}
        >
          {getFilterChipLabel
            ? getFilterChipLabel(key, filters[key])
            : defaultFilterChipLabel(key, filters[key])}
        </Chip>
      ))}
      <Button
        type="button"
        variant="ghost"
        onClick={() => onValueChange({})}
      >
        Reset filters
      </Button>
    </div>
  );
});
FilterSearchAppliedFilters.displayName = 'FilterSearchAppliedFilters';

export {
  FilterSearch,
  FilterSearchActions,
  FilterSearchFilters,
  FilterSearchAppliedFilters,
};
