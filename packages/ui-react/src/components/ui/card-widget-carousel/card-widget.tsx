import * as React from 'react';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

const statusBgToken = {
  danger: 'var(--ui-background-status-danger)',
  warning: 'var(--ui-background-status-warning)',
  info: 'var(--ui-background-status-info)',
} as const;

const statusGlyphToken = {
  danger: 'var(--ui-glyph-on-status-danger)',
  warning: 'var(--ui-glyph-on-status-warning)',
  info: 'var(--ui-glyph-on-status-info)',
} as const;

export type CardWidgetStatus = keyof typeof statusBgToken;

export interface CardWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Semantic status — drives the icon-box background and icon glyph color. */
  status?: CardWidgetStatus;
  /** The 16 px icon placed inside the status-colored icon box. */
  icon?: React.ReactNode;
  /** Card header title (the widget/category name, e.g. "Phishing attacks"). */
  header?: string;
  /** Insight title in the body (14 px, semibold). Hidden while `skeleton` is true. */
  title?: string;
  /** Supporting description (12 px). Hidden while `skeleton` is true. */
  description?: string;
  /**
   * Primary value / metric (24 px, semibold). Accepts a string or any node.
   * Hidden while `skeleton` is true.
   */
  metric?: React.ReactNode;
  /** Small caption beside the metric (12 px). Hidden while `skeleton` is true. */
  caption?: string;
  /**
   * When true the body shows animated placeholder lines instead of
   * `title` / `description` / `metric` / `caption`.
   */
  skeleton?: boolean;
  /**
   * Accessible label for the skeleton loading indicator (`aria-label`).
   * Defaults to `'Loading'`. Localize when deploying in a non-English context.
   */
  loadingLabel?: string;
  /**
   * Content rendered in the card footer (action buttons). Omit the prop to
   * hide the footer entirely.
   */
  footer?: React.ReactNode;
}

const CardWidget = React.forwardRef<HTMLDivElement, CardWidgetProps>(
  (
    {
      className,
      status = 'info',
      icon,
      header,
      title,
      description,
      metric,
      caption,
      skeleton = false,
      loadingLabel = 'Loading',
      footer,
      ...props
    },
    ref
  ) => {
    const bg = statusBgToken[status];
    const glyph = statusGlyphToken[status];

    return (
      <Card
        ref={ref}
        className={cn('flex w-72 shrink-0 flex-col', className)}
        {...props}
      >
        {header !== undefined && (
          <CardHeader title={header} className="min-h-12 border-b-0 py-2" />
        )}

        <CardContent className="gap-2 pt-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-lg"
            style={{ background: bg, color: glyph }}
          >
            {!skeleton && icon}
          </div>

          {skeleton ? (
            <div role="status" aria-label={loadingLabel} className="flex flex-col gap-4 pt-1">
              {[100, 80, 59, 29].map((pct) => (
                <div
                  key={pct}
                  className="h-[14px] animate-pulse rounded-lg"
                  style={{ width: `${pct}%`, background: bg }}
                />
              ))}
            </div>
          ) : (
            <>
              {title !== undefined && (
                <p className="truncate text-sm font-semibold leading-6 text-[var(--ui-text-on-surface-primary)]">
                  {title}
                </p>
              )}
              {description !== undefined && (
                <p className="text-xs leading-4 text-[var(--ui-text-on-surface-secondary)]">
                  {description}
                </p>
              )}
              {(metric !== undefined || caption !== undefined) && (
                <div className="flex items-baseline gap-1">
                  {metric !== undefined && (
                    <span className="text-2xl font-semibold leading-8 text-[var(--ui-text-on-surface-primary)]">
                      {metric}
                    </span>
                  )}
                  {caption !== undefined && (
                    <span className="text-xs leading-4 text-[var(--ui-text-on-surface-secondary)]">
                      {caption}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>

        {footer !== undefined && (
          <CardFooter className="mt-auto">{footer}</CardFooter>
        )}
      </Card>
    );
  }
);
CardWidget.displayName = 'CardWidget';

export { CardWidget };
