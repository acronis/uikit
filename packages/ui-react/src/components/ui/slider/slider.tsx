'use client';

import * as React from 'react';
import { Slider as SliderPrimitive } from '@base-ui/react/slider';

import { cn } from '@/lib/utils';

// Ported from `@acronis-platform`'s `slider`, on Base UI's Slider (Root / Control /
// Track / Indicator / Thumb). Supports a single value or a range (array value) —
// the thumb count follows the value/defaultValue length. No `--ui-slider-*` tier,
// so it uses semantic tokens: the rail is the divider gray
// (`--ui-border-on-surface-border`); the filled indicator and the thumb border use
// the action blue (`--ui-background-brand-secondary`) — note legacy's `bg-primary`
// is the dark navy in ui-react, so the action color is `secondary`.
export type SliderProps = React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
>;

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, defaultValue, value, ...props }, ref) => {
    const normalizedValue =
      value != null ? (Array.isArray(value) ? value : [value]) : undefined;
    const normalizedDefaultValue =
      defaultValue != null
        ? Array.isArray(defaultValue)
          ? defaultValue
          : [defaultValue]
        : [0];
    const thumbCount = (normalizedValue ?? normalizedDefaultValue).length;

    return (
      <SliderPrimitive.Root
        ref={ref}
        value={normalizedValue}
        defaultValue={normalizedDefaultValue}
        className={cn(
          'group relative flex w-full touch-none select-none items-center',
          className
        )}
        {...props}
      >
        <SliderPrimitive.Control className="relative flex w-full items-center py-2">
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[var(--ui-border-on-surface-border)]">
            <SliderPrimitive.Indicator className="rounded-full bg-[var(--ui-background-brand-secondary)] group-data-[disabled]:bg-[var(--ui-background-status-strong-neutral)]" />
          </SliderPrimitive.Track>
          {Array.from({ length: thumbCount }, (_, i) => (
            <SliderPrimitive.Thumb
              key={i}
              className={cn(
                'block size-4 rounded-full border border-[var(--ui-background-brand-secondary)] bg-background shadow-sm transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)]',
                'data-dragging:ring-2 data-dragging:ring-[var(--ui-focus-primary)]',
                'data-disabled:pointer-events-none data-disabled:border-[var(--ui-background-status-strong-neutral)] data-disabled:opacity-50'
              )}
            />
          ))}
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
    );
  }
);
Slider.displayName = 'Slider';

export { Slider };
