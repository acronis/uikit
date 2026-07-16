import * as React from 'react';
import { CalendarIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Mirrors the Figma "InputDatePicker" component: the date-field **trigger** — a
// button box that displays a formatted date `value` (or a `startDate – endDate`
// range when `pickerType="dateRange"`) and a trailing calendar icon, with the field
// furniture (optional `label` + required `*`, optional `description` / `error`).
// Themed by the `--ui-input-date-picker-*` tier. The box border is wired per state:
// idle / hover / open (`open` → `-active`) / focus (`-active` + a 3px
// `--ui-focus-primary` ring) / disabled; `error` (or `aria-invalid`) swaps the
// border to `error-box-border-color-*` and the ring to `--ui-focus-error`.
//
// This is the trigger only — the calendar popup is NOT in the Figma design or the
// token tier yet, so the consumer renders the date `value`/range as formatted
// strings and wires their own calendar to `open` / `onClick`.
export interface InputDatePickerProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'value'> {
  /** Field label, rendered above the box. */
  label?: React.ReactNode;
  /** Marks the field required — appends a `*` after the label. */
  required?: boolean;
  /** Helper text below the box. Hidden while `error` is set. */
  description?: React.ReactNode;
  /** Error message below the box. Its presence switches the field to the error treatment. */
  error?: React.ReactNode;
  /** Single date or a start–end range. */
  pickerType?: 'date' | 'dateRange';
  /** Hint shown when no value is selected. */
  placeholder?: React.ReactNode;
  /** Formatted selected date (`pickerType="date"`). */
  value?: React.ReactNode;
  /** Formatted range start (`pickerType="dateRange"`). */
  startDate?: React.ReactNode;
  /** Formatted range end (`pickerType="dateRange"`). */
  endDate?: React.ReactNode;
  /** Separator between range dates. */
  separator?: React.ReactNode;
  /** Whether the (consumer-owned) calendar popup is open — paints the active border. */
  open?: boolean;
}

const InputDatePicker = React.forwardRef<HTMLButtonElement, InputDatePickerProps>(
  (
    {
      className,
      id,
      label,
      required,
      description,
      error,
      pickerType = 'date',
      placeholder,
      value,
      startDate,
      endDate,
      separator = '–',
      open,
      disabled,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref
  ) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    const messageId = `${inputId}-message`;

    const hasError = error != null && error !== '';
    const invalid = hasError || ariaInvalid;
    const message = hasError ? error : description;
    const hasMessage = message != null && message !== '';

    const isRange = pickerType === 'dateRange';
    const hasValue = isRange
      ? (startDate != null && startDate !== '') ||
        (endDate != null && endDate !== '')
      : value != null && value !== '';

    return (
      <div className="flex w-full min-w-[var(--ui-input-date-picker-global-container-width-min)] flex-col gap-[var(--ui-input-date-picker-global-container-gap)]">
        {label != null && label !== '' && (
          <label
            htmlFor={inputId}
            className={cn(
              'flex gap-[var(--ui-input-date-picker-global-container-label-gap)] text-sm leading-4',
              disabled
                ? 'text-[var(--ui-input-date-picker-global-label-color-disabled)]'
                : 'text-[var(--ui-input-date-picker-global-label-color-idle)]'
            )}
          >
            {label}
            {required && (
              <span
                aria-hidden="true"
                className="text-[var(--ui-input-date-picker-global-required-color)]"
              >
                *
              </span>
            )}
          </label>
        )}

        <button
          ref={ref}
          id={inputId}
          type="button"
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          aria-haspopup="dialog"
          aria-expanded={open || undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          data-open={open || undefined}
          className={cn(
            'group flex h-[var(--ui-input-date-picker-global-box-height)] w-full min-w-0 cursor-pointer items-center gap-[var(--ui-input-date-picker-global-box-gap)] rounded-[var(--ui-input-date-picker-global-box-border-radius)] border bg-[var(--ui-input-date-picker-global-box-color-idle)] border-[var(--ui-input-date-picker-normal-box-border-color-idle)] px-[var(--ui-input-date-picker-global-box-padding-x)] text-start text-sm leading-6 text-[var(--ui-input-date-picker-global-value-color-idle)] outline-none transition-colors',
            'enabled:not-aria-[invalid=true]:hover:bg-[var(--ui-input-date-picker-global-box-color-hover)] enabled:not-aria-[invalid=true]:hover:border-[var(--ui-input-date-picker-normal-box-border-color-hover)]',
            'not-aria-[invalid=true]:data-[open]:border-[var(--ui-input-date-picker-normal-box-border-color-active)]',
            'not-aria-[invalid=true]:focus-visible:border-[var(--ui-input-date-picker-normal-box-border-color-active)] not-aria-[invalid=true]:focus-visible:ring-[3px] not-aria-[invalid=true]:focus-visible:ring-[var(--ui-focus-primary)]',
            'aria-[invalid=true]:border-[var(--ui-input-date-picker-error-box-border-color-idle)] enabled:aria-[invalid=true]:hover:border-[var(--ui-input-date-picker-error-box-border-color-hover)] aria-[invalid=true]:data-[open]:border-[var(--ui-input-date-picker-error-box-border-color-active)] aria-[invalid=true]:focus-visible:border-[var(--ui-input-date-picker-error-box-border-color-active)] aria-[invalid=true]:focus-visible:ring-[3px] aria-[invalid=true]:focus-visible:ring-[var(--ui-focus-error)]',
            'disabled:cursor-not-allowed disabled:border-[var(--ui-input-date-picker-normal-box-border-color-disabled)] disabled:bg-[var(--ui-input-date-picker-global-box-color-disabled)] disabled:text-[var(--ui-input-date-picker-global-value-color-disabled)]',
            className
          )}
          {...props}
        >
          {hasValue ? (
            isRange ? (
              <span className="flex min-w-0 flex-1 items-center gap-[var(--ui-input-date-picker-global-box-gap-range)] truncate">
                <span>{startDate}</span>
                <span className="text-[var(--ui-input-date-picker-global-separator-color-idle)] group-disabled:text-[var(--ui-input-date-picker-global-separator-color-disabled)]">
                  {separator}
                </span>
                <span>{endDate}</span>
              </span>
            ) : (
              <span className="min-w-0 flex-1 truncate">{value}</span>
            )
          ) : (
            <span className="min-w-0 flex-1 truncate text-[var(--ui-input-date-picker-global-placeholder-color-idle)] group-disabled:text-[var(--ui-input-date-picker-global-placeholder-color-disabled)]">
              {placeholder}
            </span>
          )}
          <CalendarIcon
            size={16}
            className="shrink-0 text-[var(--ui-input-date-picker-normal-icon-color-idle)] group-disabled:text-[var(--ui-input-date-picker-normal-icon-color-disabled)] group-aria-[invalid=true]:text-[var(--ui-input-date-picker-error-icon-color-idle)]"
          />
        </button>

        {hasMessage && (
          <p
            id={messageId}
            className={cn(
              'text-xs leading-4',
              hasError
                ? 'text-[var(--ui-input-date-picker-error-error-msg-color)]'
                : disabled
                  ? 'text-[var(--ui-input-date-picker-normal-description-color-disabled)]'
                  : 'text-[var(--ui-input-date-picker-normal-description-color-idle)]'
            )}
          >
            {message}
          </p>
        )}
      </div>
    );
  }
);
InputDatePicker.displayName = 'InputDatePicker';

export { InputDatePicker };
