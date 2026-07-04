# AGENTS.md — `apps/kitchen-sink`

`@acronis-platform/kitchen-sink` — a single-page "kitchen sink" that renders
**everything at once**: the `--ui-*` design tokens / colors (from
`@acronis-platform/tokens-pd`), default HTML element styles, the implemented
`@acronis-platform/ui-react` components, and the `@acronis-platform/icons-react`
packs. A visual reference / QA surface. **Private**, not published.

Cross-cutting topics live in `../../context/*.md`. This file documents only
what's specific to this workspace.

## It consumes the libraries like a real consumer (from `dist`)

Unlike `apps/demo` (which aliases the legacy library to source), this app
imports `@acronis-platform/ui-react` and `@acronis-platform/icons-react` by
**package name**, resolved from their built `dist`. So the page reflects what
a published consumer actually gets.

Consequence: the dependency libraries must be built before this app's `dev`,
`build`, or `typecheck` resolves them.

- `predev` / `prebuild` run `pnpm --filter "@acronis-platform/kitchen-sink^..." build`
  (builds `ui-react`, `icons-react`, and their deps in topological order).
- For `pnpm -r typecheck` (CI / pre-commit), CI builds those packages first
  (see `.github/workflows/ci.yml`, mirroring the `ui-legacy` step). `pnpm -r`
  is topological, so a plain `pnpm -r build` also builds them before this app.

## Styling & tokens

`src/main.tsx` imports `@acronis-platform/ui-react/styles` — the built CSS that
bundles the reset (default element styles), the **semantic** `--ui-*` tokens
(`@acronis-platform/tokens-pd/css/acronis.css`), and the component utilities.
The page's own layout uses inline styles + `var(--ui-*)` tokens; there is **no
Tailwind pipeline here**.

`src/lib/tokens.ts` owns the rest of the token wiring, because tokens-pd's
delivery model differs from the retired `design-theme`:

- **Per-component tokens** (`--ui-button-*`, `--ui-switch-*`, …) are NOT bundled
  by `ui-react/styles`, so `tokens.ts` imports the `css/<component>/acronis.css`
  files and injects them once (needed both to render components and to enumerate
  their names).
- **Brand switching** injects `brand-b`'s _override-only_ `:root` stylesheet
  (`applyBrand`) — it is not a class toggle.
- **Light/dark** flips `color-scheme` (drives the tokens' `light-dark()`) and
  mirrors `[data-theme]` for ui-react's `dark:` variant (`applyTheme`) — it is
  not a `.dark` class.

## Sections (`src/sections/`)

- `colors.tsx` — enumerates `--ui-*` custom properties (semantic + per-component,
  e.g. `--ui-button-*`) parsed from the tokens-pd CSS in `src/lib/tokens.ts`;
  values resolve live per brand/scheme.
- `typography.tsx` — the `.ui-typography-*` utility classes (headings/body/link/
  caption/note/fineprint), each shown as live sample text + its name and metrics.
- `elements.tsx` — raw HTML elements (headings, lists, table, native form
  controls) as the reset renders them. **Currently hidden**: the library only
  applies Tailwind Preflight (which normalizes/strips bare-tag styling) — the DS
  styles via `.ui-typography-*` utilities / components, not bare tags — so the
  section showed only the reset baseline. The file is kept (not wired into
  `SECTIONS` in `App.tsx`) so it can be re-enabled if a base element layer ships.
- `components.tsx` — `ui-react` `Button` (variants/sizes/states/with-icons) and
  `Switch`.
- `icons.tsx` — galleries for all four `icons-react` packs.

## Run

```sh
pnpm --filter @acronis-platform/kitchen-sink dev   # builds deps, then serves on :3001
```
