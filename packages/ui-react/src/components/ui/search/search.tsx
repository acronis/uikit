import * as React from 'react';
import {
  MagnifierIcon,
  TimesIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Internal primitive: the bare search box behind the public `InputSearch` field
// (which is also exported as `Search`). Not exported from the package; consumed
// by `input-search`. A bordered box (the dedicated `--ui-input-search-*` token
// tier) holding a leading magnifier, a borderless native input, and a trailing
// clear button shown once there's a value. The box owns the visual state via
// `focus-within` (the input-search tier has no focus/active border token, so the
// focused border reuses `--ui-input-search-border-color-hover` plus a 3px
// `--ui-focus-primary` ring) / hover / disabled; the magnifier uses
// `--ui-input-search-icon-search-color-{idle,disabled}` (via the `group`) and the
// clear button uses `--ui-input-search-clear-icon-color`.

export interface SearchBoxProps extends React.ComponentPropsWithoutRef<'input'> {
  /** Called when the clear (×) button is pressed, after the value is cleared. */
  onClear?: () => void;
}

const SearchBox = React.forwardRef<HTMLInputElement, SearchBoxProps>(
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
      // Use the native value setter when available + dispatch a real input event
      // so React's onChange fires for both controlled and uncontrolled usage.
      let setter: ((this: HTMLInputElement, value: string) => void) | undefined;
      try {
        setter = Object.getOwnPropertyDescriptor(
          globalThis.HTMLInputElement?.prototype,
          'value'
        )?.set;
      } catch {
        setter = undefined;
      }

      if (setter) setter.call(input, '');
      else input.value = '';

      input.dispatchEvent(new Event('input', { bubbles: true }));
      setHasValue(false);
      input.focus();
      onClear?.();
    };

    return (
      <div
        data-disabled={disabled || undefined}
        className={cn(
          'group inline-flex h-[var(--ui-input-search-box-height)] w-full min-w-0 items-center gap-[var(--ui-input-search-box-gap)] rounded-[var(--ui-input-search-box-border-radius)] border bg-[var(--ui-input-search-box-color-idle)] border-[var(--ui-input-search-border-color-idle)] px-[var(--ui-input-search-box-padding-x)] text-sm leading-6 text-[var(--ui-input-search-value-color-idle)] transition-colors not-data-[disabled]:hover:bg-[var(--ui-input-search-box-color-hover)] not-data-[disabled]:hover:border-[var(--ui-input-search-border-color-hover)] focus-within:border-[var(--ui-input-search-border-color-hover)] focus-within:ring-[3px] focus-within:ring-[var(--ui-focus-primary)] data-[disabled]:cursor-not-allowed data-[disabled]:border-[var(--ui-input-search-border-color-disabled)] data-[disabled]:bg-[var(--ui-input-search-box-color-disabled)] data-[disabled]:text-[var(--ui-input-search-value-color-disabled)]',
          className
        )}
      >
        <MagnifierIcon
          size={16}
          className="shrink-0 text-[var(--ui-input-search-icon-search-color-idle)] group-data-[disabled]:text-[var(--ui-input-search-icon-search-color-disabled)]"
        />
        <input
          ref={setRefs}
          type={type}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-label="Search"
          className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-inherit outline-none placeholder:text-[var(--ui-input-search-placeholder-color-idle)] disabled:cursor-not-allowed [&::-webkit-search-cancel-button]:appearance-none"
          {...props}
        />
        {hasValue && !disabled && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm text-[var(--ui-input-search-clear-icon-color)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)] [&>svg]:size-4"
          >
            <TimesIcon size={16} />
          </button>
        )}
      </div>
    );
  }
);
SearchBox.displayName = 'SearchBox';

export { SearchBox };
