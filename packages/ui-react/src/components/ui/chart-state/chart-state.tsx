'use client';

import * as React from 'react';
import {
  CircleMinusGrayIcon,
  DiamondWarningRedIcon,
  TriangleWarningYellowIcon,
} from '@acronis-platform/icons-react/stroke-multi';

import { cn } from '@/lib/utils';
import { Spinner } from '../spinner';

// The Breakpoints references are composed widget-card examples rather than a
// standalone ChartState component set, so this inner component has no Code
// Connect mapping.
const DEFAULT_MESSAGE = {
  loading: 'Data is loading…',
  empty: 'No data found',
  warning: 'Data may be incomplete',
  error: 'Something went wrong',
  number: '0',
} as const;

const STATUS_ICON = {
  empty: {
    Component: CircleMinusGrayIcon,
    background: 'bg-[var(--ui-background-status-neutral-hover)]',
  },
  warning: {
    Component: TriangleWarningYellowIcon,
    background: 'bg-[var(--ui-background-status-warning)]',
  },
  error: {
    Component: DiamondWarningRedIcon,
    background: 'bg-[var(--ui-background-status-critical)]',
  },
} as const;

export interface ChartStateProps extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'children'
> {
  /** Which state to show. Empty, warning, and error share one icon system. */
  state: 'loading' | 'empty' | 'warning' | 'error' | 'number';
  /**
   * State text, or the numeric readout for `number`. Defaults to a short
   * message for the selected state (`0` for `number`). Pass a value to
   * provide localized or context-specific content.
   */
  description?: React.ReactNode;
}

const ChartState = React.forwardRef<HTMLDivElement, ChartStateProps>(
  ({ className, state, description, ...props }, ref) => {
    const caption = description ?? DEFAULT_MESSAGE[state];
    const isLoading = state === 'loading';
    const isNumber = state === 'number';
    const status = !isLoading && !isNumber ? STATUS_ICON[state] : null;
    const StateIcon = status?.Component;

    return (
      <div
        ref={ref}
        className={cn(
          'flex size-full min-h-0 min-w-0 flex-col items-center gap-3 text-center text-sm leading-6 text-foreground',
          state !== 'error' && 'justify-center',
          // Keep long error details scrollable while centering short messages.
          state === 'error' && 'overflow-y-auto overflow-x-hidden',
          className
        )}
        {...props}
        // Keep the live-region contract intrinsic to the state. The loading
        // placeholder is replaced rather than un-busied, so it must not set the
        // region itself to aria-busy.
        role={state === 'error' ? 'alert' : 'status'}
        aria-live={state === 'error' ? 'assertive' : 'polite'}
      >
        {isLoading ? (
          <>
            <Spinner size="lg" aria-hidden />
            <p>{caption}</p>
          </>
        ) : isNumber ? (
          <p className="w-full text-center text-5xl font-bold leading-[64px] text-[var(--ui-text-on-surface-disabled)]">
            {caption}
          </p>
        ) : (
          <div
            className={cn(
              'flex w-full min-w-0 flex-col items-center gap-3',
              state === 'error' && 'my-auto shrink-0'
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'flex size-16 shrink-0 items-center justify-center rounded-full p-2',
                status?.background
              )}
            >
              {StateIcon && <StateIcon size={24} />}
            </span>
            <p className="w-full min-w-0 [overflow-wrap:anywhere]">{caption}</p>
          </div>
        )}
      </div>
    );
  }
);
ChartState.displayName = 'ChartState';

export { ChartState };
