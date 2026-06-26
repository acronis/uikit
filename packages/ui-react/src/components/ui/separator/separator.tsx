import * as React from 'react';
import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';

import { cn } from '@/lib/utils';

// Ported from `@acronis-platform/shadcn-uikit`'s `separator`
// (packages/ui-legacy/src/components/ui/separator.tsx). A thin divider built on
// the Base UI Separator primitive (sets the `separator` role + aria-orientation).
// No `--ui-separator-*` tier; the line uses the shared divider token `bg-border`
// (--ui-border-on-surface-border), replacing the legacy `bg-primary/10` hack.

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive>
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <SeparatorPrimitive
    ref={ref}
    orientation={orientation}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      className
    )}
    {...props}
  />
));
Separator.displayName = 'Separator';

export { Separator };
