'use client';

import * as React from 'react';
import { CircleWarningIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { Spinner } from '../spinner';
import {
  CHART_STATE_ILLUSTRATIONS,
  type ChartStateVariant,
} from './chart-state-illustrations';

// A shared loading / empty / error placeholder for the chart types. A chart can
// only render once recharts' `ResponsiveContainer` has data and real dimensions,
// so every type needs the same "there's nothing to plot yet" surface — this is
// that surface, dropped in place of the chart inside the same sized slot.
//
// Ported from the Figma InputSelect dropdown states (the reference the task
// points at) and kept visually in step with the shipped `InputSelectStatus`
// sibling: the empty / error states use the same 24px glyph + `text-sm` label
// and the same `--ui-glyph-on-status-*` icon tokens. (Loading uses the shared
// `Spinner` — brand blue, larger — not the sibling's inline gray ring.) No
// `--ui-chart-*` tier exists yet, so it themes from existing semantic tokens
// directly:
//   • label      -> text-foreground (--ui-text-on-surface-primary)
//   • empty icon  -> --ui-glyph-on-status-info
//   • error icon  -> --ui-glyph-on-status-warning
//   • loading      -> the shared Spinner (brand action blue)
// The generic full-page `Empty` component is the larger, page-level sibling;
// this one is compact and fills a chart slot.

const DEFAULT_MESSAGE: Record<ChartStateProps['state'], string> = {
  loading: 'Data is loading…',
  empty: 'No data found',
  error: 'Something went wrong',
};

export interface ChartStateProps extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'children'
> {
  /** Which placeholder to show. Drives the leading glyph and default label. */
  state: 'loading' | 'empty' | 'error';
  /**
   * Which chart the slot holds. `empty` then draws that type's silhouette
   * instead of the generic inbox glyph — the design defines one per chart type.
   * Ignored by `loading` and `error`, which share one treatment.
   */
  variant?: ChartStateVariant;
  /**
   * Text shown below the illustration or glyph. Defaults to `"Data is
   * loading…"` / `"No data found"` / `"Something went wrong"` based on
   * `state`. Pass a value to override for any state.
   */
  description?: React.ReactNode;
  /** Trailing action (e.g. a "Try again" button) — shown for `error` only. */
  action?: React.ReactNode;
}

const ChartState = React.forwardRef<HTMLDivElement, ChartStateProps>(
  (
    { className, state, variant, description, action, ...props },
    ref
  ) => {
    const Illustration = variant
      ? CHART_STATE_ILLUSTRATIONS[variant]
      : undefined;
    const caption = description ?? DEFAULT_MESSAGE[state];

    return (
      <div
        ref={ref}
        className={cn(
          'flex size-full min-h-32 flex-col items-center gap-2 text-center text-sm leading-6 text-foreground',
          // Error: scroll long diagnostic text instead of overflowing the card.
          // Loading/empty keep centered — their content is always compact.
          state === 'error'
            ? 'overflow-y-auto overflow-x-hidden'
            : 'justify-center',
          className
        )}
        {...props}
        // The status/alert live-region contract is intrinsic to the state, so it
        // wins over any consumer-passed a11y prop (spread above). No `aria-busy`
        // here: this element IS the live region, and some AT defer announcing a
        // busy region's content until busy clears — but this placeholder is
        // unmounted (swapped for the chart) rather than un-busied, so a busy flag
        // would risk swallowing the "Data is loading…" announcement. A consumer
        // that wants a busy signal sets `aria-busy` on the chart-slot container.
        role={state === 'error' ? 'alert' : 'status'}
        aria-live={state === 'error' ? 'assertive' : 'polite'}
      >
        {/* aria-hidden: the root is already the loading live region (+ the label),
          so the Spinner's own role="status"/sr-only would double-announce. */}
        {state === 'loading' && <Spinner size="lg" aria-hidden />}
        {state === 'empty' && Illustration && (
          // The tone is set once here, and every path inside is `currentColor`,
          // so brand and theme overrides follow. Figma binds the artwork to
          // `components/Avatar/color/blue`; this is the semantic token with the
          // identical light/dark pair, and "status off" is what an empty widget
          // is — referencing Avatar's tier from a chart would be a coupling with
          // no meaning behind it.
          // Scales with the slot rather than sitting at the mockup's 147×92:
          // the silhouette is the whole point of a per-type empty state, so it
          // takes the room the card gives it, capped so it stays a thumbnail
          // in a wide widget instead of a poster.
          <Illustration className="max-h-full w-full max-w-[220px] shrink text-[var(--ui-background-status-off)]" />
        )}
        {/* Error content is wrapped so `my-auto` can center it when the card
            is tall (margins split the space) yet collapse to top-aligned when
            the text overflows (margins collapse to 0 → scrollable from the
            top). `justify-center` alone would push the icon above the visible
            area on overflow; `justify-start` alone would top-align even short
            messages.  `shrink-0` on the icon prevents flex from compressing it
            when the description is long. */}
        {state === 'error' ? (
          <div className="my-auto flex w-full flex-col items-center gap-2">
            <CircleWarningIcon
              size={24}
              className="shrink-0 text-[var(--ui-glyph-on-status-warning)]"
            />
            <p className="max-w-full break-words">{caption}</p>
            {action}
          </div>
        ) : (
          <p>{caption}</p>
        )}
      </div>
    );
  }
);
ChartState.displayName = 'ChartState';

export { ChartState };
