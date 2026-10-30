'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, type CardHeaderProps } from '../card';
import { ChartState, type ChartStateProps } from '../chart-state';

// A dashboard chart widget: the Card every chart mockup is wrapped in, plus the
// one thing a Card doesn't know about — what the body shows while there is no
// plot to show.
//
// Deliberately thin. `CardHeader` already owns the whole header surface (title,
// description, extras, actions, drag handle, switch, avatar, rename, collapse
// trigger) and draws the divider under itself, so this re-declares none of it:
// `header` is typed as `CardHeaderProps` and spread, which means a header
// feature added to Card arrives here for free instead of drifting.
//
// It owns no size either. The Figma `size` axis (sm/md/lg) only changes the
// WIDTH (288/592/896), and every set is `HUG` vertically. So the height comes
// from the dashboard grid, and the widget just passes it down: the header takes
// what it needs, and the plot fills whatever is left (`flex-1 min-h-0` all the
// way down, so a chart given `size-full` occupies the rest of the card).
//
// Dropped into a parent with no definite height, `h-full` resolves to `auto` and
// the card hugs its content instead — so a standalone widget still works, with
// the chart bringing its own height.
//
// The per-type chart components stay card-less on purpose. They are the plot;
// the card is composition. That keeps `<AreaChart>` usable inside a table cell,
// a popover, or a `Metric`'s sparkline slot, where a card would be wrong.
//
// Figma: every chart set wraps the `Card` set (`10012:195993`) — ChartArea
// `8174:22232`, ChartBar `8700:55606`, ChartDonut `8811:172438`, and so on.

export interface ChartWidgetProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  /**
   * Replace the rendered `<div>` with another element or component (Base UI
   * composition), forwarded to `Card`. This is how a dashboard gives each
   * widget a landmark role — `render={<section aria-label="Sessions" />}` — the
   * one thing the widget can't infer for itself.
   */
  render?: useRender.RenderProp;
  /**
   * The card header, forwarded verbatim to `CardHeader`. Everything that
   * component takes works here — `title`, `actions` (the ⋯ menu), `extras` (a
   * filter chip), `isDraggable`, `hasRename`, … Omit it for a header-less
   * widget.
   */
  header?: CardHeaderProps;
  /**
   * The readout beside or above the plot — typically a `Metric`.
   *
   * - `'vertical'` (default) — metric above the plot, full width. The metric
   *   takes its natural height; the plot fills the rest of the card body.
   * - `'horizontal'` — metric and plot side by side, each `flex-1`. Use for
   *   compact widgets (sm/288px) where vertical space is at a premium.
   *
   * Figma: vertical → `8174:22335`, horizontal → `8982:31681`.
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * The readout beside or above the plot — typically a `Metric`. Layout is
   * controlled by `orientation`; it is replaced along with the plot while a
   * state is active.
   */
  metric?: React.ReactNode;
  /**
   * Explicitly show a state in place of the metric and plot. The consumer
   * selects the state; this component does not infer it from chart data. The
   * `number` state displays a KPI-style numeric readout. The card chrome stays
   * the same for each state.
   */
  state?: ChartStateProps['state'];
  /**
   * Text shown in the selected state, or the numeric readout for `number`.
   * Defaults to `"Data is loading…"` / `"No data found"` / `"0"` / etc.
   */
  stateDescription?: ChartStateProps['description'];
  /**
   * Class for the card body. Rarely needed — the body already fills the card.
   * Use it where nothing above gives a height and the content can't either, e.g.
   * a placeholder-only widget outside a sized grid cell.
   */
  bodyClassName?: string;
  /** The chart. Replaced with `ChartState` together with `metric` while `state` is set. */
  children?: React.ReactNode;
}

const ChartWidget = React.forwardRef<HTMLDivElement, ChartWidgetProps>(
  (
    {
      className,
      header,
      orientation = 'vertical',
      metric,
      state,
      stateDescription,
      bodyClassName,
      children,
      ...props
    },
    ref
  ) => {
    const isHorizontal = orientation === 'horizontal';
    return (
      <Card
        ref={ref}
        data-slot="chart-widget"
        data-orientation={orientation}
        // `h-full` + a flex column is what lets the plot fill the card: the grid
        // sizes this, the header is `shrink-0`, and the body takes the rest.
        className={cn('flex h-full w-full flex-col', className)}
        {...props}
      >
        {header ? <CardHeader {...header} /> : null}
        {/* `CardContent` brings `px-4 pb-4`; the design's body is padded on all
            four sides with a 16px gap between the metric row and the plot. */}
        <CardContent
          className={cn(
            'min-h-0 flex-1 gap-4 pt-4',
            // In horizontal mode override the default flex-col with flex-row so
            // the metric and the chart sit side by side, each taking half the body.
            isHorizontal && !state && 'flex-row items-stretch',
            bodyClassName
          )}
        >
          {state ? (
            <ChartState
              className="min-h-0 flex-1"
              state={state}
              description={stateDescription}
            />
          ) : (
            <>
              {metric ? (
                <div
                  className={cn(
                    // Vertical: takes natural height, full width.
                    // Horizontal: flex-[1_0_0] matches Figma — equal half-width,
                    // no shrink (flex: 1 0 0), min-w-0 allows text to truncate.
                    isHorizontal ? 'min-w-0 flex-[1_0_0]' : 'shrink-0'
                  )}
                  data-slot="chart-widget-metric"
                >
                  {metric}
                </div>
              ) : null}
              {/* `min-h-0` matters: a flex child refuses to shrink below its
                  content's height without it, so a chart can push past the grid cell. */}
              <div
                className={cn(
                  'min-h-0',
                  isHorizontal ? 'min-w-0 flex-[1_0_0]' : 'flex-1'
                )}
                data-slot="chart-widget-body"
              >
                {children}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }
);
ChartWidget.displayName = 'ChartWidget';

export { ChartWidget };
