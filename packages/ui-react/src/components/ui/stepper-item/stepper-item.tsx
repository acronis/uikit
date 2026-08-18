'use client';

import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// One step in a stepper: an Avatar marker (the step's number, icon, or image)
// followed by the step name. `variant` is the step's structural role in the
// sequence — `current` (where the user is), `completed` (already passed, and so
// realistically clickable to jump back), `future` (not reachable yet). `state`
// is the interaction state, and it only produces a different look on a
// `completed` step: `current` is always painted in its highlighted look and
// `future` is always painted disabled, which is exactly what the Figma component
// set models — only five state x variant combos exist there
// (active+current, idle/hover/active+completed, disabled+future).
//
// The Avatar is fully consumer-supplied and consumer-styled: this component
// renders the element it is given verbatim and never sizes, tints, or recolors
// it. That is why the Figma variables that color the digit *inside* the circle
// (`components/Stepper/Item/{current,future}/label/color/*`) are deliberately
// not consumed here — they belong to whatever the caller puts in the `avatar`
// slot.
//
// ── Token substitution (placeholder — re-point once design ships the tier) ──
// The design references `components/Stepper/Item/*`, which is not "ready for
// dev": there is no `--ui-stepper-item-*` tier in @acronis-platform/tokens-pd
// (a grep for `Stepper` across tokens-pd and the design-tokens source returns
// nothing). Rather than hand-author values, this consumes the semantic/generic
// tokens whose *resolved* value in `packages/tokens-pd/css/default.css` matches
// the Figma variable exactly — verified value-by-value:
//
//   components/Stepper/Item/_global/container/gap          (8px)     -> --ui-gap-8
//   components/Stepper/Item/_global/container/paddingY      (8px)     -> --ui-gap-8
//   (padding-x came through Figma as the generic `gap/gap-16`)        -> --ui-gap-16
//   components/Stepper/Item/_global/container/borderRadius  (8px)     -> `rounded-lg`
//   components/Stepper/Item/_global/container/color/active  (#e2ebf5) -> --ui-background-surface-active
//   components/Stepper/Item/_global/container/color/hover   (#eef2f7) -> --ui-background-surface-hover
//   semantics/colors/text/onSurface/primary                 (#18191b) -> --ui-text-on-surface-primary
//   semantics/colors/text/onSurface/disabled                (#afb2b6) -> --ui-text-on-surface-disabled
//
// The radius is the one exception that stays a static Tailwind utility: tokens-pd
// has no generic radius scale at all — every `*border-radius*` token is
// component-owned (e.g. `--ui-card-filter-global-container-border-radius`) — so
// there is nothing honest to point at, and inventing a token name would be worse
// than an 8px utility. Figma also defines three separate
// `completed/label/color/{idle,hover,active}` variables, but all three carry the
// identical `#18191b`, so the single semantic token covers them faithfully.
//
// `connectingLine` is *not* a Figma variant on this node — the component set has
// only the five combos above. It is a net-new product requirement, so it follows
// Timeline's precedent: a logical-CSS 1px border (never a baked SVG, which cannot
// mirror under `dir="rtl"`) themed with `--ui-border-on-surface-border`, which is
// Timeline's own documented substitute for its equally un-shipped
// `components/Timeline/connectorColor`. Same situation, same substitute, so one
// connector still looks like one thing across the kit.
const stepperItemVariants = cva(
  'relative inline-flex items-center gap-[var(--ui-gap-8)] rounded-lg px-[var(--ui-gap-16)] py-[var(--ui-gap-8)] text-sm leading-6',
  {
    variants: {
      variant: {
        current:
          'bg-[var(--ui-background-surface-active)] text-[var(--ui-text-on-surface-primary)]',
        completed: 'text-[var(--ui-text-on-surface-primary)]',
        future:
          'pointer-events-none text-[var(--ui-text-on-surface-disabled)]',
      },
      // Declared as an axis so the variant x state matrix below can key off it;
      // on its own it paints nothing, because only `completed` reacts to it.
      state: {
        idle: '',
        hover: '',
        active: '',
      },
    },
    compoundVariants: [
      {
        variant: 'completed',
        state: 'hover',
        class: 'bg-[var(--ui-background-surface-hover)]',
      },
      {
        variant: 'completed',
        state: 'active',
        class: 'bg-[var(--ui-background-surface-active)]',
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

export interface StepperItemProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The step's structural role in the sequence. Drives the container background
   * and the label color. Defaults to `current` for prop ergonomics — in a real
   * sequence every step declares its own.
   */
  variant?: StepperItemVariant;
  /**
   * Interaction state. Only produces a different look when `variant` is
   * `completed` (`idle` has no background, `hover` and `active` paint one).
   * Ignored for `current`, which always renders in its highlighted look, and for
   * `future`, which always renders disabled and non-interactive.
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
   * Draw a connector trailing this step, so a row of steps visually chains
   * together. Not a Figma variant — a product requirement, rendered as a 1px
   * logical border matching Timeline's connector treatment.
   */
  connectingLine?: boolean;
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
      connectingLine = false,
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
      // Meaningful when the consumer renders this as a real control; inert
      // (but still honest to assistive tech) on the default `<div>`.
      ...(variant === 'future' ? { 'aria-disabled': true } : {}),
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
              {connectingLine && (
                <span
                  data-slot="stepper-item-connecting-line"
                  aria-hidden
                  className="absolute top-1/2 start-full w-[var(--ui-gap-16)] border-t border-[var(--ui-border-on-surface-border)]"
                />
              )}
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
