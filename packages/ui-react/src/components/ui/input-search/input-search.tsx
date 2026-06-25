import * as React from 'react';

import { cn } from '@/lib/utils';
import { Search, type SearchProps } from '../search';

// Mirrors the Figma "InputSearch" component: a full search field built around the
// bare `Search` box (themed by the `--ui-input-search-*` tier). It adds the field
// furniture — an optional `label` above the box (with an optional `required` `*`).
// Every other prop (placeholder, value, onClear, disabled, …) passes straight
// through to `Search`. Label colors come from `--ui-input-search-color-{idle,disabled}`
// and the required marker from `--ui-input-search-required-color`, so brand overrides
// are honored. When a visible label is present it names the field via `htmlFor`/`id`,
// and `Search`'s built-in `aria-label="Search"` is cleared so it doesn't shadow the
// visible label.
export interface InputSearchProps extends SearchProps {
  /** Field label, rendered above the search box. */
  label?: React.ReactNode;
  /** Marks the field required — appends a `*` after the label. */
  required?: boolean;
}

const InputSearch = React.forwardRef<HTMLInputElement, InputSearchProps>(
  (
    {
      className,
      id,
      label,
      required,
      disabled,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    const hasLabel = label != null && label !== '';

    // A visible label names the field via `htmlFor`/`id`, so clear `Search`'s
    // default `aria-label`. With no label, forward the caller's `aria-label` (if
    // any) and otherwise let `Search`'s default stand.
    const ariaLabelProps = hasLabel
      ? { 'aria-label': undefined }
      : ariaLabel != null
        ? { 'aria-label': ariaLabel }
        : {};

    return (
      <div className="flex w-full min-w-[var(--ui-input-search-container-width-min)] flex-col gap-[var(--ui-input-search-container-gap)]">
        {hasLabel && (
          <label
            htmlFor={inputId}
            className={cn(
              'flex gap-[var(--ui-input-search-container-label-gap)] text-sm leading-4',
              disabled
                ? 'text-[var(--ui-input-search-color-disabled)]'
                : 'text-[var(--ui-input-search-color-idle)]'
            )}
          >
            {label}
            {required && (
              <span
                aria-hidden="true"
                className="text-[var(--ui-input-search-required-color)]"
              >
                *
              </span>
            )}
          </label>
        )}
        <Search
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-required={required || undefined}
          className={className}
          {...ariaLabelProps}
          {...props}
        />
      </div>
    );
  }
);
InputSearch.displayName = 'InputSearch';

export { InputSearch };
