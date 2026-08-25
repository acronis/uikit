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
   * The readout above the plot — typically a `Metric`. Takes its natural height;
   * the plot gets the rest.
   */
  metric?: React.ReactNode;
  /**
   * Show a placeholder instead of the plot, for a widget whose data isn't there
   * yet. `error` also gives the card its error border.
   */
  state?: ChartStateProps['state'];
  /** Overrides the placeholder's default label. */
  stateMessage?: ChartStateProps['message'];
  /** Trailing action on the `error` placeholder — e.g. a "Try again" button. */
  stateAction?: ChartStateProps['action'];
  /**
   * Class for the card body. Rarely needed — the body already fills the card.
   * Use it where nothing above gives a height and the content can't either, e.g.
   * a placeholder-only widget outside a sized grid cell.
   */
  bodyClassName?: string;
  /** The chart. Replaced by the placeholder while `state` is set. */
  children?: React.ReactNode;
}

const ChartWidget = React.forwardRef<HTMLDivElement, ChartWidgetProps>(
  (
    {
      className,
      header,
      metric,
      state,
      stateMessage,
      stateAction,
      bodyClassName,
      children,
      ...props
    },
    ref
  ) => (
    <Card
      ref={ref}
      // The error border belongs to Card, so a caller sets `state="error"` once
      // rather than wiring the placeholder and the border separately.
      hasError={state === 'error'}
      data-slot="chart-widget"
      // `h-full` + a flex column is what lets the plot fill the card: the grid
      // sizes this, the header is `shrink-0`, and the body takes the rest.
      className={cn('flex h-full w-full flex-col', className)}
      {...props}
    >
      {header ? <CardHeader {...header} /> : null}
      {/* `CardContent` brings `px-4 pb-4`; the design's body is padded on all
          four sides with a 16px gap between the metric row and the plot. */}
      <CardContent className={cn('min-h-0 flex-1 gap-4 pt-4', bodyClassName)}>
        {metric ? (
          <div className="shrink-0" data-slot="chart-widget-metric">
            {metric}
          </div>
        ) : null}
        {/* `min-h-0` matters: without it a flex child refuses to shrink below
            its content's height, so a chart would push the card past the height
            the grid gave it instead of fitting inside. */}
        <div className="min-h-0 flex-1" data-slot="chart-widget-body">
          {state ? (
            <ChartState
              state={state}
              message={stateMessage}
              action={stateAction}
            />
          ) : (
            children
          )}
        </div>
      </CardContent>
    </Card>
  )
);
ChartWidget.displayName = 'ChartWidget';

export { ChartWidget };
