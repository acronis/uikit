import * as React from 'react';
import type { DateRange as RdpDateRange } from 'react-day-picker';

import { Button } from '../button';
import { Calendar } from '../calendar';
import { InputDatePicker } from '../input-date-picker';
import { InputText } from '../input-text';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import {
  DISPLAY_FORMAT,
  formatDate,
  normalizeRange,
  parseDate,
  rangesEqual,
  type DateRange,
} from './date-range-picker-utils';

export type { DateRange };

// One of the two editable start/end fields. Kept internal (only ever used twice,
// here) — it wires an `InputText` to the draft: typing echoes verbatim into the
// field via `onTextChange` (so a partial mid-type value isn't reformatted), and a
// successfully parsed date is forwarded via `onParsedChange`.
function DateField({
  label,
  text,
  onTextChange,
  onParsedChange,
}: {
  label: string;
  text: string;
  onTextChange: (text: string) => void;
  onParsedChange: (date: Date | undefined) => void;
}) {
  return (
    <InputText
      aria-label={label}
      value={text}
      placeholder={DISPLAY_FORMAT}
      onChange={(event) => {
        const next = event.target.value;
        onTextChange(next);

        if (next.trim() === '') {
          onParsedChange(undefined);
          return;
        }

        const parsed = parseDate(next);
        if (parsed) {
          onParsedChange(parsed);
        }
      }}
    />
  );
}

// A range date picker: the `InputDatePicker` trigger (pickerType="dateRange")
// opens a Popover holding a dual-month range `Calendar`, two editable start/end
// date fields bound to the in-progress draft, and a Reset / Apply footer. Mirrors
// the draft/commit/revert idiom of `FilterSearchFilters`: the applied range is
// snapshotted into a draft on open; editing (calendar or text fields) mutates only
// the draft; dismissing the popover (outside press / Escape) reverts the draft, and
// only Apply commits it via `onValueChange` and closes.
//
// No dedicated token tier — the trigger brings `--ui-input-date-picker-*`, the
// Calendar / Popover / Buttons bring their own semantic tokens. Reconcile with
// `/figma-component DateRangePicker <url> --update` once a mockup lands.

export interface DateRangePickerProps {
  /** The applied range (controlled). Omit for uncontrolled use with `defaultValue`. */
  value?: DateRange;
  /** The initial applied range (uncontrolled) and the target of "Reset to default". */
  defaultValue?: DateRange;
  /** Called with the committed range when Apply is pressed. */
  onValueChange?: (range: DateRange) => void;
  /** Field label for the trigger. */
  label?: React.ReactNode;
  /** Helper text below the trigger. */
  description?: React.ReactNode;
  /** Error message below the trigger (switches the trigger to its error treatment). */
  error?: React.ReactNode;
  /** Hint shown in the trigger when no range is selected. */
  placeholder?: React.ReactNode;
  /** Disables the trigger and prevents opening the popover. */
  disabled?: boolean;
  /** Marks the trigger required. */
  required?: boolean;
  /** Extra classes merged onto the trigger. */
  className?: string;
}

const DateRangePicker = React.forwardRef<
  HTMLButtonElement,
  DateRangePickerProps
>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      label,
      description,
      error,
      placeholder,
      disabled,
      required,
      className,
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internalApplied, setInternalApplied] = React.useState<DateRange>(
      defaultValue ?? {}
    );
    const applied = isControlled ? (value as DateRange) : internalApplied;

    const [open, setOpen] = React.useState(false);
    const [draft, setDraft] = React.useState<DateRange>(applied);

    const [fromText, setFromText] = React.useState(formatDate(applied.from));
    const [toText, setToText] = React.useState(formatDate(applied.to));

    // Sync the editable fields from a range whenever the draft changes for a
    // reason OTHER than the user typing (open / calendar click / reset). We do
    // NOT resync on every draft change: a `[draft]` effect would rewrite the
    // field mid-type (e.g. a partial year "2" parses, then gets echoed back
    // zero-padded as "0002"), scrambling further keystrokes.
    const syncFieldsFrom = (range: DateRange) => {
      setFromText(formatDate(range.from));
      setToText(formatDate(range.to));
    };

    const handleOpenChange = (nextOpen: boolean) => {
      // Snapshot the applied range on open; revert the draft on any dismiss
      // (outside press / Escape) so an un-applied edit never leaks out.
      setDraft(applied);
      syncFieldsFrom(applied);
      setOpen(nextOpen);
    };

    const handleReset = () => {
      const next = defaultValue ?? {};
      setDraft(next);
      syncFieldsFrom(next);
    };

    const handleApply = () => {
      // Commit chronologically ordered so a typed end-before-start range is
      // normalized rather than committed inverted.
      const committed = normalizeRange(draft);
      if (!isControlled) setInternalApplied(committed);
      onValueChange?.(committed);
      setOpen(false);
    };

    // Feed the calendar a normalized range so a typed inverted range still
    // highlights the correct band (the editable fields keep the raw typed text).
    // react-day-picker's `DateRange` requires `from`, so a to-only draft (end
    // typed before start) is fed as a single selected day at `to` — otherwise
    // `selected` would be `undefined` and the next calendar click would start a
    // fresh range instead of completing this one, discarding the typed end date.
    const normalizedDraft = normalizeRange(draft);
    let selectedRange: RdpDateRange | undefined;
    if (normalizedDraft.from) {
      selectedRange = { from: normalizedDraft.from, to: normalizedDraft.to };
    } else if (normalizedDraft.to) {
      selectedRange = { from: normalizedDraft.to, to: normalizedDraft.to };
    }

    const handleSelect = (range: RdpDateRange | undefined) => {
      const next = { from: range?.from, to: range?.to };
      setDraft(next);
      syncFieldsFrom(next);
    };

    const applyDisabled = rangesEqual(draft, applied);
    const resetDisabled = rangesEqual(draft, defaultValue ?? {});

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={
            <InputDatePicker
              ref={ref}
              pickerType="dateRange"
              label={label}
              description={description}
              error={error}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              startDate={formatDate(applied.from)}
              endDate={formatDate(applied.to)}
              open={open}
              className={className}
            />
          }
        />
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={selectedRange}
            onSelect={handleSelect}
            defaultMonth={draft.from ?? applied.from}
          />
          <div className="flex items-end gap-2 border-t border-border p-3">
            <DateField
              label="Start date"
              text={fromText}
              onTextChange={setFromText}
              onParsedChange={(parsed) =>
                setDraft((previous) => ({ ...previous, from: parsed }))
              }
            />
            <span className="pb-2 text-muted-foreground">–</span>
            <DateField
              label="End date"
              text={toText}
              onTextChange={setToText}
              onParsedChange={(parsed) =>
                setDraft((previous) => ({ ...previous, to: parsed }))
              }
            />
          </div>
          <div className="flex items-center gap-2 border-t border-border p-3">
            <Button
              type="button"
              variant="ghost"
              disabled={resetDisabled}
              onClick={handleReset}
            >
              Reset to default
            </Button>
            <Button
              type="button"
              variant="default"
              className="ms-auto"
              disabled={applyDisabled}
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);
DateRangePicker.displayName = 'DateRangePicker';

export { DateRangePicker };
