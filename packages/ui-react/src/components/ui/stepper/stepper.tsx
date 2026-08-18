'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

// The stepper root. It renders the sequence two ways and lets CSS pick one:
// a start-aligned, wrapping row of `StepperItem` children on wide viewports, and a
// two-line text summary ("Step 3 of 5: <current>" / "Next: <next>") on narrow
// ones. There is no `variant` prop and no `cva`: the only axis the design has
// is the viewport width, which is not something JS decides here.
//
// ── Why a real media query, and why both trees always render ──
// The Figma component models the two layouts as a `breakpoint` variant
// (`0-1024` / `>1025`). In code that is a viewport media query, so it is
// expressed with Tailwind's stock `lg:` variant (`hidden lg:flex` /
// `flex lg:hidden`) rather than a `ResizeObserver`. `page-header.tsx`'s
// `useRowOverflow` hook is deliberately *not* reused: that measures whether
// content fits its own container (a content-fit problem), which is a different
// question from "how wide is the viewport". A media query needs no measuring
// pass, no hydration mismatch, and no layout thrash.
//
// Consequence, and it is intentional: **both subtrees are always in the DOM**,
// and only their visibility differs. Nothing is `aria-hidden`, because which
// tree is showing is not knowable from JS — the browser decides it in CSS.
// That is correct rather than a compromise: `hidden` / `lg:hidden` resolve to
// `display: none`, and a `display: none` subtree is not exposed to assistive
// tech, so exactly one of the two is announced at any width. In jsdom, though,
// no media query is evaluated, so unit tests see both at once.
//
// ── Breakpoint boundary: 1024, not 1025 ──
// Figma's variant names say `0-1024` and `>1025`, which leaves 1024px itself
// ambiguous and 1025 as the first "desktop" pixel. Tailwind's `lg:` is
// `@media (min-width: 64rem)` = exactly 1024px (see the `@theme` block in
// `src/styles/index.css` and `BREAKPOINT_LG` in `src/lib/breakpoints.ts`), so
// 1024px renders the desktop row here. That 1px difference is accepted rather
// than hand-rolling a one-off `1025px` query: the repo already pins the design
// team's ranges to clean rem values and documents the rounding where it differs
// (see the comments in `src/stories/breakpoints-demo.stories.tsx`), and
// inventing a bespoke breakpoint for one component would put it out of step
// with every other responsive surface in the kit.
//
// ── Token substitution (placeholder — re-point once design ships the tier) ──
// Same situation as `StepperItem`: the design references `components/Stepper/*`
// variables, but there is no `--ui-stepper-*` tier in
// @acronis-platform/tokens-pd (a grep for `Stepper` across tokens-pd and the
// design-tokens source returns nothing). Rather than hand-author values, this
// consumes the semantic/generic tokens whose *resolved* value in
// `packages/tokens-pd/css/default.css` matches the Figma variable exactly —
// verified value-by-value:
//
//   components/Stepper/_global/list/gap      (4px)     -> --ui-gap-4
//   (the item row's gap came through Figma as the generic `gap/gap-8`,
//    the same 8px token StepperItem already uses internally)   -> --ui-gap-8
//   components/Stepper/_global/prefix/color  (#61656b) -> --ui-text-on-surface-secondary
//   components/Stepper/current/label/color   (#18191b) -> --ui-text-on-surface-primary
//   components/Stepper/next/label/color      (#18191b) -> --ui-text-on-surface-primary
//
// The last two are separate Figma variables carrying an identical value, so one
// semantic token covers both faithfully — and it is the same token StepperItem
// already uses for its own label, which is the point.

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The `StepperItem` elements making up the sequence. Rendered in the wide
   * (>= 1024px) layout only — the compact layout is a text summary and shows no
   * items at all.
   */
  children?: React.ReactNode;
  /** 1-based index of the step the user is on, e.g. `3`. Compact layout only. */
  currentStep: React.ReactNode;
  /** How many steps there are in total, e.g. `5`. Compact layout only. */
  totalSteps: React.ReactNode;
  /** The current step's name. Compact layout only. */
  current: React.ReactNode;
  /**
   * The next step's name. Omit it — on the last step, say — and the whole
   * "Next: …" line is left out rather than rendered empty. Compact layout only.
   */
  next?: React.ReactNode;
  /**
   * The word introducing the step counter. A prop, not an inlined literal, so
   * the string can be translated (see `context/conventions.md` §"Localization —
   * no hardcoded labels"): this component generates the text itself, unlike the
   * step names, which the caller supplies.
   */
  stepLabel?: string;
  /** The word joining the current step number to the total. Translatable — see `stepLabel`. */
  ofLabel?: string;
  /** The label introducing the next step's name. Translatable — see `stepLabel`. */
  nextLabel?: string;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      className,
      children,
      currentStep,
      totalSteps,
      current,
      next,
      stepLabel = 'Step',
      ofLabel = 'of',
      nextLabel = 'Next:',
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      data-slot="stepper"
      className={cn('w-full', className)}
      {...props}
    >
      {/* Compact summary — the only thing visible below the `lg` breakpoint. */}
      <div
        data-slot="stepper-summary"
        className="flex flex-col gap-[var(--ui-gap-4)] text-sm leading-6 lg:hidden"
      >
        <p data-slot="stepper-current-line">
          <span className="text-[var(--ui-text-on-surface-secondary)]">
            {stepLabel} {currentStep} {ofLabel} {totalSteps}
            {/* Punctuation joining the counter to the step name, not copy: it is
                part of the Figma string and has no separate variable. */}
            {': '}
          </span>
          <span className="text-[var(--ui-text-on-surface-primary)]">
            {current}
          </span>
        </p>
        {next != null && (
          <p data-slot="stepper-next-line">
            <span className="text-[var(--ui-text-on-surface-secondary)]">
              {nextLabel}{' '}
            </span>
            <span className="text-[var(--ui-text-on-surface-primary)]">
              {next}
            </span>
          </p>
        )}
      </div>

      {/* The item row — hidden below `lg`, where the summary replaces it. */}
      <div
        data-slot="stepper-items"
        className="hidden flex-wrap content-start items-start justify-start gap-[var(--ui-gap-8)] lg:flex"
      >
        {children}
      </div>
    </div>
  )
);
Stepper.displayName = 'Stepper';

export { Stepper };
