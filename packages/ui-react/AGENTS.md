# AGENTS.md — `packages/ui-react`

`@acronis-platform/ui-react` — the next-generation Acronis React component
library: a **Base UI implementation** themed by `@acronis-platform/tokens-pd`
(which is generated from `@acronis-platform/design-tokens`).

Repo-wide rules (TypeScript, file naming, editing rules, Conventional
Commits, Changesets) live in the repo root's `./context/` and apply on
top of this file.

## Always-loaded workspace context

@context/conventions.md

## How this differs from `packages/ui-legacy`

- **Base UI first.** Primitives come from `@base-ui/react`, a **direct
  dependency** (legacy treats it as an optional peer and mixes in Radix).
  Don't add Radix here. For element composition use Base UI's `useRender`
  - `mergeProps` (the `render` prop), not Radix `Slot` / `asChild`.
- **Theming via generated tokens.** Color comes from
  `@acronis-platform/tokens-pd` (`--ui-*` CSS custom properties; light/dark via
  `light-dark()` + the `[data-theme]` attribute). `src/styles/index.css` imports
  `@acronis-platform/tokens-pd/css/default.css` and bridges those onto Tailwind color
  names via `@theme inline`. Don't hand-author theme values here — change them in
  `@acronis-platform/design-tokens` and rebuild `@acronis-platform/tokens-pd`.

## Shared conventions kept from legacy

- React **functional components**; `React.forwardRef` for ref-accepting
  primitives.
- **`class-variance-authority`** for variants; expose them via
  `VariantProps`. Merge classes with `cn()` (`src/lib/utils.ts`).
- **Tailwind CSS v4** utilities. PascalCase component names; kebab-case files.

## Reusing the shared demos

The `@acronis-platform/shadcn-uikit-demos` workspace (used by `apps/demo`
and `apps/docs` for the legacy library) is reused here. The demos import
the legacy package specifier; `.storybook/main.ts` aliases
`@acronis-platform/shadcn-uikit[/react]` to this library's `src`, so the
**same demo source** renders against ui-react's components (see
`button/__stories__/button-demos.stories.tsx`). Only add demo-backed
stories for components ui-react actually exports, or the Storybook build
will fail to resolve the missing ones.

> A neutral import token (aliased per consumer) was tried so apps/demo,
> apps/docs, and this Storybook could all switch libraries. It works for
> Vite consumers but breaks the Next/RSC docs build — bundler-aliasing a
> `"use client"` component drops it from Next's client manifest, so it
> renders as `undefined`. Hence the alias lives only here (Vite, no RSC).

## File layout per component

```
src/components/ui/<component>/
├── <component>.tsx
├── <component>.figma.tsx        (optional — Figma Code Connect)
├── index.ts
├── __tests__/<component>.test.tsx
└── __stories__/<component>.stories.tsx
```

## Figma Code Connect

Components can be linked to their Figma counterparts via co-located
`<component>.figma.tsx` files (excluded from the published build). See
`context/figma-code-connect.md` for the setup, status markers, and the
`figma:connect` / `figma:connect:publish` commands.

## Stack

- React 19, TypeScript, Vite 6 (library build via `vite.lib.config.ts`),
  Vitest 4 + React Testing Library (happy-dom), Storybook 10, Tailwind v4.

## Visual regression

Storybook stories double as visual regression cases, run by
`@storybook/test-runner` + `jest-image-snapshot` (config in
`.storybook/test-runner.ts`). Each story is screenshotted and compared to a
committed PNG baseline under `test/__snapshots__/`.

**Baselines are generated in Docker (Linux)** so they match CI — never commit
baselines rendered on macOS/Windows. After adding or changing any story:

```bash
# regenerate + review baselines (Docker must be running)
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:update
# check against committed baselines (what CI runs on every PR)
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker
```

The `storybook:test:visual[:update]` scripts run the same thing without Docker
(host renderer) — useful for a quick local look, but their output must **not**
be committed. See `test/__snapshots__/README.md`. CI:
`.github/workflows/visual-regression.yml` (matrix over `ui-legacy` + `ui-react`).

Every Docker capture goes through `scripts/visual-capture.mjs`: it builds
Storybook once for all profiles, takes an exclusive lock (two captures in one
checkout interleave writes into `test/__snapshots__`), runs **every** requested
profile even if an earlier one fails, logs each to `.visual-capture/`, and reads
its verdict from jest's summary lines rather than an exit code — a profile that
printed no `Tests:` line is reported as DID NOT RUN and fails the result.

**Four further profiles cover the OS `prefers-color-scheme` axis** — the states
where `[data-theme]` is absent (so the OS decides) or disagrees with the OS, none
of which light/dark can reach because they pin the attribute and leave the OS at
light. With light/dark they are the full `[data-theme]` × OS cross product:

```bash
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:system-dark
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:system-light
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:forced-light
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:forced-dark
# all four in one run (the capture script's `--mode themes`)
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:themes
```

They **write no baselines** — each re-renders a curated ~15% story sample under a
different theme input and must reproduce the committed light/dark PNGs exactly; a
diff means styling keyed on `[data-theme]` rather than resolved through a token.
Hence no `:update` variant, and adding a story means running `…:docker:update:all`
_before_ them. Details in `.storybook/visual-regression.ts` and
`scripts/system-theme-subset.mjs`.

The sample is the **PR** default, for latency: `.github/workflows/visual-regression-themes-full.yml`
runs the same four profiles over the **whole corpus** weekly (and on
`workflow_dispatch`), which is what catches a component outside the sample. Locally,
`node scripts/visual-capture.mjs --full --mode themes`.

A story that is knowingly different under one of these profiles goes in
`.storybook/theme-deviations.json`, **not** into a new baseline. The entry inverts
the assertion — the story must differ, and the run fails once it stops differing, so
the waiver cannot outlive its cause. One entry today — the shadow-DOM popover story,
which the token bundle's `:host { color-scheme: light dark }` makes follow the OS
(acronis/uikit#674). Fixing the component is otherwise the default response.

## When you add or change anything in `src/`

1. Add a Vitest test under the component's `__tests__/`.
2. Add a Storybook story under the component's `__stories__/` covering
   all variants, checked under light **and** dark mode.
3. Regenerate the visual regression baselines in Docker (see above) and
   review the new/changed PNGs before committing them.
4. Add a Changeset: `pnpm changeset` (from repo root).
5. (Optional) Add/refresh a `<component>.figma.tsx` Code Connect mapping —
   see `context/figma-code-connect.md`.

See `../../context/releasing.md` for the Changesets / publish flow.
