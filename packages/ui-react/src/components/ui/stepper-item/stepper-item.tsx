'use client';

import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// One step in a stepper: an Avatar marker (the step's number, icon, or image)
// followed by the step name. `variant` is the step's structural role in the
// sequence — `current` (where the user is, highlighted with a fill and border),
// `completed` (already passed, and so realistically clickable to jump back —
// its container reacts to `state`), `future` (not reachable yet, always
// disabled). `state` is the interaction look and only paints anything on a
// `completed` step: `current` is always rendered highlighted and `future` is
// always rendered disabled, which is exactly what the Figma component set
// models.
//
// The Avatar is fully consumer-supplied and consumer-styled: this component
// renders the element it is given verbatim and never sizes, tints, or recolors
// it. Figma's `current`/`future` avatars DO recolor the digit *inside* the
// circle to `--ui-stepper-item-{current,future}-label-color` — the exact same
// token this component uses for the step name — overriding Avatar's own
// per-scheme label color (verified directly in the Figma reference markup: the
// digit's `text-[color:…]` references `components/Stepper/Item/{current,
// future}/label/color`, not `components/Avatar/label/color/*`). Because the
// marker is a caller-owned slot, that override is the caller's job, not this
// component's — compose it as
// `<Avatar className="text-[var(--ui-stepper-item-current-label-color)]" …>`
// (see the stories/demo for the current and future variants). `completed`'s
// checkmark is a fixed icon asset, not text, so it needs no such override.
//
// ── Tokens — dedicated `--ui-stepper-item-*` tier (2026-08-24) ──
// Re-synced from Figma: @acronis-platform/tokens-pd now ships a `Stepper` tier
// (see `packages/tokens-pd/css/Stepper/default.css`), which replaces the
// semantic/generic placeholder tokens (`--ui-background-surface-*`,
// `--ui-text-on-surface-*`) this component used before that tier existed. The
// tier's `global-container-padding-{l,r}` are asymmetric (8px / 16px) — the
// start side sits closer to the avatar, the end side gives the label room — so
// padding is split rather than a single `px-*` utility. Mapped with logical
// `ps-`/`pe-` so the asymmetry mirrors with the flex order under `dir="rtl"`
// (Figma's `paddingLeft/Right` naming describes its LTR frame, not a physical
// side).
//
// The label's typography comes from the same tier as a generated *class*
// (`.ui-stepper-item-global-container-text-style` — family / 14px / 500 / 24px /
// letter-spacing) rather than as `--ui-*` custom properties, so it is applied
// verbatim by name, the way `Alert`, `InputOTP`, and the sidebars apply theirs.
// Transcribing it into discrete utilities would silently drop the properties
// that have no utility here (family, letter-spacing) and drift when the tier
// changes.
const stepperItemVariants = cva(
  'ui-stepper-item-global-container-text-style inline-flex items-center gap-[var(--ui-stepper-item-global-container-gap)] rounded-[var(--ui-stepper-item-global-container-border-radius)] ps-[var(--ui-stepper-item-global-container-padding-l)] pe-[var(--ui-stepper-item-global-container-padding-r)] py-[var(--ui-stepper-item-global-container-padding-y)] outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]',
  {
    variants: {
      variant: {
        current:
          'border-[length:var(--ui-stepper-item-current-container-border-width)] border-[var(--ui-stepper-item-current-container-border-color)] border-solid bg-[var(--ui-stepper-item-current-container-color)] text-[var(--ui-stepper-item-current-label-color)]',
        completed: 'text-[var(--ui-stepper-item-completed-label-color)]',
        future:
          'pointer-events-none text-[var(--ui-stepper-item-future-label-color)]',
      },
      // Declared as an axis so the variant x state matrix below can key off it;
      // on its own it paints nothing, because only `completed` reacts to it.
      state: {
        idle: '',
        hover: '',
        active: '',
        focus: '',
      },
    },
    compoundVariants: [
      {
        variant: 'completed',
        state: 'hover',
        class: 'bg-[var(--ui-stepper-item-completed-container-color-hover)]',
      },
      {
        variant: 'completed',
        state: 'active',
        class: 'bg-[var(--ui-stepper-item-completed-container-color-active)]',
      },
      {
        // `-focus-ring` resolves to the exact same value as `--ui-focus-primary`
        // (verified in tokens-pd) — it names a ring color, not a fill, so this
        // renders the same 3px ring `focus-visible` already draws automatically
        // on a composed control, rather than a solid background.
        variant: 'completed',
        state: 'focus',
        class:
          'ring-[3px] ring-[var(--ui-stepper-item-completed-container-color-focus-ring)]',
      },
    ],
    defaultVariants: {
      variant: 'current',
      state: 'idle',
    },
  }
);

/** Kept in lockstep with the `cva` axes above. */
export type StepperItemVariant = NonNullable<
  VariantProps<typeof stepperItemVariants>['variant']
>;
export type StepperItemState = NonNullable<
  VariantProps<typeof stepperItemVariants>['state']
>;

export interface StepperItemProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The step's structural role in the sequence. Drives the container background
   * and the label color. Defaults to `current` for prop ergonomics — in a real
   * sequence every step declares its own.
   */
  variant?: StepperItemVariant;
  /**
   * Interaction state. Only produces a different look when `variant` is
   * `completed` (`idle` has no background; `hover`, `active`, and `focus` each
   * paint their own). Ignored for `current`, which always renders in its
   * highlighted look, and for `future`, which always renders disabled and
   * non-interactive.
   */
  state?: StepperItemState;
  /**
   * The step's marker — required, and entirely the caller's to compose. Pass any
   * `Avatar` composition (color scheme, initials / icon / image, size overrides);
   * this component renders it verbatim and never styles it.
   */
  avatar: React.ReactElement;
  /** The step name. */
  label?: React.ReactNode;
  /**
   * Replace the rendered `<div>` with another element or component (Base UI
   * composition) — e.g. a `<button>`, since a completed step is usually a way
   * back to an earlier step.
   */
  render?: useRender.RenderProp;
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  (
    {
      className,
      variant = 'current',
      state = 'idle',
      avatar,
      label,
      render,
      children,
      ...props
    },
    ref
  ) => {
    // Hoisted out of the `mergeProps` literal: `data-*` keys aren't part of the
    // Base UI element prop type, so they only pass the excess-property check
    // when spread in (same shape as CardFilter's `data-selected`).
    const attributes = {
      'data-slot': 'stepper-item',
      'data-variant': variant,
      'data-state': state,
      ...(variant === 'future'
        ? {
            'aria-disabled': true,
            // `pointer-events-none` only stops the mouse. Without this, a step
            // composed as a real control (`render={<button />}`) would still be
            // reachable by Tab and activatable by Enter/Space, which contradicts
            // what `aria-disabled` promises. A consumer prop still wins — `props`
            // is merged after these.
            tabIndex: -1,
            // ARIA 1.2: `aria-disabled` on an element with no widget role is not
            // announced, and the default rendering here is a plain `<div>`. Give
            // it an explicit role so "unavailable" actually reaches assistive
            // tech — the same fix `BreadcrumbPage` applies to the current-page
            // `<span>`. Skipped when the consumer composes a real element via
            // `render`, which brings its own (correct) role.
            ...(render ? {} : { role: 'link' }),
          }
        : {}),
    };

    return useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        {
          ...attributes,
          className: cn(stepperItemVariants({ variant, state }), className),
          children: (
            <>
              {avatar}
              {label != null && (
                <span className="min-w-0 truncate">{label}</span>
              )}
              {children}
            </>
          ),
        },
        props
      ),
    });
  }
);
StepperItem.displayName = 'StepperItem';

export { StepperItem, stepperItemVariants };
