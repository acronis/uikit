import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// A full-bleed empty-state overlay (Figma: `EmptyOverlay`, node 7461:40875) —
// distinct from the plain, compositional `Empty`: this one owns a solid fade
// background meant to sit over other content (e.g. a frozen/blurred widget
// preview) and a colored icon badge. The badge reuses `Avatar`'s 8-color
// `--ui-avatar-color-*` / `--ui-avatar-label-color-*` tokens rather than a
// dedicated tier — Figma's own variable names for this badge
// (`components/Avatar/color/*`) confirm it's a deliberate reuse of the avatar
// palette, not a component composition (the badge holds an arbitrary glyph,
// not a user image/initials, so wrapping `Avatar` itself would pull in image
// loading semantics this doesn't need).
//
// No `--ui-empty-overlay-*` token tier exists, so non-badge colors come from
// the shared semantic vocabulary already bridged in `src/styles/index.css`:
// title -> text-foreground, description -> text-muted-foreground, gradient
// end-stop -> bg-muted (all `--ui-text-on-surface-*` / `--ui-background-surface-secondary`).
//
// The root has no fixed size — per design intent, the developer sizes the
// overlay (e.g. `absolute inset-0` over a positioned parent); this component
// only fills that box (`size-full`) and centers its content.
const emptyOverlayIconVariants = cva(
  'flex size-16 shrink-0 items-center justify-center rounded-full [&>svg]:size-6',
  {
    variants: {
      color: {
        teal: 'bg-[var(--ui-avatar-color-teal)] text-[var(--ui-avatar-label-color-teal)]',
        violet:
          'bg-[var(--ui-avatar-color-violet)] text-[var(--ui-avatar-label-color-violet)]',
        red: 'bg-[var(--ui-avatar-color-red)] text-[var(--ui-avatar-label-color-red)]',
        yellow:
          'bg-[var(--ui-avatar-color-yellow)] text-[var(--ui-avatar-label-color-yellow)]',
        orange:
          'bg-[var(--ui-avatar-color-orange)] text-[var(--ui-avatar-label-color-orange)]',
        blue: 'bg-[var(--ui-avatar-color-blue)] text-[var(--ui-avatar-label-color-blue)]',
        gray: 'bg-[var(--ui-avatar-color-gray)] text-[var(--ui-avatar-label-color-gray)]',
        green:
          'bg-[var(--ui-avatar-color-green)] text-[var(--ui-avatar-label-color-green)]',
      },
    },
    defaultVariants: {
      color: 'green',
    },
  }
);

export interface EmptyOverlayProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'color'>,
    VariantProps<typeof emptyOverlayIconVariants> {
  /** Icon rendered in the colored badge (e.g. an `icons-react` glyph at 24px). */
  icon?: React.ReactNode;
  /** The empty-state headline. */
  title: React.ReactNode;
  /** Supporting copy shown under the title. */
  description?: React.ReactNode;
}

/**
 * A full-bleed empty-state overlay: a colored icon badge over a centered
 * title/description, on a fade-to-solid backdrop. Size it via the parent
 * (e.g. `absolute inset-0`) — the component fills whatever box it's given.
 */
const EmptyOverlay = React.forwardRef<HTMLDivElement, EmptyOverlayProps>(
  ({ className, icon, title, description, color, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex size-full flex-col items-center justify-center overflow-hidden bg-linear-to-b from-transparent to-muted to-[51.481%] p-12 text-center',
        className
      )}
      {...props}
    >
      <div className="flex w-full max-w-lg flex-col items-center justify-center gap-3">
        {icon ? (
          <div className={cn(emptyOverlayIconVariants({ color }))}>{icon}</div>
        ) : null}
        <div className="flex w-full flex-col items-center gap-1">
          <h3 className="w-full text-2xl font-normal leading-8 text-foreground">
            {title}
          </h3>
          {description ? (
            <p className="w-full text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
);
EmptyOverlay.displayName = 'EmptyOverlay';

export { EmptyOverlay, emptyOverlayIconVariants };
