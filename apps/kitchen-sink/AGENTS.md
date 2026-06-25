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
  by `ui-react/styles`, so `tokens.ts` imports **every** `css/<Tier>/acronis.css`
  tier tokens-pd ships and injects them once (needed both to render components and
  to enumerate their names). It also exports `tierTokenNames` (tier → its token
  names) and `hasToken`, consumed by the forced-state machinery (below).
- **Brand switching** injects `deep-sky`'s _override-only_ `:root` stylesheets
  (semantic + per-component) on top of the acronis base via `applyBrand` — it is
  not a class toggle. The header's brand `<select>` (`routes/layout.tsx`) drives it.
- **Light/dark** flips `color-scheme` (drives the tokens' `light-dark()`) and
  mirrors `[data-theme]` for ui-react's `dark:` variant (`applyTheme`) — it is
  not a `.dark` class.

> Note (faithful to tokens, not a bug): in **deep-sky + dark**, some surface
> tokens (e.g. `--ui-background-surface-secondary`) lack a distinct dark value
> (`light-dark(x, x)`), so specimen canvases render light on the dark page. This
> is a real deep-sky dark-coverage gap surfaced by the tool, not a kitchen-sink
> issue. Acronis (both schemes) and deep-sky light are fully consistent.

## Routing & layout

The app is a routed SPA (react-router `HashRouter`, so deep links work under
static preview/deploy with no rewrites). `src/App.tsx` is the router root;
`routes/layout.tsx` is the persistent shell: a header (title + brand/theme
toolbar) and a left sidebar nav, with `<Outlet/>` for the page.

- **Brand + light/dark are URL search params** (`?brand=&theme=`), so any view —
  including a single component in a given brand/scheme — is shareable. The
  `KsLink`/`KsNavLink` wrappers (`lib/nav.tsx`) carry the active query across
  internal navigation, since react-router otherwise drops it.

Routes: `/` (overview) · `/tokens` (Semantic / Component tabs) · `/typography` ·
`/icons` · `/components` (index grid) · `/components/:slug` (one per component).

## Component specimens (`src/components/`)

`registry.tsx` is the single source of truth for the component routes (drives the
sidebar, the `/components` index, and `:slug` routing). Each component has its own
`<name>.tsx` exporting a **specimen** — a Figma-style sheet of its states.

- `lib/specimen.tsx` holds the shared primitives: `StateGrid` (variants × states),
  `Stage`, `SpecimenPage`, `Subsection`, `SampleRow`, `Field`, and the key
  `forcedVars`/`Forced`. **Forced states**: real `:hover`/`:active`/`:focus` only
  fire on interaction, so a static cell is pinned by remapping the component's
  `--ui-<tier>-…-idle` custom properties to their `-<state>` siblings on a wrapper
  (the remap cascades into nested DOM — a Switch thumb, a Checkbox box). `disabled`
  uses the component's own prop; `focus` adds the design's focus ring (tier-aware:
  `--ui-focus-primary` for form controls, `--ui-focus-brand` for buttons).
- Coverage matches `ui-react` exports: Avatar, Breadcrumb, Button, ButtonIcon,
  ButtonMenu, CardFilter, Checkbox, Input, InputDatePicker, InputSearch,
  InputSelect, InputText, InputTextArea, Link, Radio, Resizable, Search,
  SearchGlobal, Select, SidebarPrimary, SidebarSecondary, Switch, Tag, Tooltip.

## Foundations sections (`src/sections/`)

- `colors.tsx` — exports `SemanticColors` / `ComponentColors` / `TokensIntro`
  (used by `routes/tokens.tsx`); enumerates `--ui-*` custom properties parsed in
  `src/lib/tokens.ts`, values resolving live per brand/scheme.
- `typography.tsx` — the `.ui-typography-*` utility classes, each a live sample +
  its metrics. `icons.tsx` — galleries for all four `icons-react` packs.
- `elements.tsx` — kept but **not routed** (raw HTML elements as the reset renders
  them); re-enable if a base element layer ships.

## Run

```sh
pnpm --filter @acronis-platform/kitchen-sink dev   # builds deps, then serves on :3001
```
