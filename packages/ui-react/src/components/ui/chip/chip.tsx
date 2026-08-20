import * as React from 'react';
import { TimesSmallIcon } from '@acronis-platform/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// A compact, interactive label. `variant` mirrors the Figma "Chip" `type`:
// `removable` (Figma `dismissable`) carries a trailing × (remove) button;
// `selectable` toggles a selected state; `operational` is a plain action chip
// whose label is styled like a strong link (the semibold weight comes from
// tokens-pd's generated `ui-chip-operational-label-text-style` class).
// The container fill/border/label/icon all wire to the dedicated
// `--ui-chip-*` tier from @acronis-platform/tokens-pd; geometry (height, gap,
// padding, min-width, radius, border width, icon size) is tokenized too.
// The Figma `state` enum (idle / hover / active / focused) maps to interaction
// states, not props: `hover:` → the hover tokens, `:focus`/`focus-visible` → the
// 3px `--ui-focus-primary` ring, and the `active` look is the pressed state for
// `removable`/`operational` (`active:`) and the selected state for `selectable`
// (`data-[selected]`, driven by the `selected` prop).
//
// Figma's `_global/box/marginY` (4px) is deliberately NOT wired: its frame sits
// at y=-4 with height 32 around the 24px box, i.e. it bleeds *outside* the
// component's 24px footprint to give the focus ring room on the canvas. A CSS
// `ring` already paints outside the border box without affecting layout, so
// translating it to a real margin would wrongly add 8px to every chip.
const chipVariants = cva(
  "inline-flex h-[var(--ui-chip-global-box-height)] min-w-[var(--ui-chip-global-box-width-min)] cursor-pointer items-center justify-center gap-[var(--ui-chip-global-box-gap)] rounded-[var(--ui-chip-global-border-radius)] border-[length:var(--ui-chip-global-border-width)] border-solid border-[var(--ui-chip-global-border-color-idle)] bg-[var(--ui-chip-global-box-color-idle)] px-[var(--ui-chip-global-box-padding-x)] text-sm leading-6 hover:border-[var(--ui-chip-global-border-color-hover)] hover:bg-[var(--ui-chip-global-box-color-hover)] [&_svg]:size-[var(--ui-chip-global-icon-size)] [&_svg]:shrink-0 [&_svg]:pointer-events-none [&_svg]:text-[var(--ui-chip-global-icon-color)]",
  {
    variants: {
      variant: {
        removable:
          'text-[var(--ui-chip-removable-label-color)] focus-within:outline-none focus-within:ring-[3px] focus-within:ring-[var(--ui-focus-primary)] active:border-[var(--ui-chip-global-border-color-active)] active:bg-[var(--ui-chip-global-box-color-active)]',
        selectable:
          'text-[var(--ui-chip-selectable-label-color)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)] data-[selected=true]:border-[var(--ui-chip-global-border-color-active)] data-[selected=true]:bg-[var(--ui-chip-global-box-color-active)]',
        operational:
          'ui-chip-operational-label-text-style text-[var(--ui-chip-operational-label-color)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)] active:border-[var(--ui-chip-global-border-color-active)] active:bg-[var(--ui-chip-global-box-color-active)]',
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
    // `selectable` and `operational` put the action on the chip itself, so the
    // container carries button semantics. `removable` keeps a presentational
    // container — its only control is the trailing × button.
    const actionable = selectable || variant === 'operational';
    return (
      <div
        ref={ref}
        className={cn(chipVariants({ variant }), className)}
        onKeyDown={(event) => {
          // An actionable chip is a div with button semantics; mirror native
          // button activation so Enter/Space fire its click handler.
          if (actionable && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            event.currentTarget.click();
          }
          onKeyDown?.(event);
        }}
        {...(actionable ? { role: 'button', tabIndex: 0 } : {})}
        {...(selectable
          ? {
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
            className="-me-1 flex shrink-0 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:outline-none"
          >
            {/* `TimesSmall` (not `Times`) at size 16 is what the design uses:
                its × mark spans ~52% of the 16px box, where `Times` spans ~85%.
                `size={16}` also picks the 16px stroke spec (2.4 viewBox units →
                the design's 1.6px), instead of scaling the 24px master down. */}
            <TimesSmallIcon size={16} />
          </button>
        )}
      </div>
    );
  }
);
Chip.displayName = 'Chip';

export { Chip, chipVariants };
