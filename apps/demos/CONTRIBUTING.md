# Contributing to `@acronis-platform/shadcn-uikit-demos`

This is the **source-only** shared demos workspace — reusable demo
components consumed by `apps/demo`. **Private**, not published,
**no changeset needed**.

See [the root CONTRIBUTING.md](../../CONTRIBUTING.md) for the umbrella
process. See [AGENTS.md](AGENTS.md) for technical context (the
source-only consumption pattern, peer deps, what this workspace is NOT for).

`apps/docs` does not consume this package — its ui-react demos live
directly in `apps/docs/src/components/demos-react/` (see
[apps/docs/AGENTS.md](../docs/AGENTS.md)).

## What goes here

- A demo component reused across multiple `apps/demo` pages.
- The official, canonical demo for a published library component.

If only one consumer needs the demo, put it in `apps/demo/src/`
instead and skip this workspace.

## What does NOT go here

- One-off demos used only by `apps/demo`. Those belong in `apps/demo/src/`.
- Shared utility code. Components only.
- Production logic — these are demonstrations.
- Tests. This workspace has no automated test suite (and no `test` / `test:watch` scripts).

## Workflow

1. Create `src/<component>/<DemoName>.tsx` exporting your demo component.
2. Re-export it from `src/<component>/index.ts` so the `./*` exports map
   picks it up:
   ```ts
   // src/button/index.ts
   export * from './ButtonBasic';
   export * from './ButtonVariants';
   ```
3. **For `apps/demo` consumption**: import directly without a wrapper.

## Verification

```bash
pnpm --filter @acronis-platform/shadcn-uikit-demos typecheck
pnpm --filter @acronis-platform/shadcn-uikit-demos lint
```

There is no build step and no test suite in this workspace. Verify your
demo renders by running `apps/demo` with the demo wired in.

## Dependency version note

This workspace pins **zod 3** (`3.25.76`). `apps/demo` and
`packages/ui-legacy` are on **zod 4**. The form library adapters in
this workspace (`@tanstack/zod-form-adapter`) haven't been upgraded
yet. **Don't bump zod here in passing** — it's a tracked follow-up.
See the catalog comment in `pnpm-workspace.yaml`.

## No changeset needed

This workspace is in `.changeset/config.json`'s `ignore` list.
