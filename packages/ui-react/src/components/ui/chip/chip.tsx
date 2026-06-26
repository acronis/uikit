import * as React from 'react';
import { TimesIcon } from '@acronis-platform/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// A compact, interactive label. `variant` mirrors the Figma "Chip" `type`:
// `removable` carries a trailing × (remove) button; `selectable` toggles a
// selected state. The container fill/border/label/icon all wire to the dedicated
// `--ui-chips-*` tier from @acronis-platform/tokens-pd; geometry (height, gap,
// padding, min-width, radius, border width, icon size) is tokenized too.
// The Figma `state` enum (idle / hover / active / focused) maps to interaction
// states, not props: `hover:` → the hover tokens, `:focus`/`focus-visible` → the
// 3px `--ui-focus-primary` ring, and the `active` look is the pressed state for
// `removable` (`active:`) and the selected state for `selectable`
// (`data-[selected]`, driven by the `selected` prop).
const chipVariants = cva(
  "inline-flex h-[var(--ui-chips-container-height)] min-w-[var(--ui-chips-container-width-min)] items-center justify-center gap-[var(--ui-chips-container-gap)] rounded-[var(--ui-chips-border-radius)] border-[length:var(--ui-chips-border-width)] border-solid border-[var(--ui-chips-border-color-idle)] bg-[var(--ui-chips-container-color-idle)] px-[var(--ui-chips-container-padding-x)] text-sm leading-6 text-[var(--ui-chips-label-color)] hover:border-[var(--ui-chips-border-color-hover)] hover:bg-[var(--ui-chips-container-color-hover)] [&_svg]:size-[var(--ui-chips-icon-size)] [&_svg]:shrink-0 [&_svg]:text-[var(--ui-chips-icon-color)]",
  {
    variants: {
      variant: {
        removable:
          'focus-within:outline-none focus-within:ring-[3px] focus-within:ring-[var(--ui-focus-primary)] active:border-[var(--ui-chips-border-color-active)] active:bg-[var(--ui-chips-container-color-active)]',
        selectable:
          'cursor-pointer focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)] data-[selected=true]:border-[var(--ui-chips-border-color-active)] data-[selected=true]:bg-[var(--ui-chips-container-color-active)]',
      },
    },
    defaultVariants: {
      variant: 'removable',
    },
  }
);

export interface ChipProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  /** Optional leading icon, rendered at 16px before the label. */
  icon?: React.ReactNode;
  /**
   * `selectable` only — applies the selected (active) styling and exposes the
   * chip as a pressed toggle (`role="button"` + `aria-pressed`).
   */
  selected?: boolean;
  /** `removable` only — called when the trailing remove (×) button is pressed. */
  onRemove?: () => void;
  /** Accessible label for the remove button (`removable`). */
  removeLabel?: string;
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      className,
      variant = 'removable',
      icon,
      selected,
      onRemove,
      removeLabel = 'Remove',
      children,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const selectable = variant === 'selectable';
    return (
      <div
        ref={ref}
        className={cn(chipVariants({ variant }), className)}
        onKeyDown={(event) => {
          // The selectable chip is a div with button semantics; mirror native
          // button activation so Enter/Space fire its click handler.
          if (selectable && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            event.currentTarget.click();
          }
          onKeyDown?.(event);
        }}
        {...(selectable
          ? {
              role: 'button',
              tabIndex: 0,
              'aria-pressed': Boolean(selected),
              'data-selected': selected ? 'true' : undefined,
            }
          : {})}
        {...props}
      >
        {icon}
        <span className="min-w-0 truncate">{children}</span>
        {variant === 'removable' && (
          <button
            type="button"
            aria-label={removeLabel}
            onClick={onRemove}
            className="-mr-1 flex shrink-0 items-center justify-center rounded-full outline-none focus-visible:outline-none"
          >
            <TimesIcon />
          </button>
        )}
      </div>
    );
  }
);
Chip.displayName = 'Chip';

export { Chip, chipVariants };
