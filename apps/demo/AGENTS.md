# AGENTS.md — `apps/demo`

`@acronis-platform/shadcn-uikit-demo` — the Vite-based demo SPA used to
exercise components in realistic flows. **Private**, not published.

Cross-cutting topics live in `../../context/*.md`. This file documents
only what is specific to this workspace.

## Stack

- **Vite 6** SPA, React 19, TypeScript.
- **React Router v7** (`react-router-dom`) for navigation.
- **Zustand** for state management.
- **i18next** + `react-i18next` for localization.
- **react-hook-form** + `@hookform/resolvers` + **zod 4** for forms.
- **emoji-picker-react**, **react-colorful**, **react-syntax-highlighter**
  for richer demo flows.

## Running

```bash
pnpm --filter @acronis-platform/shadcn-uikit-demo dev
```

Opens at `http://localhost:3000`. Preview the built app with
`pnpm --filter @acronis-platform/shadcn-uikit-demo preview`.

## What this workspace is for

- Manual verification of `@acronis-platform/shadcn-uikit` changes in
  realistic page layouts (forms, tables, dialogs, toasts).
- Theme switching: the demo lets you flip through `acronis-default`,
  `acronis-ocean`, `cyber-chat`, and white-label variants.
- i18n smoke testing — strings live under `src/i18n/` (or similar).

## No tests here

This workspace has no automated test suite (and no `test` / `test:watch` scripts).
Component-level coverage belongs in `packages/legacy/ui`'s Vitest + Storybook suites. If you're tempted to add a test here, ask whether it belongs in the library workspace instead.

## zod version note

This workspace uses **zod 4** (pinned at `4.2.1`, matching the library).
`apps/demos` still uses zod 3 — see its `AGENTS.md` and the catalog note
in `pnpm-workspace.yaml` for context. Don't try to align them in passing.
