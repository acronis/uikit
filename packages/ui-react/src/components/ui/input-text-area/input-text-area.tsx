import * as React from 'react';

import { cn } from '@/lib/utils';

// Mirrors the Figma "InputTextArea" component: a full multiline text field built
// around a `<textarea>` (themed by the dedicated `--ui-input-text-area-*` tier). It
// adds the field furniture: an optional `label` (with an optional required `*`) and
// an optional `description` or `error` message below. Passing `error` switches the
// field to its error treatment — the box gets the red error border (via the
// textarea's `aria-invalid` styling) and the red error message replaces the
// description. The box fill / border are wired per state: idle / hover / focus
// (`border-color-focus` + a 3px `--ui-focus-primary` ring) / disabled; the error
// state (driven by `aria-invalid`) swaps the border to
// `error-msg-box-border-color-{idle,hover}` and the focus ring to `--ui-focus-error`.
// Box geometry (96px min-height, 4px radius, 12px padding-x, 8px padding-y) comes
// from `--ui-input-text-area-box-*`; it grows with vertical resize. `ref` and
// `className` target the underlying `<textarea>`, so the bare usage
// (`<InputTextArea placeholder=… />`, no label) renders just the box.
export interface InputTextAreaProps
  extends Omit<React.ComponentPropsWithoutRef<'textarea'>, 'children'> {
  /** Field label, rendered above the textarea. */
  label?: React.ReactNode;
  /** Marks the field required — appends a `*` after the label. */
  required?: boolean;
  /** Helper text below the textarea. Hidden while `error` is set. */
  description?: React.ReactNode;
  /**
   * Error message below the textarea. Its presence switches the field to the error
   * treatment (red box border + red message).
   */
  error?: React.ReactNode;
}

const InputTextArea = React.forwardRef<HTMLTextAreaElement, InputTextAreaProps>(
  (
    {
      className,
      id,
      label,
      required,
      description,
      error,
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

    return (
      <div className="flex w-full min-w-[var(--ui-input-text-area-container-width-min)] flex-col gap-[var(--ui-input-text-area-container-gap)]">
        {label != null && label !== '' && (
          <label
            htmlFor={inputId}
            className={cn(
              'flex gap-[var(--ui-input-text-area-container-label-gap)] text-sm leading-4',
              disabled
                ? 'text-[var(--ui-input-text-area-label-color-disabled)]'
                : 'text-[var(--ui-input-text-area-label-color-idle)]'
            )}
          >
            {label}
            {required && (
              <span
                aria-hidden="true"
                className="text-[var(--ui-input-text-area-required-color)]"
              >
                *
              </span>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          className={cn(
            'min-h-[var(--ui-input-text-area-box-height-min)] w-full min-w-0 resize-y rounded-[var(--ui-input-text-area-box-border-radius)] border bg-[var(--ui-input-text-area-box-color-idle)] border-[var(--ui-input-text-area-border-color-idle)] px-[var(--ui-input-text-area-box-padding-x)] py-[var(--ui-input-text-area-box-padding-y)] text-sm leading-6 text-[var(--ui-input-text-area-value-color-idle)] transition-colors placeholder:text-[var(--ui-input-text-area-placeholder-color-idle)] focus-visible:outline-none focus-visible:ring-[3px]',
            'enabled:not-aria-[invalid=true]:hover:bg-[var(--ui-input-text-area-box-color-hover)] enabled:not-aria-[invalid=true]:hover:border-[var(--ui-input-text-area-border-color-hover)] enabled:hover:text-[var(--ui-input-text-area-value-color-hover)] enabled:hover:placeholder:text-[var(--ui-input-text-area-placeholder-color-hover)]',
            'not-aria-[invalid=true]:focus-visible:border-[var(--ui-input-text-area-border-color-focus)] not-aria-[invalid=true]:focus-visible:ring-[var(--ui-focus-primary)]',
            'aria-[invalid=true]:border-[var(--ui-input-text-area-error-msg-box-border-color-idle)] enabled:aria-[invalid=true]:hover:border-[var(--ui-input-text-area-error-msg-box-border-color-hover)] aria-[invalid=true]:focus-visible:border-[var(--ui-input-text-area-error-msg-box-border-color-hover)] aria-[invalid=true]:focus-visible:ring-[var(--ui-focus-error)]',
            'disabled:cursor-not-allowed disabled:border-[var(--ui-input-text-area-border-color-disabled)] disabled:bg-[var(--ui-input-text-area-box-color-disabled)] disabled:text-[var(--ui-input-text-area-value-color-disabled)] disabled:placeholder:text-[var(--ui-input-text-area-placeholder-color-disabled)]',
            className
          )}
          {...props}
        />

        {hasMessage && (
          <p
            id={messageId}
            className={cn(
              'text-xs leading-4',
              hasError
                ? 'text-[var(--ui-input-text-area-error-msg-error-color)]'
                : disabled
                  ? 'text-[var(--ui-input-text-area-description-color-disabled)]'
                  : 'text-[var(--ui-input-text-area-description-color-idle)]'
            )}
          >
            {message}
          </p>
        )}
      </div>
    );
  }
);
InputTextArea.displayName = 'InputTextArea';

export { InputTextArea };
