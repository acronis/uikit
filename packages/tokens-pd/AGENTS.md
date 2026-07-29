# AGENTS.md — `packages/tokens-pd`

`@acronis-platform/tokens-pd` — the **published** home for the Acronis platform
(PD) token artifacts: per-brand CSS custom properties, per-component CSS, Tailwind
presets, and a DTCG intermediate. Everything here is **generated** by
[`@acronis-platform/style-dictionary`](../../tools/style-dictionary) from
[`@acronis-platform/design-tokens`](../design-tokens) and **committed to git**.

Repo-wide rules live in the repo root's `./context/`. This file documents only
what's specific to this workspace.

## This package has no build logic

There are no source files to compile. `pnpm build` simply delegates to the tool:

```sh
pnpm --filter @acronis-platform/tokens-pd build
# → pnpm --filter @acronis-platform/style-dictionary build pd-css pd-tailwind
```

`pd-css`/`pd-tailwind` run their `pd-dtcg` dependency first. The tool writes its
token output directly into this package (paths centralized in the tool's
`src/platforms.ts`). To change a value, edit `@acronis-platform/design-tokens`
and rebuild — never hand-edit the generated files (they carry a DO-NOT-EDIT
header). `dev`/`clean`/`lint`/`typecheck` are no-ops; `test` re-runs the build.

## Layout (all generated, all committed)

Three top-level dirs — `css/`, `tailwind/`, `dtcg/`:

- `css/default.css` — semantic tier, default brand (full): `--ui-*` custom
  properties + `.ui-typography-*` and `.ui-p-*`/`.ui-m-*`/`.ui-gap-*` (+ `.ui-mx-auto`)
  spacing utility classes.
- `css/brand-b.css` — semantic tier, non-default brand: **override-only**.
- `css/<component>/<brand>.css` — component tier, one dir per component
  (`button/`, `breadcrumb/`, …); default brand full, others override-only.
- `tailwind/<brand>/tokens.js` (+ `.d.ts`) — Tailwind preset of the shared
  semantic vocabulary, **baked** values, consumed via `@config`.
- `tailwind/<brand>/components/<component>.js` (+ `.d.ts`) — one preset per
  component, opt-in (load only the ones a build needs so their utilities aren't
  globally suggested).
- `dtcg/*.json` — the six per-mode, 100%-DTCG intermediate files.

## Conventions / scope

- **Naming `--ui-*`.** The `colors` tier root is dropped and every token is
  prefixed with `ui` (`colors.background.surface.primary` →
  `--ui-background-surface-primary`; `button._global.radius` →
  `--ui-button-global-radius`). Owned by the tool's `name/ui` transform.
- **Theming.** Colors are zipped into `light-dark()`; light/dark switches via the
  `[data-theme]` attribute + `color-scheme`. Base (`acronis`) files carry the
  `color-scheme` shell; override files are bare `:root {}` layered on top.
- **Brand model.** Bare `:root` (no brand class). An app picks one brand by
  importing the base + (optionally) that brand's override file — last import wins.
- **Override rule.** A non-default brand file contains a token only when its value
  **differs** from `acronis` or is **new** in that brand.
- **Tailwind presets** carry baked literals (no `--ui-*` dependency), so a preset
  is self-contained but brand selection is build-time (`@config`). Keys follow
  Tailwind's role-namespaced model — colors land in `backgroundColor`/`textColor`/
  `borderColor`/`fill`/`ringColor` with the role word and `ui-` prefix dropped
  (`bg-surface-primary`, `fill-on-surface-primary`, `ring-brand`); gradients in
  `backgroundImage` (`bg-ai-idle`); component dimensions land in `spacing` keyed
  `<component>-<part>` (`p-button-global-gap`). The semantic vocabulary and each
  component ship as **separate** presets so component utilities stay opt-in.
- **Spacing/gap utilities.** Generated directly from the `units.gap` **primitive**
  scale by dedicated build code in the tool (`tokens.ts`'s `resolveGapTokens` +
  `hooks/formats/gap-utility-classes.ts`) — not a semantic token; `design-tokens/
tiers/*.json` is Figma-sourced only and there is no `spacing` group in Figma,
  only `gap`. Emits three ways: `--ui-gap-*` custom properties, framework-agnostic
  `.ui-p-*`/`.ui-px-*`/`.ui-py-*`/`.ui-pt-*`/`.ui-pb-*`/`.ui-pl-*`/`.ui-pr-*`
  (padding), the same seven for `m`/margin, `.ui-gap-*`/`.ui-gap-x-*`/
  `.ui-gap-y-*`, plus a static `.ui-mx-auto` — and `gap-<n>` keys (`p-gap-8`,
  `gap-x-gap-16`) in the shared semantic Tailwind preset's `spacing` namespace,
  deliberately not bare `<n>` so it never collides with Tailwind's own default
  numeric spacing scale. Not brand-dependent, so non-default brand override files
  carry no gap entries.

See `../../context/releasing.md` for the Changesets / publish flow. The tool's
own conventions live in [`../../tools/style-dictionary/AGENTS.md`](../../tools/style-dictionary/AGENTS.md).
