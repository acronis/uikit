import * as React from 'react';

import { cn } from '@/lib/utils';

// A multiline text area, themed by the dedicated next-gen `--ui-input-text-area-*`
// token tier from @acronis-platform/tokens-pd. The box fill (`box-color-*`) and the
// border (`border-color-*`) are wired per state: idle / hover / focus (border
// `border-color-focus` + a 3px `--ui-focus-primary` ring) / disabled. Value and
// placeholder text use `value-color-*` / `placeholder-color-*`. Box geometry
// (96px min-height, 4px radius, 12px padding-x, 8px padding-y) comes from
// `--ui-input-text-area-box-*`; it grows with vertical resize. Unlike the
// single-line Input tier, this tier has NO error-specific border/fill token — so
// the error state (driven by `aria-invalid`) keeps the idle/hover/focus border and
// only swaps the focus ring to `--ui-focus-error`. Label, description, and required
// marker are composed by the consumer (a Field component is future work).
export type InputTextAreaProps = React.ComponentPropsWithoutRef<'textarea'>;

const InputTextArea = React.forwardRef<HTMLTextAreaElement, InputTextAreaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'min-h-[var(--ui-input-text-area-box-height-min)] w-full min-w-0 resize-y rounded-[var(--ui-input-text-area-box-border-radius)] border bg-[var(--ui-input-text-area-box-color-idle)] border-[var(--ui-input-text-area-border-color-idle)] px-[var(--ui-input-text-area-box-padding-x)] py-[var(--ui-input-text-area-box-padding-y)] text-sm leading-6 text-[var(--ui-input-text-area-value-color-idle)] transition-colors placeholder:text-[var(--ui-input-text-area-placeholder-color-idle)] focus-visible:outline-none focus-visible:ring-[3px] enabled:hover:bg-[var(--ui-input-text-area-box-color-hover)] enabled:hover:border-[var(--ui-input-text-area-border-color-hover)] enabled:hover:text-[var(--ui-input-text-area-value-color-hover)] enabled:hover:placeholder:text-[var(--ui-input-text-area-placeholder-color-hover)] focus-visible:border-[var(--ui-input-text-area-border-color-focus)] not-aria-[invalid=true]:focus-visible:ring-[var(--ui-focus-primary)] aria-[invalid=true]:focus-visible:ring-[var(--ui-focus-error)] disabled:cursor-not-allowed disabled:border-[var(--ui-input-text-area-border-color-disabled)] disabled:bg-[var(--ui-input-text-area-box-color-disabled)] disabled:text-[var(--ui-input-text-area-value-color-disabled)] disabled:placeholder:text-[var(--ui-input-text-area-placeholder-color-disabled)]',
        className
      )}
      {...props}
    />
  )
);
InputTextArea.displayName = 'InputTextArea';

export { InputTextArea };
