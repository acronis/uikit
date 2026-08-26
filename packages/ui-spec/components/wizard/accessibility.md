# Wizard — accessibility

Wizard is a layout scaffold: it renders no text and no interactive element of its
own, so nearly all of its accessibility contract belongs to the components the
consumer composes into it. What Wizard itself is responsible for is not getting in
their way.

- **No landmark of its own.** Neither `Wizard` nor `WizardHeader` sets a `role`.
  `PageHeader`'s root is deliberately **not** reused for the header band —
  it carries `role="banner"`, and a wizard's header band is not the page banner.
  Composing `PageHeaderRow` / `PageHeaderTitle` / `PageHeaderActions` directly
  keeps the landmark structure honest and avoids a second `banner` on a page that
  already has one (e.g. inside `AppShell`).
- **Heading outline.** `PageHeaderTitle` is an `<h1>` — one per page, and the
  only heading the wizard template contributes on its own. `SectionHeader`'s
  `title` prop renders a `<p>`, not a heading, so a step's `Section` adds
  nothing to the document outline: an `<h1>` alone is the whole outline. That's
  fine for a single-section step, where the `<h1>` already names the flow. If a
  step's body needs navigable structure — several `Section`s, or one a
  screen-reader user should be able to jump to — `Section` offers an escape
  hatch: pass a real heading (`h2`, to sit directly under the wizard's `<h1>`)
  through `SectionHeader`'s `children` slot and omit `title` so the section
  isn't titled twice; see
  [`section/accessibility.md`](../section/accessibility.md) for the markup and
  the styling you have to supply yourself. Wizard's own stories don't use that
  escape hatch — the multi-`Section` story titles each section with `title`, so
  those steps contribute no headings beyond the `<h1>`.
- **The subtitle is a plain `<p>`**, not a heading and not the title's accessible
  description. If the flow needs it announced with the title, associate it
  explicitly (`aria-describedby` on the relevant control), since proximity alone
  conveys nothing to a screen reader.
- **Step progress** is announced by the composed `Stepper`, which owns that
  contract (see the Stepper spec). A wizard that omits the stepper — as two- and
  three-step flows may — leaves the user without a progress cue, so give those
  flows a title or subtitle that makes the position obvious.
- **Navigation actions** are plain `Button`s the consumer supplies, so their
  accessible names come from their own children. Keep them as real buttons in DOM
  order — Cancel, then `Back` on middle steps only, then Next/CTA — matching the
  per-step pairing in [`behavior.md`](./behavior.md), rather than reordering
  visually. Because that pairing genuinely adds and removes `Back` between steps
  (it is absent, not disabled, on the first and final steps), the action row's
  composition changes as the flow advances. Wizard tracks no step index and moves
  no focus, so the consumer owns the transition: after navigating, move focus
  deliberately — to the new step's first focusable field, since (per the
  heading-outline bullet above) a step's `Section` title is a `<p>` and
  contributes no heading to land on by default — so it never lands on a
  button that has just been removed or shifted position, and never silently
  falls back to the document body.
- **Sticky header and focus.** The header band is `position: sticky`, so it can
  overlay content scrolled under it. Give focusable content inside `WizardBody`
  enough scroll margin that keyboard focus never lands underneath the band.
- **RTL.** Wizard uses only symmetric (`p-`) and logical spacing, so the whole
  template mirrors under `dir="rtl"` with no per-part handling.

## Contrast

The header band pairs `--ui-background-surface-secondary` with the composed
parts' own on-surface text colors; the subtitle uses
`--ui-text-on-surface-secondary` (via `text-muted-foreground`). Both meet
contrast in light and dark. The band's bottom rule is
`--ui-border-on-surface-divider`, a decorative separator — the header/content
boundary is also conveyed structurally, not by that line alone.
