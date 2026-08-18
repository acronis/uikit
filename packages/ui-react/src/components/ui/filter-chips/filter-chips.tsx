import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '@/lib/utils';
import { Button } from '../button';

// Composable applied-filter row mirroring the Figma "FilterChips" component:
// a wrapping list of removable `Chip`s closed by a ghost "Reset filters" action
// that clears them all at once.
//
// There is no `--ui-filter-chips-*` tier, and none is needed — the design
// references exactly two primitive gap tokens: `--ui-gap-16` between the root's
// children and `--ui-gap-8` between the items inside the list. Every other token
// in the node belongs to `Chip` (`--ui-chip-*`) or `Button`
// (`--ui-button-ghost-*`), which already own them.
//
// Figma models the chip area as a single `ListChips` slot, so the chips are the
// consumer's children rather than a data prop. The "Reset filters" button sits
// *inside* that slot — the design measures 8px, not 16px, between the last chip
// and the button — so compose `FilterChipsReset` as the last child of
// `FilterChipsList`. The root's 16px gap is for anything a consumer places
// beside the list as a whole.
//
// Chips are 24px tall and the ghost button is 32px, so the row is 32px tall with
// the chips centered in it (`items-center`).

export interface FilterChipsProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * Replace the rendered `<div>` with another element or component
   * (Base UI composition). Accepts a React element or a render function.
   */
  render?: useRender.RenderProp;
  /** Accessible name for the applied-filter region. */
  ariaLabel?: string;
}

const FilterChips = React.forwardRef<HTMLDivElement, FilterChipsProps>(
  ({ className, render, ariaLabel = 'Applied filters', ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        {
          role: 'group',
          'aria-label': ariaLabel,
          className: cn('flex items-center gap-[var(--ui-gap-16)]', className),
        },
        props
      ),
    })
);
FilterChips.displayName = 'FilterChips';

export type FilterChipsListProps = React.ComponentPropsWithoutRef<'div'>;

const FilterChipsList = React.forwardRef<HTMLDivElement, FilterChipsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex min-w-0 flex-wrap content-center items-center gap-[var(--ui-gap-8)]',
        className
      )}
      {...props}
    />
  )
);
FilterChipsList.displayName = 'FilterChipsList';

export interface FilterChipsResetProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Replace the rendered `<button>` with another element or component
   * (Base UI composition). Accepts a React element or a render function.
   */
  render?: useRender.RenderProp;
  /** Label for the reset action. */
  children?: React.ReactNode;
}

const FilterChipsReset = React.forwardRef<
  HTMLButtonElement,
  FilterChipsResetProps
>(({ children = 'Reset filters', type = 'button', ...props }, ref) => (
  <Button ref={ref} type={type} variant="ghost" {...props}>
    {children}
  </Button>
));
FilterChipsReset.displayName = 'FilterChipsReset';

export { FilterChips, FilterChipsList, FilterChipsReset };
