import * as React from 'react';

import { cn } from '@/lib/utils';

// A single-line text input, themed by the dedicated next-gen `--ui-input-text-*`
// token tier from @acronis-platform/tokens-pd. The box fill (`global-box-color-*`)
// and the normal border (`normal-box-border-color-*`) are wired per state: idle /
// hover / focus / disabled. The `normal-box-border-color-*` tier has no `-active`,
// so focus reuses `-hover` for the border, paired with a 3px `--ui-focus-primary`
// ring. Value and placeholder text use `global-value-color-*` /
// `global-placeholder-color-*`. The error state is driven by `aria-invalid` —
// `error-msg-box-border-color-*` border and, on focus, a `--ui-focus-error` ring —
// scoped with `not-aria-[invalid]` so it wins over the hover/focus border. Box
// geometry (32px height, 4px radius, 12px padding-x) comes from
// `--ui-input-text-global-box-*`. Label, description, and error message are
// composed by the consumer (a Field component is future work).
export type InputProps = React.ComponentPropsWithoutRef<'input'>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'h-[var(--ui-input-text-global-box-height)] w-full min-w-0 rounded-[var(--ui-input-text-global-box-border-radius)] border bg-[var(--ui-input-text-global-box-color-idle)] border-[var(--ui-input-text-normal-box-border-color-idle)] px-[var(--ui-input-text-global-box-padding-x)] text-sm leading-6 text-[var(--ui-input-text-global-value-color-idle)] transition-colors placeholder:text-[var(--ui-input-text-global-placeholder-color-idle)] focus-visible:outline-none focus-visible:ring-[3px] enabled:not-aria-[invalid=true]:hover:border-[var(--ui-input-text-normal-box-border-color-hover)] enabled:not-aria-[invalid=true]:hover:bg-[var(--ui-input-text-global-box-color-hover)] not-aria-[invalid=true]:focus-visible:border-[var(--ui-input-text-normal-box-border-color-hover)] not-aria-[invalid=true]:focus-visible:ring-[var(--ui-focus-primary)] aria-[invalid=true]:border-[var(--ui-input-text-error-msg-box-border-color-idle)] aria-[invalid=true]:focus-visible:ring-[var(--ui-focus-error)] disabled:cursor-not-allowed disabled:border-[var(--ui-input-text-normal-box-border-color-disabled)] disabled:bg-[var(--ui-input-text-global-box-color-disabled)] disabled:text-[var(--ui-input-text-global-value-color-disabled)] disabled:placeholder:text-[var(--ui-input-text-global-placeholder-color-disabled)]',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export { Input };
