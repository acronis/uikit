'use client';

import * as React from 'react';
import { Meter as MeterPrimitive } from '@base-ui/react/meter';

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

// A meter: a labelled bar showing a scalar value within a known range (a
// fractional value / share), as opposed to `Progress` which tracks a task over
// time — hence Base UI's Meter primitive (`role="meter"`, mirroring the HTML
// `<meter>` element). One row — label + `value · %` over a proportional track
// bar — designed to be stacked into a ranked breakdown (a "bar list"). No new
// tokens: the track reuses the shared `bg-input`, and the fill color is
// caller-supplied per row (an existing `--ui-*` token); there is no chart
// palette tier yet.

const defaultFormat = (value: number) => value.toLocaleString();

export interface MeterProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof MeterPrimitive.Root>,
    'value' | 'color'
  > {
  /** Row label shown on the left. */
  label: string;
  /** The value this meter represents. */
  value: number;
  /** Upper bound of the range — the whole the value is a share of. */
  max?: number;
  /** Fill color for the bar — an existing semantic `--ui-*` token (or any CSS color). */
  color: string;
  /** Format the numeric value (label + tooltip). Defaults to `toLocaleString()`. */
  valueFormatter?: (value: number) => string;
  /** Show the hover tooltip (`label · value of max · %`). */
  showTooltip?: boolean;
  /**
   * Custom tooltip content — replaces the default (dot + label + `value of max
   * · %`) inside the same chart-style card. Ignored when `showTooltip` is false.
   */
  tooltip?: React.ReactNode;
  /** Render with the tooltip initially open (Base UI `defaultOpen`). */
  defaultOpen?: boolean;
}

const Meter = React.forwardRef<HTMLDivElement, MeterProps>(
  (
    {
      className,
      label,
      value,
      max = 100,
      color,
      valueFormatter = defaultFormat,
      showTooltip = true,
      tooltip,
      defaultOpen,
      ...props
    },
    ref
  ) => {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    // Base UI derives the indicator width from value/max; a non-positive max
    // would divide by zero and leave the fill unspecified, so floor it at 1
    // (value is 0 for a degenerate row → a 0% fill that matches `pct`).
    const safeMax = max > 0 ? max : 1;

    const root = (
      <MeterPrimitive.Root
        value={value}
        max={safeMax}
        aria-valuetext={`${valueFormatter(value)} of ${valueFormatter(max)} (${pct}%)`}
        // When wrapped in a Tooltip the meter div is the trigger; make it
        // focusable so keyboard users can open the tooltip (hover-only
        // otherwise). Without a tooltip there's nothing to reveal on focus.
        tabIndex={showTooltip ? 0 : undefined}
        className={cn('flex w-full flex-col gap-1.5', className)}
        {...props}
      >
        <div className="flex items-baseline justify-between gap-2 text-sm leading-none">
          <MeterPrimitive.Label className="truncate text-muted-foreground">
            {label}
          </MeterPrimitive.Label>
          <span className="shrink-0 tabular-nums">
            <span className="font-semibold text-foreground">
              {valueFormatter(value)}
            </span>
            <span className="text-muted-foreground"> · {pct}%</span>
          </span>
        </div>
        <MeterPrimitive.Track className="h-2 w-full overflow-hidden rounded-full bg-input">
          {/* Base UI sizes the indicator from value/max; we only theme it. */}
          <MeterPrimitive.Indicator
            className="rounded-full"
            style={{ backgroundColor: color }}
          />
        </MeterPrimitive.Track>
      </MeterPrimitive.Root>
    );

    if (!showTooltip) {
      return React.cloneElement(root, { ref });
    }

    return (
      <Tooltip defaultOpen={defaultOpen}>
        <TooltipTrigger
          // Base UI's Trigger ref is typed to its default <button>; the trigger
          // is the meter root (a div), so the runtime ref is that div.
          ref={ref as React.Ref<HTMLButtonElement>}
          render={root}
        />
        {/* Match the chart tooltip look (light card: border + surface + shadow),
            not the default dark bubble — this is a data-viz widget. The consumer
            can replace the inner content via `tooltip`. */}
        <TooltipContent
          className={cn(
            'border border-border bg-background text-foreground shadow-md',
            !tooltip && 'flex items-center gap-2'
          )}
        >
          {tooltip ?? (
            <>
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="font-semibold">{label}</span>
              <span className="text-muted-foreground">
                {valueFormatter(value)} of {valueFormatter(max)} · {pct}%
              </span>
            </>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }
);
Meter.displayName = 'Meter';

export { Meter };
