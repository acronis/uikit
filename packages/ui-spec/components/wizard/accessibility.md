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
- **Heading outline.** `PageHeaderTitle` is an `<h1>` — one per page. Section
  titles inside `WizardBody` are `<h2>` (`SectionTitle`), so the outline reads
  h1 → h2 without a gap.
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
  order (Cancel, Back, Next/Submit) rather than reordering visually, and disable
  rather than remove `Back` on the first step so focus doesn't jump between steps.
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
