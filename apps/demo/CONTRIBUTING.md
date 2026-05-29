# Contributing to `@acronis-platform/shadcn-uikit-demo`

This is the Vite-based demo SPA used to exercise the published library
in realistic flows. **Private**, not published, **no changeset needed**.

See [the root CONTRIBUTING.md](../../CONTRIBUTING.md) for the umbrella
process. See [AGENTS.md](AGENTS.md) for technical context (stack,
running locally, what the workspace is for).

## What goes here

- Demo pages for new library components or compound flows.
- Manual reproductions of bugs in the library before fixing them upstream.
- i18n strings for new demo content.

If a demo is reusable across both this app and `apps/docs`, build it in
`apps/demos` and import it here instead of duplicating.

## What does NOT go here

- Tests. The `test` script is a no-op by design. Coverage for library
  behavior belongs in `packages/legacy/ui`'s Vitest + Storybook suites.
- Reusable demo components. Those live in `apps/demos`.
- Production logic. This app is for **demonstration**, not real users.

## Workflow

1. `pnpm --filter @acronis-platform/shadcn-uikit-demo dev` →
   `http://localhost:3000`.
2. Add or update pages under `src/`.
3. If you're showcasing a new library component, add it to the
   navigation/router so reviewers can find it.
4. Verify in light **and** dark mode and across the shipped themes
   (`acronis-default`, `acronis-ocean`, `cyber-chat`, `acronis-white-label`).
5. Verify i18n: switch language at least once if your change touches
   user-facing strings.

## Verification

```bash
pnpm --filter @acronis-platform/shadcn-uikit-demo typecheck
pnpm --filter @acronis-platform/shadcn-uikit-demo lint
pnpm --filter @acronis-platform/shadcn-uikit-demo build  # production build
pnpm --filter @acronis-platform/shadcn-uikit-demo preview
```

Manual smoke testing in `pnpm dev` is the primary verification. There
is no automated test suite by design.

## Dependency version note

This workspace is on **zod 4** (matching `packages/legacy/ui`). The
sibling `apps/demos` workspace is still on zod 3 — don't try to align
the two in passing. See `pnpm-workspace.yaml`'s catalog comment.

## No changeset needed

This workspace is in `.changeset/config.json`'s `ignore` list. Changes
here do not cut a release.
