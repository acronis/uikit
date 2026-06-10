import * as React from 'react';

import { cn } from '@/lib/utils';

// A single-line text input. Colors and geometry come from the shared
// `--ui-form-*` token tier from @acronis-platform/tokens-pd (the same tier the
// checkbox uses). Each state is wired to its own token: idle / hover / focus
// (border `--ui-form-border-active` + a 3px `--ui-focus-primary` ring) /
// disabled. The error state is driven by `aria-invalid` — red border and, on
// focus, a `--ui-focus-error` ring — and is scoped with `not-aria-[invalid]` so
// it wins over the hover/focus border. Label, description, and error message
// are composed by the consumer (a Field component is future work).
export type InputProps = React.ComponentPropsWithoutRef<'input'>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'h-8 w-full min-w-0 rounded border bg-[var(--ui-form-background-idle)] border-[var(--ui-form-border-idle)] px-3 text-sm leading-6 text-[var(--ui-form-text-value)] transition-colors placeholder:text-[var(--ui-form-text-placeholder)] focus-visible:outline-none focus-visible:ring-[3px] enabled:not-aria-[invalid=true]:hover:border-[var(--ui-form-border-hover)] not-aria-[invalid=true]:focus-visible:border-[var(--ui-form-border-active)] not-aria-[invalid=true]:focus-visible:ring-[var(--ui-focus-primary)] aria-[invalid=true]:border-[var(--ui-form-border-error)] aria-[invalid=true]:focus-visible:ring-[var(--ui-focus-error)] disabled:cursor-not-allowed disabled:border-[var(--ui-form-border-disabled)] disabled:bg-[var(--ui-form-background-disabled)] disabled:text-[var(--ui-form-text-disabled)]',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export { Input };
