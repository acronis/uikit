import * as React from 'react';
import { SearchIcon } from '@acronis-platform/icons-react/solid-mono';
import { TimesIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// A search field: a bordered box (the `--ui-form-*` token tier, like Input)
// holding a leading magnifier, a borderless native input, and a trailing clear
// button shown once there's a value. The box owns the visual state via
// `focus-within` (border `--ui-form-border-active` + a 3px `--ui-focus-primary`
// ring) / hover / disabled; the icons use `--ui-form-icon-idle` (and
// `--ui-form-icon-disabled` when disabled, via the `group`).

export interface SearchProps extends React.ComponentPropsWithoutRef<'input'> {
  /** Called when the clear (×) button is pressed, after the value is cleared. */
  onClear?: () => void;
}

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      className,
      type = 'search',
      disabled,
      onClear,
      onChange,
      value,
      defaultValue,
      ...props
    },
    forwardedRef
  ) => {
    const innerRef = React.useRef<HTMLInputElement>(null);
    const [hasValue, setHasValue] = React.useState(
      () => String(value ?? defaultValue ?? '').length > 0
    );

    // Keep the clear button in sync when the value is controlled externally.
    React.useEffect(() => {
      if (value !== undefined) setHasValue(String(value).length > 0);
    }, [value]);

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef]
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(event.target.value.length > 0);
      onChange?.(event);
    };

    const handleClear = () => {
      const input = innerRef.current;
      if (!input) return;
      // Use the native value setter + dispatch a real input event so React's
      // onChange fires for both controlled and uncontrolled usage.
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      setter?.call(input, '');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      setHasValue(false);
      input.focus();
      onClear?.();
    };

    return (
      <div
        data-disabled={disabled || undefined}
        className={cn(
          'group inline-flex h-8 w-full min-w-0 items-center gap-2 rounded border bg-[var(--ui-form-background-idle)] border-[var(--ui-form-border-idle)] px-3 text-sm leading-6 text-[var(--ui-form-text-value)] transition-colors not-data-[disabled]:hover:border-[var(--ui-form-border-hover)] focus-within:border-[var(--ui-form-border-active)] focus-within:ring-[3px] focus-within:ring-[var(--ui-focus-primary)] data-[disabled]:cursor-not-allowed data-[disabled]:border-[var(--ui-form-border-disabled)] data-[disabled]:bg-[var(--ui-form-background-disabled)] data-[disabled]:text-[var(--ui-form-text-disabled)]',
          className
        )}
      >
        <SearchIcon
          size={16}
          className="shrink-0 text-[var(--ui-form-icon-idle)] group-data-[disabled]:text-[var(--ui-form-icon-disabled)]"
        />
        <input
          ref={setRefs}
          type={type}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-inherit outline-none placeholder:text-[var(--ui-form-text-placeholder)] disabled:cursor-not-allowed [&::-webkit-search-cancel-button]:appearance-none"
          {...props}
        />
        {hasValue && !disabled && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm text-[var(--ui-form-icon-idle)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] [&>svg]:size-4"
          >
            <TimesIcon size={16} />
          </button>
        )}
      </div>
    );
  }
);
Search.displayName = 'Search';

export { Search };
