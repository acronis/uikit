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
  `@acronis-platform/tokens-pd/acronis.css` and bridges those onto Tailwind color
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

## When you add or change anything in `src/`

1. Add a Vitest test under the component's `__tests__/`.
2. Add a Storybook story under the component's `__stories__/` covering
   all variants, checked under light **and** dark mode.
3. Add a Changeset: `pnpm changeset` (from repo root).
4. (Optional) Add/refresh a `<component>.figma.tsx` Code Connect mapping —
   see `context/figma-code-connect.md`.

See `../../context/releasing.md` for the Changesets / publish flow.
