import type { ReactNode } from 'react';
import type { Table } from '@tanstack/react-table';

import { Button } from '../button';
import { isBulkSelectionActive } from './data-table-selection';

interface DataTableBulkActionsBarProps<TData> {
  table: Table<TData>;
  /**
   * Bulk actions offered for the current selection — rendered leading, ahead
   * of the trailing summary/Deselect control. Wrapped in a native `<fieldset
   * disabled>` while nothing is selected, so every nested control (a `Button`
   * renders a plain `<button>`) picks up the disabled state and styling for
   * free — no per-action wiring needed. Each action reads the selection off
   * the same `table` instance (`table.getSelectedRowModel().rows`).
   */
  children?: ReactNode;
  /** Builds the trailing selection summary from the selected-row count. */
  selectedLabel?: (count: number) => string;
  /** Label of the trailing control that clears the selection. */
  clearLabel?: string;
  /**
   * Trailing summary shown in place of the selection summary while nothing is
   * selected — e.g. `"25 of 1250 items loaded"`. Omit to render nothing in
   * that state.
   */
  loadedLabel?: ReactNode;
}

// Thin TanStack adapter: reads the selected-row count off
// `table.getSelectedRowModel()` and routes Deselect back through
// `table.resetRowSelection()`. It owns no state of its own.
//
// Always mounted (unlike a bar that appears/disappears with selection) — it
// just toggles between two states (Figma 5916-11286 disabled / 5916-11991
// enabled), on the same `isBulkSelectionActive` threshold that hides the
// per-row actions column: with nothing selected, the leading actions are
// disabled and the trailing side shows `loadedLabel`; once at least one row
// is selected — including exactly one — the actions enable and the trailing
// side switches to the selection summary + Deselect.
export function DataTableBulkActionsBar<TData>({
  table,
  children,
  selectedLabel = (count) => `${count} item${count === 1 ? '' : 's'} selected:`,
  clearLabel = 'Deselect',
  loadedLabel,
}: DataTableBulkActionsBarProps<TData>) {
  const selectedCount = table.getSelectedRowModel().rows.length;
  const hasSelection = isBulkSelectionActive(table);

  return (
    <div className="flex items-center gap-4">
      <fieldset
        disabled={!hasSelection}
        className="m-0 flex min-w-0 items-center gap-4 border-0 p-0"
      >
        {children}
      </fieldset>
      <div className="ms-auto flex items-center gap-2">
        {hasSelection ? (
          <>
            <span className="text-sm">{selectedLabel(selectedCount)}</span>
            <Button
              variant="ghost"
              className="h-8"
              onClick={() => table.resetRowSelection()}
            >
              {clearLabel}
            </Button>
          </>
        ) : (
          loadedLabel !== undefined && (
            <span className="text-sm text-muted-foreground">{loadedLabel}</span>
          )
        )}
      </div>
    </div>
  );
}
