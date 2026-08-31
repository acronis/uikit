import * as React from 'react';
import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Ported from `@acronis-platform/shadcn-uikit`'s `separator`
// (packages/ui-legacy/src/components/ui/separator.tsx). A thin divider built on
// the Base UI Separator primitive (sets the `separator` role + aria-orientation).
// No `--ui-separator-*` tier; the line uses the shared divider token
// `--ui-border-on-surface-divider` directly, matching every other divider
// consumer in this package (Card, Wizard, Section, ...) rather than the
// `bg-border` bridge (`--ui-border-on-surface-border`), a distinct semantic role
// that happens to share the same value today.
// `size` (Figma: S1/S2/S3) is the surrounding spacing Figma bakes into the
// component itself; S1 (default) has none.

const separatorVariants = cva('shrink-0 bg-[var(--ui-border-on-surface-divider)]', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'h-full w-px',
    },
    size: {
      S1: '',
      S2: '',
      S3: '',
    },
  },
  compoundVariants: [
    { orientation: 'horizontal', size: 'S2', class: 'my-[var(--ui-gap-4)]' },
    { orientation: 'horizontal', size: 'S3', class: 'my-[var(--ui-gap-8)]' },
    { orientation: 'vertical', size: 'S2', class: 'mx-[var(--ui-gap-4)]' },
    { orientation: 'vertical', size: 'S3', class: 'mx-[var(--ui-gap-8)]' },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    size: 'S1',
  },
});

interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive>,
    Pick<VariantProps<typeof separatorVariants>, 'size'> {}

const Separator = React.forwardRef<React.ElementRef<typeof SeparatorPrimitive>, SeparatorProps>(
  ({ className, orientation = 'horizontal', size = 'S1', ...props }, ref) => (
    <SeparatorPrimitive
      ref={ref}
      orientation={orientation}
      className={cn(separatorVariants({ orientation, size }), className)}
      {...props}
    />
  )
);
Separator.displayName = 'Separator';

export { Separator };
