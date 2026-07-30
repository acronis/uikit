# AGENTS.md — `apps/demos`

`@acronis-platform/shadcn-uikit-demos` — a **source-only** workspace
that houses reusable component demos consumed by `apps/demo`.
**Private**, not published.

Cross-cutting topics live in `../../context/*.md`. This file documents
only what is specific to this workspace.

## No build, no dev server

This is the workspace's defining characteristic. All scripts are
intentional no-ops:

- `build` → `echo "no build (consumed via source by apps/demo)" && exit 0`
- `clean`, `test`, `test:watch` → `echo … && exit 0`

The package is consumed **via source** through the `exports` map:

```json
"exports": {
  "./*": "./src/*/index.ts",
  "./icons/missing-icons": "./src/icons/missing-icons.tsx"
}
```

`apps/demo` compiles the TypeScript directly as part of its own build.
There is no `dist/` and no watch mode.

The only scripts that actually run are `lint`, `lint:fix`, and
`typecheck`.

## Stack

- React 19 (peer dep, supplied by the consumer).
- **TanStack Form** + **TanStack zod adapter** alongside **react-hook-form**
  — both are showcased to compare patterns.
- **zod 3** (pinned at `3.25.76`). **Intentionally different from**
  `apps/demo` and `packages/ui-legacy`, which are on zod 4. The form
  libraries' adapters in this workspace haven't been upgraded yet.
  Aligning is a tracked follow-up — see the catalog comment in
  `pnpm-workspace.yaml`. Don't try to bump it in passing.
- **`react-router-dom` 7** for any demos that need routing context.

## Adding a new demo

1. Create `src/<component>/<Demo>.tsx`.
2. Re-export from `src/<component>/index.ts`.
3. In `apps/demo`, the demo can be imported directly without a wrapper.

`apps/docs` does **not** consume this package — its ui-react demos live
in `apps/docs/src/components/demos-react/` and import straight from
`@acronis-platform/ui-react` (see `apps/docs/AGENTS.md`).

## What this workspace is NOT for

- **Not** a place for one-off demos that only `apps/demo` uses. Those
  belong in `apps/demo/src/`.
- **Not** a place for shared utility code. Components only.
