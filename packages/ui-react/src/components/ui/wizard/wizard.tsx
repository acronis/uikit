import * as React from 'react';

import { cn } from '@/lib/utils';

// The full-page wizard page template, from the Figma "RegionMain" frame
// (ui-react file, node 10511-61418).
//
// ── Why this is layout only ──
// Wizard is a *composition*, not a new primitive: every visual part it needs
// already exists in this package (`Breadcrumb`, `PageHeaderRow` /
// `PageHeaderTitle` / `PageHeaderActions`, `Stepper` + `StepperItem`,
// `Section`, `Button`). Its whole job is the structural skeleton — the sticky
// header band, its stacking gap, and the capped content column — plus slots for
// those parts. It deliberately owns **no** step state, no navigation, and no
// button wiring: which of Cancel / Back / Next / Submit shows on which step is a
// per-flow product decision the design brief assigns to the consuming UI block,
// not to the kit (the same call `PageHeader` makes about its own actions slot).
// So there is no `step`/`currentStep`/`onNext` prop here by omission, not
// oversight.
//
// ── Reuse over new parts ──
// The title row is functionally identical to `PageHeader`'s, so consumers place
// `PageHeaderRow` / `PageHeaderTitle` / `PageHeaderActions` directly inside
// `WizardHeader` rather than getting near-duplicate `WizardTitle` /
// `WizardActions` parts. `PageHeader`'s *root* is intentionally not reused: it
// carries `role="banner"`, and the wizard header band is not a page banner —
// composing the row parts alone keeps the landmark structure honest.
// `WizardSubtitle` is the one piece of typography with no existing home (a
// dedicated `Subtitle` component was considered and rejected upstream), so it
// reuses `PageHeaderDescription`'s exact body/secondary text treatment instead
// of inventing a scale.
//
// ── Tokens ──
// The header band's surface, divider, padding, and stacking gap come from the
// generic semantic tiers (`--ui-background-surface-secondary`,
// `--ui-border-on-surface-divider`, `--ui-gap-16`, `--ui-gap-12`) — Figma
// references no `components/Wizard/*` variables, and there is no
// `--ui-wizard-*` tier in @acronis-platform/tokens-pd.
//
// The body's 1024px cap is the one hardcoded number, and it is a plain layout
// constant rather than a themed value — the same call `dialog.tsx` makes for its
// `large` size's 832px. It is deliberately *not* written as
// `var(--ui-breakpoint-lg)` even though that hand-authored bridge var also
// resolves to 1024px: a content column's max width and a viewport breakpoint are
// independent facts that happen to coincide today, and tying them would make a
// future change to either silently move the other. No `cva` variant either —
// Figma shows exactly one width; a per-step override goes through `className`,
// exactly as Dialog's per-instance width override does.
//
// The body is horizontally centered (`mx-auto`), not left-aligned with the
// header's content: the Figma frame is 1344px wide with `containerBody` at
// x=160/width=1024 — (1344 - 1024) / 2 = 160 on both sides, a centered column,
// while `WizardHeader`'s content spans edge-to-edge inside its own 16px padding.
// The two rows are intentionally not flush on the same left edge.

const Wizard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="wizard"
    className={cn('flex h-full w-full flex-col', className)}
    {...props}
  />
));
Wizard.displayName = 'Wizard';

// The header band: breadcrumb, title row, optional subtitle, and optional
// stepper, stacked in that order as children. Sticky, so the step context and
// the Cancel/Back/Next actions stay reachable while a long step body scrolls.
const WizardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="wizard-header"
    className={cn(
      'sticky top-0 z-10 flex w-full flex-col gap-[var(--ui-gap-12)] border-b border-[var(--ui-border-on-surface-divider)] bg-[var(--ui-background-surface-secondary)] p-[var(--ui-gap-16)]',
      className
    )}
    {...props}
  />
));
WizardHeader.displayName = 'WizardHeader';

// Optional supporting line under the title row. Same treatment as
// `PageHeaderDescription` — body size, secondary (muted) color.
const WizardSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="wizard-subtitle"
    className={cn(
      'text-sm font-normal leading-6 text-muted-foreground',
      className
    )}
    {...props}
  />
));
WizardSubtitle.displayName = 'WizardSubtitle';

// The step's content column, capped at 1024px. Always meant to wrap a
// `Section` (or several) — the wizard step's own fields live inside that, not
// here.
const WizardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="wizard-body"
    className={cn(
      'mx-auto flex w-full max-w-[1024px] flex-col pb-[var(--ui-gap-16)]',
      className
    )}
    {...props}
  />
));
WizardBody.displayName = 'WizardBody';

export { Wizard, WizardHeader, WizardSubtitle, WizardBody };
