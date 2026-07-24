import * as React from 'react';

import { cn } from '@/lib/utils';

// A bottom action bar (panel/dialog/sheet footer), themed by the `--ui-footer-*`
// tier. The Figma component's `variant` (default / withDescription / withLink) is
// structural, not a separate prop — it follows from which optional slot is
// passed, mirroring how `Breadcrumb`'s "current page" is a different part
// rather than a duplicated state prop. `description` and `link` are mutually
// exclusive; when neither is given, actions sit flush to the end.
export interface DialogFooterDefaultProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** Truncated description text next to the actions. Mutually exclusive with `link`. */
  description?: string;
  /** A `Link` (or similar) element next to the actions. Mutually exclusive with `description`. */
  link?: React.ReactNode;
  /** End-aligned actions — typically a secondary and a primary `Button`. */
  children?: React.ReactNode;
}

const DialogFooterDefault = React.forwardRef<HTMLDivElement, DialogFooterDefaultProps>(
  ({ className, description, link, children, ...props }, ref) => {
    const hasStart = description !== undefined || link !== undefined;
    return (
      <div
        ref={ref}
        className={cn(
          'flex h-[var(--ui-footer-global-height)] items-center gap-[var(--ui-footer-global-gap)] border-t-[length:var(--ui-footer-default-border-width)] border-solid border-[color:var(--ui-footer-default-border-color)] bg-[var(--ui-footer-default-color)] px-[var(--ui-footer-global-padding-x)]',
          !hasStart && 'justify-end',
          className
        )}
        {...props}
      >
        {description !== undefined ? (
          <p className="min-w-0 flex-1 truncate text-sm leading-6 text-foreground">
            {description}
          </p>
        ) : (
          link !== undefined && (
            <div className="flex h-8 min-w-0 flex-1 items-center">{link}</div>
          )
        )}
        {children}
      </div>
    );
  }
);
DialogFooterDefault.displayName = 'DialogFooterDefault';

export { DialogFooterDefault };
