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
