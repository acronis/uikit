import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Mirrors the Figma "CardFilter" component: a compact stat/filter card — a caption
// `label` above a content row (optional `icon` + a large `value`). `variant` maps
// to the Figma `variant` property:
//   • `static`        — non-interactive; value in `--ui-card-filter-static-value-color-idle`.
//   • `static-empty`  — non-interactive placeholder; no icon, an em-dash value in
//                       `--ui-card-filter-static-value-color-disabled`.
//   • `clickable`     — interactive (renders a <button>); value in
//                       `--ui-card-filter-clickable-value-color`, plus hover / active /
//                       focus-visible treatments.
// Per the Figma constraint ("if an element is not clickable, it cannot have a state
// other than Idle") only `clickable` carries the hover / active / focus state
// classes — `static` / `static-empty` stay idle. Geometry (224px width, 64px min
// height, 8px radius, 16/8px padding, 8px content gap, 1px border) and every state
// color come from the `--ui-card-filter-*` tokens. Focus: a 3px `--ui-focus-primary`
// ring flush to the edge (no offset), matching the rest of the library.
const cardFilterVariants = cva(
  'inline-flex w-[224px] min-h-[var(--ui-card-filter-global-container-height)] flex-col items-start rounded-[var(--ui-card-filter-global-container-border-radius)] border-[length:var(--ui-card-filter-global-container-border-width)] border-solid border-[color:var(--ui-card-filter-global-border-color-idle)] bg-[var(--ui-card-filter-global-container-color-idle)] px-[var(--ui-card-filter-global-container-padding-x)] py-[var(--ui-card-filter-global-container-padding-y)] transition-colors',
  {
    variants: {
      variant: {
        static: '',
        'static-empty': '',
        clickable:
          'cursor-pointer outline-none hover:border-[color:var(--ui-card-filter-global-border-color-hover)] hover:bg-[var(--ui-card-filter-global-container-color-hover)] active:border-[color:var(--ui-card-filter-global-border-color-active)] active:bg-[var(--ui-card-filter-global-container-color-active)] focus-visible:border-[color:var(--ui-card-filter-global-border-color-focused)] focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]',
      },
    },
    defaultVariants: {
      variant: 'static',
    },
  }
);

// The value color is the one token that varies by variant rather than by state.
const valueColorClass: Record<
  NonNullable<VariantProps<typeof cardFilterVariants>['variant']>,
  string
> = {
  static: 'text-[var(--ui-card-filter-static-value-color-idle)]',
  'static-empty': 'text-[var(--ui-card-filter-static-value-color-disabled)]',
  clickable: 'text-[var(--ui-card-filter-clickable-value-color)]',
};

export interface CardFilterProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, 'children'>,
    VariantProps<typeof cardFilterVariants> {
  /** Caption shown above the value. */
  label?: React.ReactNode;
  /** The large value. Ignored for `variant="static-empty"` (shows an em-dash). */
  value?: React.ReactNode;
  /** Optional leading icon (16px) rendered before the value. Hidden for `static-empty`. */
  icon?: React.ReactNode;
  /**
   * Replace the rendered element (`<button>` for `clickable`, otherwise `<div>`)
   * with another element or component (Base UI composition) — e.g. a router link
   * for a clickable filter. The component's props and class names are merged onto it.
   */
  render?: useRender.RenderProp;
}

/**
 * A compact stat/filter card: a label, an optional icon, and a prominent value.
 * Use `variant="clickable"` for a filter the user can activate (renders a button);
 * `static` / `static-empty` are presentational.
 */
const CardFilter = React.forwardRef<HTMLElement, CardFilterProps>(
  (
    { className, variant = 'static', label, value, icon, render, ...props },
    ref
  ) => {
    const isEmpty = variant === 'static-empty';
    const isClickable = variant === 'clickable';
    const displayValue = isEmpty ? '–' : value;

    return useRender({
      render,
      ref,
      defaultTagName: isClickable ? 'button' : 'div',
      props: mergeProps<'button'>(
        {
          className: cn(cardFilterVariants({ variant }), className),
          ...(isClickable ? { type: 'button' as const } : {}),
          children: (
            <>
              <span className="text-xs font-normal leading-4 text-[var(--ui-card-filter-global-label-color)]">
                {label}
              </span>
              <span className="flex items-center gap-[var(--ui-card-filter-global-content-gap)] [&_svg]:size-4 [&_svg]:shrink-0">
                {!isEmpty && icon}
                <span
                  className={cn(
                    'text-2xl font-semibold leading-8',
                    valueColorClass[variant ?? 'static']
                  )}
                >
                  {displayValue}
                </span>
              </span>
            </>
          ),
        },
        props
      ),
    });
  }
);
CardFilter.displayName = 'CardFilter';

export { CardFilter, cardFilterVariants };
