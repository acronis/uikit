import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// A compact label for a status, category, or keyword. `variant` maps to the
// shared semantic status vocabulary — the Figma `component/tag/*` colors are
// 1:1 aliases of `--ui-background-status-*` / `--ui-border-on-status-*` /
// `--ui-text-on-status-*`, so they're referenced directly. `size` sets the
// height/padding (24px / 20px); an optional leading icon (16px) sits before the
// label, which truncates at the 256px max width.
//
// NOTE: the Figma "AI" variant is not shipped yet — its background tint
// (`#f9f5fb`) has no design token; it's pending an upstream
// `--ui-background-status-ai` sync.
const tagVariants = cva(
  'inline-flex max-w-64 items-center gap-1 overflow-hidden rounded-full border align-middle text-xs font-semibold leading-4 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        info: 'bg-[var(--ui-background-status-info)] border-[var(--ui-border-on-status-info)] text-[var(--ui-text-on-status-info)]',
        success:
          'bg-[var(--ui-background-status-success)] border-[var(--ui-border-on-status-success)] text-[var(--ui-text-on-status-success)]',
        warning:
          'bg-[var(--ui-background-status-warning)] border-[var(--ui-border-on-status-warning)] text-[var(--ui-text-on-status-warning)]',
        critical:
          'bg-[var(--ui-background-status-critical)] border-[var(--ui-border-on-status-critical)] text-[var(--ui-text-on-status-critical)]',
        danger:
          'bg-[var(--ui-background-status-danger)] border-[var(--ui-border-on-status-danger)] text-[var(--ui-text-on-status-danger)]',
        neutral:
          'bg-[var(--ui-background-status-neutral)] border-[var(--ui-border-on-status-neutral)] text-[var(--ui-text-on-status-neutral)]',
      },
      size: {
        default: 'h-6 px-2',
        sm: 'h-5 px-1',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'default',
    },
  }
);

export interface TagProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  /** Optional leading icon, rendered at 16px before the label. */
  icon?: React.ReactNode;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(tagVariants({ variant, size }), className)}
      {...props}
    >
      {icon}
      <span className="min-w-0 truncate">{children}</span>
    </span>
  )
);
Tag.displayName = 'Tag';

export { Tag, tagVariants };
