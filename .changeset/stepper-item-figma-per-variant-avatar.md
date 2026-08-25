---
'@acronis-platform/ui-react': patch
---

fix(stepper-item): show the right avatar per variant in the Code Connect example

`stepper-item.figma.tsx` composed a single blue numbered `Avatar` for all three
`type` values, so Figma's Code Connect snippet suggested that markup for
`completed` (which uses a green `CheckIcon`) and `future` (gray) too, and omitted
the `text-[var(--ui-stepper-item-*-label-color)]` digit override the stories and
docs demo rely on. The avatar is now mapped per variant via `figma.enum('type',
…)` with literal JSX values — Code Connect serializes the example body
statically, so the branching has to live in the props mapping rather than in a
helper the example calls. The three snippets match `stepper-item.stories.tsx` and
the docs demo, and the `Avatar`/`AvatarFallback`/`CheckIcon` imports are pinned
so the published snippet compiles. Code Connect fixtures are excluded from the
published bundle, so there is no runtime or API change.
