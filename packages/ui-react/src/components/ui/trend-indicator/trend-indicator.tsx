'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  ArrowRightIcon,
  ArrowTrendDownIcon,
  ArrowTrendUpIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

// A small, presentational trend/delta indicator: a direction glyph + a
// pre-formatted change value. It deliberately separates `direction` (what
// happened mathematically) from `sentiment` (whether that change is good or
// bad), because the kit can't assume up = good — revenue ↑ is positive,
// threats ↑ is negative, MTTR ↓ is positive. The consumer computes both and
// passes an already-formatted `value`; this component never diffs two numbers,
// rounds, or interprets domain rules. Sentiment drives the color through the
// semantic status text tokens (the glyph inherits via `currentColor`).
const trendIndicatorVariants = cva(
  'inline-flex items-center gap-0.5 align-middle text-xs font-medium [&_svg]:size-3.5 [&_svg]:shrink-0',
  {
    variants: {
      sentiment: {
        positive: 'text-[var(--ui-text-on-status-success)]',
        negative: 'text-[var(--ui-text-on-status-danger)]',
        neutral: 'text-[var(--ui-text-on-status-neutral)]',
      },
    },
    defaultVariants: {
      sentiment: 'neutral',
    },
  }
);

// `flat` uses a horizontal arrow (the "no meaningful change" glyph); up/down use
// the trend arrows. All three carry a horizontal direction, so they mirror under
// `dir="rtl"` (`rtl:-scale-x-100`) to stay aligned with the mirrored text flow.
const DIRECTION_ICON = {
  up: ArrowTrendUpIcon,
  down: ArrowTrendDownIcon,
  flat: ArrowRightIcon,
} as const;

export interface TrendIndicatorProps
  extends Omit<React.ComponentProps<'span'>, 'children'>,
    VariantProps<typeof trendIndicatorVariants> {
  /** What changed mathematically — selects the direction glyph. */
  direction: 'up' | 'down' | 'flat';
  /**
   * Already-formatted change to display — e.g. `"12%"`, `"3.5 h"`,
   * `"Improving"`. The kit does not format or compute it.
   */
  value?: React.ReactNode;
  /** Contextual hint shown on hover/focus (Base UI Tooltip). */
  tooltip?: React.ReactNode;
  /** Show the leading direction glyph. Defaults to `true` — color alone isn't enough. */
  showIcon?: boolean;
  /**
   * Accessible sentence describing the trend (e.g. "Revenue increased 12%
   * compared with the previous quarter"). Applied as the element's label via
   * `role="img"`, since the kit can't build a correct, localized sentence from
   * `direction` + `value` alone. Without it, assistive tech reads the visible
   * `value` text (the glyph is decorative).
   */
  ariaLabel?: string;
}

const TrendIndicator = React.forwardRef<HTMLSpanElement, TrendIndicatorProps>(
  (
    {
      className,
      direction,
      sentiment,
      value,
      tooltip,
      showIcon = true,
      ariaLabel,
      ...props
    },
    ref
  ) => {
    const Icon = DIRECTION_ICON[direction];
    const hasTooltip = tooltip != null;

    const root = (
      <span
        data-direction={direction}
        data-sentiment={sentiment ?? 'neutral'}
        className={cn(trendIndicatorVariants({ sentiment }), className)}
        {...(ariaLabel ? { role: 'img', 'aria-label': ariaLabel } : {})}
        tabIndex={hasTooltip ? 0 : undefined}
        {...props}
      >
        {showIcon && <Icon aria-hidden className="rtl:-scale-x-100" />}
        {value != null && <span className="tabular-nums">{value}</span>}
      </span>
    );

    if (!hasTooltip) {
      return React.cloneElement(root, { ref });
    }

    return (
      <Tooltip>
        <TooltipTrigger ref={ref as React.Ref<HTMLButtonElement>} render={root} />
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }
);
TrendIndicator.displayName = 'TrendIndicator';

export { TrendIndicator, trendIndicatorVariants };
