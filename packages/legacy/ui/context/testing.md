# Testing — `packages/legacy/ui`

Testing setup for the published UI library. This is the only workspace
in the monorepo with a real test suite; the apps have no-op `test`
scripts by design.

This file is workspace-specific. The choices below (Vitest, RTL,
Storybook + Playwright visual regression, happy-dom, the `__tests__/`
and `__stories__/` layout) are not assumed for any future non-legacy
package — each new workspace picks its own approach.

## Stack

- **Vitest 4** — test runner, assertions, mocking.
- **React Testing Library** — render + query DOM.
- **Storybook 10** — component documentation, plus a Playwright-driven
  visual regression runner.
- **`@storybook/addon-a11y`** — accessibility audits surfaced inside
  Storybook (and asserted in the test runner).

## File placement

- Unit tests: `src/components/ui/<component>/__tests__/<component>.test.tsx`.
- Stories: `src/components/ui/<component>/__stories__/<component>.stories.tsx`.

`tsconfig.build.json` excludes both `.test.tsx` and `.stories.tsx` from
the published type output. Keep the file extensions consistent so the
exclusion globs catch them.

## Vitest setup

- Run all UI tests: `pnpm --filter @acronis-platform/shadcn-uikit test`.
- Watch mode: `pnpm --filter @acronis-platform/shadcn-uikit test:watch`.
- Coverage: `pnpm --filter @acronis-platform/shadcn-uikit test:coverage`.
- DOM environment: **happy-dom** (not jsdom). Configured in `vitest.config.ts`.
- A `localStorage` polyfill is registered in `vitest.setup.ts` because
  happy-dom@20.x + vitest@4.x stopped auto-attaching `window.localStorage`.
  Components that read/write storage (theme toggle, etc.) work without
  per-test scaffolding.

## What to assert

- **Render**: the component renders in its default state.
- **Variants**: each CVA variant applies the expected classes.
- **Props**: prop changes produce the expected DOM/aria changes.
- **Interactions**: click/keyboard interactions fire callbacks or update state.
- **Slots/children**: children render where expected.
- **A11y smoke**: optional, where it adds signal.

Favor targeted assertions over big snapshots. Snapshots are brittle and
review-hostile when components are styled.

## Storybook

- Run: `pnpm --filter @acronis-platform/shadcn-uikit storybook` — opens at `http://localhost:6006`.
- Build static: `pnpm --filter @acronis-platform/shadcn-uikit storybook:build`.
- Visual regression: `pnpm --filter @acronis-platform/shadcn-uikit storybook:test:visual`.
  Runs Playwright against built Storybook; orchestrated by Docker.
- Update snapshots: `pnpm --filter @acronis-platform/shadcn-uikit storybook:test:visual:update`.

Every component needs stories that cover all variants, sizes, and key
states. Use the a11y panel in Storybook to spot violations before
they're caught in CI.

## Reliability

- No randomness, no real timers. Stub explicitly with `vi.useFakeTimers()`,
  `vi.spyOn()`, etc.
- Tests must pass ESLint and Prettier.
- Tests must run deterministically — flake is treated as a failure.
