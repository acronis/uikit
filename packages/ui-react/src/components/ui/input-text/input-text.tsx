import * as React from 'react';
import { TimesIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { Input } from '../input';

// Mirrors the Figma "InputText" component: a full single-line text field built
// around the bare `Input` primitive (themed by the `--ui-input-text-*` tier). It
// adds the field furniture: an optional `label` (with an optional `required` `*`),
// an optional clear (✕) button, and an optional `description` or `error` message
// below. Passing `error` switches the field to its error treatment — the box gets
// the red error border (via the input's `aria-invalid` styling) and the red error
// message replaces the description. The clear button appears only while `clearable`
// is set and the (controlled) field has a value, and calls `onClear`. Colors come
// from the `--ui-input-text-*` tokens — label/required/description/error/clear — so
// brand overrides are honored; the clear button uses a 3px `--ui-focus-primary` ring.
export interface InputTextProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'children'> {
  /** Field label, rendered above the input. */
  label?: React.ReactNode;
  /** Marks the field required — appends a `*` after the label. */
  required?: boolean;
  /** Helper text below the input. Hidden while `error` is set. */
  description?: React.ReactNode;
  /**
   * Error message below the input. Its presence switches the field to the error
   * treatment (red box border + red message).
   */
  error?: React.ReactNode;
  /** Show a clear (✕) button while the (controlled) field has a value. */
  clearable?: boolean;
  /** Called when the clear button is activated. */
  onClear?: () => void;
}

const InputText = React.forwardRef<HTMLInputElement, InputTextProps>(
  (
    {
      className,
      id,
      label,
      required,
      description,
      error,
      clearable,
      onClear,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    const messageId = `${inputId}-message`;

    const hasError = error != null && error !== '';
    const hasValue = value != null && value !== '';
    const showClear = Boolean(clearable) && hasValue && !disabled;
    const message = hasError ? error : description;
    const hasMessage = message != null && message !== '';

    return (
      <div className="flex w-full min-w-[var(--ui-input-text-global-container-width-min)] flex-col gap-[var(--ui-input-text-global-container-gap)]">
        {label != null && label !== '' && (
          <label
            htmlFor={inputId}
            className={cn(
              'flex gap-[var(--ui-input-text-global-container-label-gap)] text-sm leading-4',
              disabled
                ? 'text-[var(--ui-input-text-global-label-color-disabled)]'
                : 'text-[var(--ui-input-text-global-label-color-idle)]'
            )}
          >
            {label}
            {required && (
              <span
                aria-hidden="true"
                className="text-[var(--ui-input-text-global-required-color)]"
              >
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            disabled={disabled}
            value={value}
            aria-invalid={hasError || undefined}
            aria-required={required || undefined}
            aria-describedby={hasMessage ? messageId : undefined}
            className={cn(showClear && 'pr-9', className)}
            {...props}
          />
          {showClear && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear"
              className="absolute right-[var(--ui-input-text-global-box-padding-x)] top-1/2 flex size-4 -translate-y-1/2 items-center justify-center rounded-[var(--ui-input-text-global-box-border-radius)] text-[var(--ui-input-text-global-clear-icon-color)] outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)] [&_svg]:size-4 [&_svg]:shrink-0"
            >
              <TimesIcon />
            </button>
          )}
        </div>

        {hasMessage && (
          <p
            id={messageId}
            className={cn(
              'text-xs leading-4',
              hasError
                ? 'text-[var(--ui-input-text-error-msg-error-color)]'
                : disabled
                  ? 'text-[var(--ui-input-text-normal-description-color-disabled)]'
                  : 'text-[var(--ui-input-text-normal-description-color-idle)]'
            )}
          >
            {message}
          </p>
        )}
      </div>
    );
  }
);
InputText.displayName = 'InputText';

export { InputText };
