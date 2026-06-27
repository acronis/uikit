'use client';

import * as React from 'react';
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';

import { cn } from '@/lib/utils';

// Ported from `@acronis-platform`'s `toggle-group`, on Base UI's Toggle /
// ToggleGroup. No `--ui-toggle-*` tier — semantic tokens. The shared item style is
// transparent when idle, the hover surface on hover, and the active surface +
// foreground when pressed (legacy's `bg-muted` hover is near-white in ui-react, so
// hover uses the visible surface-hover and the pressed state uses surface-active so
// it reads as selected, distinct from hover).
const toggleItemClassName = cn(
  'inline-flex h-9 select-none items-center justify-center gap-2 rounded-md border border-transparent bg-transparent px-3 text-sm font-medium text-[var(--ui-text-on-surface-primary)] transition-colors outline-none',
  'not-disabled:hover:bg-[var(--ui-background-surface-hover)]',
  'focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)]',
  'data-pressed:bg-[var(--ui-background-surface-active)] data-pressed:text-[var(--ui-text-on-surface-primary)]',
  'disabled:pointer-events-none disabled:opacity-50'
);

const Toggle = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive>
>(({ className, ...props }, ref) => (
  <TogglePrimitive
    ref={ref}
    className={cn(toggleItemClassName, className)}
    {...props}
  />
));
Toggle.displayName = 'Toggle';

const ToggleGroup = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive
    ref={ref}
    className={cn(
      'inline-flex items-center gap-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
      className
    )}
    {...props}
  />
));
ToggleGroup.displayName = 'ToggleGroup';

const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive>
>(({ className, ...props }, ref) => (
  <TogglePrimitive
    ref={ref}
    className={cn(toggleItemClassName, className)}
    {...props}
  />
));
ToggleGroupItem.displayName = 'ToggleGroupItem';

export { Toggle, ToggleGroup, ToggleGroupItem };
