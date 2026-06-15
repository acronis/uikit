import * as React from 'react';

import { cn } from '@/lib/utils';

// A single-line text input, themed by the dedicated next-gen `--ui-input-*` token
// tier from @acronis-platform/tokens-pd. The box fill (`global-box-*`) and the
// normal border (`normal-box-border-color-*`) are wired per state: idle / hover /
// focus (border `*-active` + a 3px `--ui-focus-primary` ring) / disabled. Value
// and placeholder text use `content-value-*` / `content-placeholder-*`. The error
// state is driven by `aria-invalid` — `error-box-border-color-*` border and, on
// focus, a `--ui-focus-error` ring — scoped with `not-aria-[invalid]` so it wins
// over the hover/focus border. Box geometry (32px height, 4px radius, 12px
// padding-x) comes from `--ui-input-global-box-*`. Label, description, and error
// message are composed by the consumer (a Field component is future work).
export type InputProps = React.ComponentPropsWithoutRef<'input'>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'h-[var(--ui-input-global-box-height)] w-full min-w-0 rounded-[var(--ui-input-global-box-border-radius)] border bg-[var(--ui-input-global-box-idle)] border-[var(--ui-input-normal-box-border-color-idle)] px-[var(--ui-input-global-box-padding-x)] text-sm leading-6 text-[var(--ui-input-content-value-idle)] transition-colors placeholder:text-[var(--ui-input-content-placeholder-idle)] focus-visible:outline-none focus-visible:ring-[3px] enabled:not-aria-[invalid=true]:hover:border-[var(--ui-input-normal-box-border-color-hover)] not-aria-[invalid=true]:focus-visible:border-[var(--ui-input-normal-box-border-color-active)] not-aria-[invalid=true]:focus-visible:ring-[var(--ui-focus-primary)] aria-[invalid=true]:border-[var(--ui-input-error-box-border-color-idle)] aria-[invalid=true]:focus-visible:ring-[var(--ui-focus-error)] disabled:cursor-not-allowed disabled:border-[var(--ui-input-normal-box-border-color-disabled)] disabled:bg-[var(--ui-input-global-box-disabled)] disabled:text-[var(--ui-input-content-value-disabled)] disabled:placeholder:text-[var(--ui-input-content-placeholder-disabled)]',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export { Input };
