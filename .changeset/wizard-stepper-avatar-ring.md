---
'@acronis-platform/ui-react': patch
---

Two fixes to `Wizard`'s examples and fixtures. No public API change to
`Wizard`, `Stepper`, `StepperItem`, or `Section`.

**Stepper avatar alignment.** `Wizard`'s Stepper examples (stories, Code
Connect fixture, test composition) now compose their `Avatar` step markers
the same way `StepperItem` documents: `[box-shadow:none]` switches off
Avatar's 2px outset ring — built for `AvatarGroup` separation, it otherwise
shows as a halo on a step's filled container — and the `current`/`future`
markers recolor their digit to the matching
`--ui-stepper-item-{current,future}-label-color` token.

**Section API migration.** The same examples had been left behind by an
already-released breaking change in `Section`: `SectionTitle` and
`SectionDescription` no longer exist in this package. Wizard's stories, docs
demo, and test fixtures now pass `SectionHeader`'s `title` / `description` /
`hasDescription` props instead. This changes rendered output inside Wizard's
own examples: the step-body section title is now a styled paragraph rather
than an `<h2>`, and each example grows roughly 12–14px taller. Copy the
updated examples if you were mirroring the old composition.
