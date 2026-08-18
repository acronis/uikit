import * as React from 'react';

import { ButtonGroup } from '@/components/ui/button-group';
import { cn } from '@/lib/utils';

// Mirrors the Figma "Timer" component (node 7987:25477): a bordered 32px pill
// holding an elapsed-time readout, hairline-separated from a cluster of
// icon-only actions.
//
// Figma models exactly two properties on it — `value` (TEXT) and the nested
// ButtonGroup's `ListItem` slot — so that is the whole API: a required `value`
// and variadic `children`. There is no variant axis and no design-defined
// state, so no `cva` here.
//
// The action cluster is a real `ButtonGroup` with `variant="inlined"` (the
// design instantiates it exactly that way) because the Timer container already
// draws the border and radius an `outlined` group would duplicate. Composing it
// rather than re-implementing the item box keeps the separators, the roving
// tabindex, and the hover/active/focus fills in one place — which is also why
// the actions are plain `ButtonGroupItem` children rather than a Timer-specific
// alias of it.
//
// The Timer does NOT tick: it renders whatever it is given. Formatting and the
// interval belong to the consumer, who owns the clock the actions operate on.

export interface TimerProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  /**
   * The formatted time to display, e.g. `"12:01:45"`. Rendered with tabular
   * figures so the readout doesn't jitter as the digits change. The component
   * neither ticks nor formats — pass an already-formatted value.
   */
  value: React.ReactNode;
  /**
   * The actions, as `ButtonGroupItem` elements in visual order. Omit them for a
   * read-only readout — with no actions the divider is dropped too.
   */
  children?: React.ReactNode;
  /**
   * Accessible name for the action cluster's toolbar. Localize it; the default
   * is English.
   */
  actionsLabel?: string;
}

/**
 * An elapsed-time readout paired with a cluster of icon-only actions.
 *
 * The readout is a `role="timer"` live region — implicitly `aria-live="off"`,
 * so it is not announced on every tick. Each action needs its own accessible
 * name; the cluster as a whole is named by `actionsLabel`.
 */
const Timer = React.forwardRef<HTMLDivElement, TimerProps>(
  (
    { className, value, children, actionsLabel = 'Timer actions', ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        // `overflow-hidden` clips the trailing action's hover fill and inset
        // focus ring to the container's radius — the same reason ButtonGroup
        // needs it, one level up.
        'inline-flex h-[var(--ui-timer-container-height)] w-fit items-center overflow-hidden',
        'rounded-[var(--ui-timer-container-radius)] bg-[var(--ui-timer-container-color)]',
        'border-[length:var(--ui-timer-container-border-width)] border-[color:var(--ui-timer-container-border-color)] [border-style:var(--ui-timer-container-border-style)]',
        className
      )}
      {...props}
    >
      <div
        role="timer"
        className={cn(
          'ui-timer-value-text-style flex h-full shrink-0 items-center whitespace-nowrap',
          'px-[var(--ui-timer-content-box-padding-x)] text-[var(--ui-timer-value-color)]',
          '[font-variant-numeric:var(--ui-timer-value-font-variant-numeric)]',
          // The divider is the readout's own inline-end border, as in Figma,
          // and is derived from the DOM rather than a prop: with no actions the
          // readout is the last child and the border is dropped. `border-e-*`
          // (not `border-r-*`) so it flips under `dir="rtl"`.
          'border-e-[length:var(--ui-timer-content-box-divider-width)] border-[color:var(--ui-timer-content-box-divider-color)] [border-inline-end-style:var(--ui-timer-content-box-divider-style)] last:border-e-0'
        )}
      >
        {value}
      </div>
      {children ? (
        <ButtonGroup variant="inlined" aria-label={actionsLabel}>
          {children}
        </ButtonGroup>
      ) : null}
    </div>
  )
);
Timer.displayName = 'Timer';

export { Timer };
