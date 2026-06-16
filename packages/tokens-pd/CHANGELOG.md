# @acronis-platform/tokens-pd

## 1.1.0

### Minor Changes

- [#273](https://github.com/acronis/uikit/pull/273) [`1ef2702`](https://github.com/acronis/uikit/commit/1ef27023038cbc4194dac666b4f020e105670b91) Thanks [@leonid](https://github.com/leonid)! - Refresh design tokens from Figma and migrate the component tier to the next-gen Figma component architecture.

  **Primitives / semantic (breaking, pre-1.0):** rename semantic `status-inverted.*` → `status-strong.*`, `inverted-surface.*` → `inverted.*`, and `border.on-status.*-dark` → `*-strong`. Add the `ink` palette, `units.size-20`, a `transparent.clear` stop, semantic `glyph.on-status.ai`, the `status-strong` background family, `background.status.ai{,-hover,-pressed}`, `background.brand.primary-focus`, and `typography.link.default` / `link.default-underline`. The `brand-b` mode is removed (its values were dropped upstream in Figma); `tokens-pd` no longer emits `brand-b.css` / `brand-b` presets.

  **Component tier (breaking, pre-1.0):** the component tokens now source the next-gen `brand.components` Figma tier instead of the retired `componentLegacy` group. Components emitted: `breadcrumb`, `button`, `button-icon`, `checkbox`, `input`, `menu-item`, `sidebar-primary`, `sidebar-secondary`, `switch`, `tag`, `tooltip` (plus `icon` / `tree`, retained from legacy — no next-gen equivalent yet). This replaces the previous `chip` / `form` / `sidebar` / `item` components.

  Naming follows the next-gen contract ("Option A — faithful"): PascalCase component → kebab (`ButtonIcon` → `button-icon`), camelCase leaf → kebab (`borderRadius` → `border-radius`, `paddingX` → `padding-x`), `_global` → `global`, and the redundant `color` property word is dropped for color tokens only (`Button/ai/container/color/idle` → `--ui-button-ai-container-idle`; compound names like `borderColor` keep their suffix → `border-color`). The token shape is deeply nested: `<component>-<variant|global>-<role>-<property>[-<state>]`.

  The `colors.background.ai.*` gradients keep their intended **horizontal** (`90deg`) orientation; component AI references (`button.ai.*`, `tag.ai.*`) resolve to them via an alias rewrite (`{semantics.gradients.ai.*}` → `colors.background.ai.*`). `textStyle` literals resolve to `typography.*`.

  **Known gaps (warned, not fatal):** 8 `$type:string` component tokens are skipped because the token schema has no `string` type — `Button.*.container.borderStyle` (`"solid"`), `Switch._global.box.borderStyle`, and `Button.ghost.label.textDecoration.*` (`"underline"`/`"none"`); consumers hard-code these for now. Fully-transparent `#FF00FF00` stops inline as `rgb(255 0 255 / 0)` (hue irrelevant at alpha 0).

  Regenerated all `tokens-pd` artifacts (CSS, DTCG, Tailwind presets). The Tailwind preset builder skips unroutable component-tier color/gradient tokens with a warning instead of failing the build (semantic tokens still must route), so deeply-nested component roles (`box`, `tick`, `container`) stay in the CSS/tiers — consumers bind `var(--ui-*)` directly — but are omitted from the Tailwind preset.

  `ui-react`: re-theme the `Switch` and `Tooltip` components to the next-gen token names. `Tooltip` moves to `--ui-tooltip-container-border-radius`. `Switch` moves to the new `box`/`tick` model — track fill wired per checked-state (`--ui-switch-off-box-idle` / `--ui-switch-on-box-idle`, green), disabled to `--ui-switch-{on,off}-box-disabled` + `--ui-switch-global-tick-disabled` with a 1px inset `--ui-switch-global-box-border-color-disabled` border; the thumb is the single `--ui-switch-global-tick-*` color regardless of on/off (hover/active stops equal idle, so no hover color change). `ui-react/styles` swaps its dead `css/form` import for `css/input` + `css/checkbox` and adds `css/button-icon`.

  `ui-react` (continued): re-theme `Button`, `ButtonIcon`, `Breadcrumb`, `Checkbox`, and `Input` to the next-gen component tokens — they previously referenced dead token names (the retired `componentLegacy` / `--ui-form-*` tiers) and rendered unstyled. `Button` maps `background` → `container`, keeps `label`, adds per-state `icon` colors, and now only `secondary` / `inverted` carry a container border (others are borderless); geometry is tokenized via `--ui-button-global-container-*` and per-variant `padding-x` / `width-min` (`ghost` has 0 padding-x and no min-width). `ButtonIcon` moves to the borderless `--ui-button-icon-global-*` container/icon tokens. `Breadcrumb` moves to `link-label-<state>` (now darkening on hover/active), `page-label-color`, `separator-icon-{color,size}`, and `list-gap`. `Checkbox` moves to the dedicated `--ui-checkbox-{unchecked,checked,indeterminate}-box[-border-color]-<state>` + `-icon-` tiers with `global-box-*` geometry. `Input` moves to `--ui-input-{global-box,normal-box-border-color,error-box-border-color,content-value,content-placeholder}-*`. Visual-regression baselines regenerated in Docker for all re-themed components. Still pending: `Radio`, `Search`, `Select` remain on the removed `--ui-form-*` tier (Figma has no next-gen tokens for them yet) — a design prerequisite, tracked separately.

### Patch Changes

- Updated dependencies [[`1ef2702`](https://github.com/acronis/uikit/commit/1ef27023038cbc4194dac666b4f020e105670b91)]:
  - @acronis-platform/design-tokens@1.1.0

## 1.0.0

### Major Changes

- [#272](https://github.com/acronis/uikit/pull/272) [`d95fc1e`](https://github.com/acronis/uikit/commit/d95fc1e809f3f4fe0c62f0c92d0f48b81976765d) Thanks [@heygabecom](https://github.com/heygabecom)! - # `1.0.0` — first stable token release

  This is the first stable (`1.0.0`) release of the published token packages. It
  consolidates the entire `feature/design-tokens-update` line of work into one
  release rather than a chain of pre-`1.0` patch/minor bumps. Treat the prior
  `0.x` token JSON and `tokens-pd` output as superseded: paths, value shapes, and
  generated CSS variable names have all changed since the last published `0.x`.

  The two packages move in lockstep — `tokens-pd` is fully regenerated from
  `design-tokens` by `tools/style-dictionary`, so every `design-tokens` change
  below is reflected in the corresponding `tokens-pd` artifacts.

  ***

  ## `@acronis-platform/design-tokens` (→ `1.0.0`)

  ### Token value shape — native DTCG dimensions (BREAKING)
  - Dimension tokens (`$type: "dimension"` — `units.*`, `font.font-size`,
    `font.line-height`, `font.letter-spacing`, and every component dimension)
    now carry a **native DTCG** `$value: { value, unit }` (unit `px`/`rem`).
  - The custom `$extensions.com.acronis.units` value carrier (and its short-lived
    `{ components, dimensionSpace }` intermediate) is **removed**. Dimensions no
    longer stash their value in `$extensions`.
  - `fontWeight` and `fontFamily` are scalar DTCG types and carry a plain
    `$value` — a `number` for weight, a `string`/array for family — not a
    dimension object.
  - The schema descriptions were updated to native DTCG language to match.

  ### Schema file renamed `tokens.schema.json` → `tier.schema.json` (BREAKING)

  The validating schema moved from `schemas/tokens.schema.json` to
  `schemas/tier.schema.json`. It describes the structure of a whole **tier file**
  (`tiers/*.json`) — how tokens are grouped and nested within a tier, not just a
  single token — so the name now reflects what it validates.
  - The `$schema` value embedded in every tier file is now
    `"../schemas/tier.schema.json"` (the schema enforces this exact string as a
    `const`, so the file and its tier data move in lockstep).
  - The schema's own `$id` is updated to match.
  - Consumers that reference the schema by path (or key off the `$schema`
    discriminator string) must update to `tier.schema.json`. The package's
    `exports` map already exposes `./schemas/*`, so the import subpath simply
    changes filename.

  ### Transparent rule (BREAKING for affected leaves)

  A fully-transparent color (`alpha: 0`) is emitted as the CSS keyword
  `transparent` instead of an HSL object. Figma stores zero-alpha colors with
  arbitrary channels (often a magenta placeholder), so the RGB channels are
  meaningless. This applies to `palette.transparent.*` primitives and any
  component literal color at `alpha: 0`.

  ### Naming — camelCase aligned with Figma (BREAKING)

  Token segment names are kept **verbatim from Figma** (camelCase), no longer
  kebab-converted by the emitter:
  - `on surface` → `onSurface`, `on brand` → `onBrand`, etc. (all `on *` groups).
  - `status-strong` → `statusStrong`.
  - Component/SubComponent names stay PascalCase (e.g. `MenuItemList`).

  Note: the generated CSS custom-property names are unaffected — Style Dictionary
  kebab-cases path segments into variable names, so `--ui-…-on-surface-…` is
  preserved for consumers.

  ### Tiers rebuilt from Figma (BREAKING)
  - **Semantics** (`tiers/semantic.json` → `tiers/semantics.json`, renamed):
    added the build-time `com.acronis.tailwindRoles` routing extension; removed
    the `brand-b` values mode; renamed token paths; deleted obsolete tokens;
    relocated the four AI gradients to a top-level `gradients.*` root, and a
    gradient-valued border (`border.onStatus.ai-strong`) now resolves through a
    proper `{gradients.ai.idle}` alias rather than a literal CSS string.
  - **Components** (`tiers/components.json`): rebuilt from Figma's
    `Brand/components` group; the `Input` component was renamed to `InputText`
    (the entire `input.*` namespace → `input-text.*`); added `breadcrumb`,
    `checkbox`, `switch`, `tag`; component-level typography tokens now correctly
    carry `$type: "typography"` so they render as `.typography-*` utility classes
    (previously emitted as malformed CSS variables).
  - **Primitives** (`tiers/primitives.json`): added the Ink palette ramp and the
    `size-20` unit.

  ### Formatting — emitter owns tier format
  - All tier JSON (`tiers/*.json`) and the `tokens-pd/dtcg/*` mirrors are now
    **fully alphabetically ordered** (numeric keys stay numeric); the emitter's
    formatter matches the prior Prettier line/inline conventions (printWidth 80).
  - `tiers/` is added to `.prettierignore` so the emitter — not Prettier — owns
    the on-disk format.

  ### Sync pipeline

  The `/figma-to-design-tokens` skill (a self-contained pipeline: pull →
  snapshot-build → diff → emit, with a human-reviewable diff gate) replaces the
  legacy temporary pull scripts as the canonical token-sync path.

  ### Context docs — removed `brand-matrix.md`

  `context/brand-matrix.md` is deleted. It carried information that was untrue,
  out of scope for this data-only package, or already owned by another context
  file:
  - **Wrong vocabulary.** It called the `light` / `dark` axis a "Color mode",
    but `glossary.md` defines that axis as **Theme** — reusing an established
    term with a different meaning.
  - **Out-of-scope implementation details.** It referenced the legacy `--av-*`
    CSS prefix and the `oklch` color space; CSS variable names and the output
    color space are the translation tool's concern, not the token data.
  - **Out-of-scope "Delivery model".** Emitted stylesheets, override-only files,
    and `light-dark()` composition belong to
    `@acronis-platform/style-dictionary` → `@acronis-platform/tokens-pd`, not to
    the data package.
  - **Untrue / unmaintained roadmap content.** The "Brand override surface" table
    (keyed by `--ui-*` output variables) and "The matrix" (a speculative list of
    ~22 legacy brands with partner mappings and guessed dark-mode columns) were
    unverified planning material, not properties of the token data.
  - **Misplaced how-to.** "Adding a brand" belongs in `CONTRIBUTING.md`.

  The accurate, in-scope idea — the Brand axis is data-driven and adding a brand
  is purely additive — is already covered by `glossary.md`, `manifest.md`, and
  `token-contract.md`; references within the design-owned packages are updated in
  the same change.

  ***

  ## `@acronis-platform/tokens-pd` (→ `1.0.0`)

  Full regeneration from `@acronis-platform/design-tokens`. All generated CSS,
  Tailwind presets, and the DTCG mirror reflect every change above.
  - **CSS custom properties**: `--ui-input-*` renamed to `--ui-input-text-*`
    (Input → InputText); new per-component artifacts for `breadcrumb`,
    `checkbox`, `switch`, `tag`; component typography now emits `.typography-*`
    classes.
  - **Transparent**: fully-transparent colors render as the `transparent`
    keyword (`light-dark(transparent, transparent)`), never `rgb(… / 0)`.
  - **Native DTCG**: the Style Dictionary preprocessor passes native
    `$value: { value, unit }` through directly (the custom-carrier normalization
    step is gone); the DTCG mirror is written deep-sorted to match the source
    tiers.
  - **Tailwind**: role-restricted presets regenerated; component color roles are
    routed from the leaf via the data-driven `com.acronis.tailwindRoles` map; keys
    are normalized to lowercase kebab-case.
  - **Gradients**: data-driven gradient rebuild (AI gradients sourced from
    `gradients.*`).

  ## Migration
  - Update any reference to `--ui-input-*` CSS variables to `--ui-input-text-*`.
  - If you consumed `design-tokens` JSON directly, re-read dimension values as
    native DTCG `{ value, unit }` objects and font weight/family as scalars; the
    `$extensions.com.acronis.units` carrier no longer exists.
  - The semantic tier file is now `tiers/semantics.json` (was `semantic.json`),
    and AI gradients live under the top-level `gradients.*` root.

### Patch Changes

- Updated dependencies [[`d95fc1e`](https://github.com/acronis/uikit/commit/d95fc1e809f3f4fe0c62f0c92d0f48b81976765d)]:
  - @acronis-platform/design-tokens@1.0.0

## 0.7.3

### Patch Changes

- [#250](https://github.com/acronis/uikit/pull/250) [`d3541f9`](https://github.com/acronis/uikit/commit/d3541f9c40c5d12f1c464ad68bf42709b89948e5) Thanks [@leonid](https://github.com/leonid)! - Fix the AI background gradient to run **left-to-right** (90deg) instead of
  top-to-bottom, matching the Figma design. The `background.ai` gradient transform
  in design-tokens carried a stale vertical matrix (`[[0,1,0],[-1,0,1]]` → 180deg);
  it is now identity (`[[1,0,0],[0,1,0]]` → 90deg), and `tokens-pd` is regenerated.

  The AI `Button` variant now always leads with the `Sparkles` icon before its
  label, matching the Figma "Ai" button, and sets `bg-origin-border` so the
  gradient covers the full button box (previously a 1px sliver of the gradient's
  opposite end showed on the left and right border edges).

- Updated dependencies [[`d3541f9`](https://github.com/acronis/uikit/commit/d3541f9c40c5d12f1c464ad68bf42709b89948e5)]:
  - @acronis-platform/design-tokens@0.6.1

## 0.7.2

### Patch Changes

- Updated dependencies [[`848c600`](https://github.com/acronis/uikit/commit/848c60036c7591cf1d1ab01996147660c3cca7d5)]:
  - @acronis-platform/design-tokens@0.6.0

## 0.7.1

### Patch Changes

- [#207](https://github.com/acronis/uikit/pull/207) [`8a72145`](https://github.com/acronis/uikit/commit/8a721459e35a405bdf9ef11489e86f68b61a821c) Thanks [@leonid](https://github.com/leonid)! - Emit a web-safe fallback chain for `font-family` instead of the bare design
  family.

  The design tokens carry only the preferred family (`Inter`) — all Figma's
  font-family variables express — so the generated CSS previously rendered
  `font-family: Inter;` with no fallback. If Inter isn't loaded, the browser
  dropped straight to its default serif. The `typography/css-class` transform now
  appends a generic fallback chain at generation time, so the `.ui-typography-*`
  classes (and the matching Tailwind `fontFamily` preset keys) render
  `font-family: Inter, system-ui, sans-serif;` and degrade gracefully.

  The fallback is keyed on the preferred family (`Inter` → `system-ui,
sans-serif`, `IBM Plex Mono` → `ui-monospace, monospace`), defaulting to
  `sans-serif`. The token source is unchanged; this is purely a CSS-output
  concern. Affects the regenerated semantic CSS and Tailwind presets (both
  brands).

- [#204](https://github.com/acronis/uikit/pull/204) [`beae4ff`](https://github.com/acronis/uikit/commit/beae4ffd3dd4cd8742300c8906e7e18cef8693ee) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Fix Tailwind color routing for component tokens with multiple role-like
  segments, and normalize leading-underscore key segments.

  `routeColor` previously scanned a token path left-to-right and stopped at the
  first role-like segment, so `button.icon.background.idle` was misrouted to the
  `icon` role instead of `background` — emitting the wrong namespace/key. It now
  scans right-to-left, so the role segment **closest to the leaf** wins
  (`button-icon-idle` under `backgroundColor`/`textColor`/`borderColor`).

  Key segments are now normalized too: leading underscores are stripped, so
  `tree._global.background.selected` emits `tree-global-selected` instead of
  `tree-_global-selected` — matching the `--ui-*` CSS variable naming the
  `name/ui` transform already produces.

  Affects the regenerated `button`, `form`, and `tree` Tailwind component
  presets (both brands).

## 0.7.0

### Minor Changes

- [#202](https://github.com/acronis/uikit/pull/202) [`bd63c2a`](https://github.com/acronis/uikit/commit/bd63c2ae80bcab09acb1bc558d01951e2c38af83) Thanks [@heygabecom](https://github.com/heygabecom)! - Add shadow-DOM support to the token CSS and modernize the Tailwind preset naming.

  **CSS — tokens now resolve inside web-component shadow roots.** Every generated
  token CSS file (semantic + per-component, both brands, base and override) now
  targets `:root, :host` instead of `:root` alone, and the theme-switch blocks gain
  shadow-DOM variants:

  ```css
  :root,
  :host {
    color-scheme: light dark;
    --ui-…: …;
  }
  [data-theme='light'],
  :host([data-theme='light']) {
    color-scheme: light;
  }
  [data-theme='dark'],
  :host([data-theme='dark']) {
    color-scheme: dark;
  }
  ```

  Light-DOM consumers are unaffected (`:root` still matches); components that mount
  inside a shadow root now inherit the `--ui-*` custom properties and `light-dark()`
  theming. The `--ui-*` variable names are unchanged.

  **Tailwind preset — role-restricted namespaces, no repeated role word, no `ui-`
  prefix.** Colors were previously a single `colors` map with the role baked into
  the key, producing redundant, non-idiomatic utilities (`bg-ui-background-surface-primary`,
  and even nonsensical `text-ui-background-*`). Tailwind's model is that the theme
  key names the utility, so colors now live in role-specific namespaces and the role
  word + `ui-` prefix are dropped from the key:

  | Before                                 | After                      |
  | -------------------------------------- | -------------------------- |
  | `bg-ui-background-surface-primary`     | `bg-surface-primary`       |
  | `text-ui-text-on-surface-primary`      | `text-on-surface-primary`  |
  | `border-ui-border-on-surface-border`   | `border-on-surface-border` |
  | `bg-ui-glyph-on-surface-primary`       | `fill-on-surface-primary`  |
  | (focus tokens, previously in `colors`) | `ring-brand`               |
  | `bg-ui-background-ai-idle`             | `bg-ai-idle`               |

  `glyph.*` (icon) tokens map to `fill` because icons paint via `fill`/`stroke`
  (`currentColor`); this also keeps them from colliding with `text.*` keys that
  share leaf names. Gradients stay in the `backgroundImage` namespace — the only
  one that emits a `background-image` utility (a solid `*-color` can't hold a
  gradient). Dimension/typography keys drop the `ui-` prefix too
  (`button-global-gap`, `typography-body-default`). The `--ui-*` CSS variables that
  consumers actually bridge (via `@theme inline`) are unchanged.

  **Tailwind preset is now split per tier, so component utilities stay opt-in.**
  A single flat `tailwind/<brand>.js` is replaced by a shared semantic preset plus
  one preset per component:

  ```
  tailwind/<brand>/tokens.js                     # shared vocabulary (bg-surface-primary, …)
  tailwind/<brand>/components/button.js          # button tokens only
  tailwind/<brand>/components/form.js
  …
  ```

  Anything in a Tailwind theme is globally suggested by IntelliSense, so component
  tokens were leaking into autocomplete everywhere. Loading `tokens.js` for the
  shared vocabulary plus only the component presets a build needs keeps each
  component's utilities (`bg-button-primary-idle`, …) scoped to where it's used.

  This renames the Tailwind preset's public paths and keys. It has no consumers in
  this repo today (consumers use the CSS variables, not the JS preset), so the
  change is safe in practice; it is released as a minor on the `0.x` line and
  called out here for the record.

## 0.6.0

### Minor Changes

- [#198](https://github.com/acronis/uikit/pull/198) [`8cbe6cf`](https://github.com/acronis/uikit/commit/8cbe6cfb891cf59a2fe3c006a0ef8a08d06806ee) Thanks [@heygabecom](https://github.com/heygabecom)! - Rename `@acronis-platform/design-theme` → `@acronis-platform/tokens-pd` and rebuild it from the Style Dictionary pipeline.

  **`@acronis-platform/tokens-pd` (was `@acronis-platform/design-theme`) — breaking:**
  - **Package renamed.** Update the dependency and all import specifiers from
    `@acronis-platform/design-theme` to `@acronis-platform/tokens-pd`.
  - **Homegrown build retired.** The package no longer runs its own Style
    Dictionary script; it is now the published home for the output of
    `@acronis-platform/style-dictionary`, which is generated and committed.
  - **Exports replaced.** The `./css`, `./scss`, and `./js` exports are removed.
    Output is grouped into `css/`, `tailwind/`, and `dtcg/` dirs.
    - `./css` → `./css/acronis.css` (semantic tier, default brand) and, per
      component, `./css/<component>/acronis.css`.
    - Non-default brands ship as **override-only** files (`./css/brand-b.css`,
      `./css/<component>/brand-b.css`) — import the base then the override (last wins).
    - `./scss` and `./js` (the `tokens`/`groups`/`TokenName` map) are dropped.
    - New: `./tailwind/<brand>.js` (Tailwind presets, baked values, via `@config`)
      and `./dtcg/*.json` (the DTCG intermediate).
  - **Custom-property naming changed.** The `--av-*` prefix is gone. Names now drop
    the `colors` tier segment and use a `--ui-*` prefix:
    `--av-colors-background-surface-primary` → `--ui-background-surface-primary`.
  - **Theming mechanism changed.** Light/dark is driven by `light-dark()` +
    `color-scheme`, toggled with the `[data-theme]` attribute (`<html
data-theme="dark">`) instead of a `.dark` class. Brands are bare `:root`
    overrides (no `.brand-b` class) — one brand per app.
  - **Gradients** are now emitted (`--ui-background-ai-*`), and typography ships as
    `.ui-typography-*` utility classes.

  **`@acronis-platform/ui-react`:**
  - Now themed by `@acronis-platform/tokens-pd` (was `@acronis-platform/design-theme`).
  - The `@theme inline` bridge maps onto the new `--ui-*` names; the `dark:` variant
    now keys off the `[data-theme="dark"]` attribute instead of the `.dark` class.
    Consumers that previously toggled a `.dark` class must switch to `data-theme`.
  - The `ai` button variant's gradient (`--ui-background-ai-*`) is now defined.

## 0.5.1

### Patch Changes

- Updated dependencies [[`23b62d4`](https://github.com/acronis/uikit/commit/23b62d49263276956b46d34cdd084003c9fd566b)]:
  - @acronis-platform/design-tokens@0.5.0

## 0.5.0

### Minor Changes

- [#94](https://github.com/acronis/uikit/pull/94) [`9e418d6`](https://github.com/acronis/uikit/commit/9e418d6fb7e4e52182e96dc26418daf82fde8c25) Thanks [@leonid](https://github.com/leonid)! - Add Figma Code Connect support to `ui-react` and align the Button with the
  Figma "Button" component.
  - **`ui-react`**: new Figma Code Connect setup (`figma.config.json`,
    co-located `*.figma.tsx` files, `figma:connect*` scripts) linking
    components to their Figma counterparts. The `Button` is fully connected and
    its variants now match the Figma `Style` set: added `ai` (gradient) and
    `inverted` variants, and re-pointed `default` / `secondary` / `ghost` /
    `destructive` to the colors used in the mockup via button-local
    `--color-btn-*` token bridges (the shared `--color-*` tokens are unchanged).
    The legacy-only `outline` / `link` / `translucent` variants are retained for
    parity with the shared demos.
  - **`design-tokens`**: added the `colors.background.inverted-surface` semantic
    tokens (idle / hover / active / disabled) that back the inverted button.
  - **`design-theme`**: emits the new
    `--av-colors-background-inverted-surface-*` custom properties.

### Patch Changes

- Updated dependencies [[`9e418d6`](https://github.com/acronis/uikit/commit/9e418d6fb7e4e52182e96dc26418daf82fde8c25)]:
  - @acronis-platform/design-tokens@0.4.0

## 0.4.0

### Minor Changes

- [#89](https://github.com/acronis/uikit/pull/89) [`61fe683`](https://github.com/acronis/uikit/commit/61fe68389b42f482fe9f7a07ab0f14ebad6c12d1) Thanks [@leonid](https://github.com/leonid)! - Two additions:
  - **All authored brands** are emitted, not just `acronis`. The default brand
    stays on `:root` / `.dark`; every other brand (currently `brand-b`) is a
    class-scoped override (`.brand-b`, `.brand-b.dark`) containing only the
    tokens that differ, so consumers switch brand by toggling a class. The
    `./js` export now ships `brands`, `defaultBrand`, per-brand `tokens`, and a
    `groups` array (tokens organized by category for display).
  - **Gradient tokens** are now emitted. Color-stop arrays become CSS
    `linear-gradient(...)`, with the angle derived from the Figma
    `com.figma.gradientTransform` matrix (e.g. `colors.background.ai.*`).

  Note: `brand-b` currently produces no overrides — it matches `acronis` on
  every color token and inherits its gradients. The mechanism is ready for when
  the brand data diverges.

## 0.3.0

### Minor Changes

- [#89](https://github.com/acronis/uikit/pull/89) [`61fe683`](https://github.com/acronis/uikit/commit/61fe68389b42f482fe9f7a07ab0f14ebad6c12d1) Thanks [@leonid](https://github.com/leonid)! - Emit **all authored brands**, not just `acronis`. The default brand stays on
  `:root` / `.dark`; every other brand (currently `brand-b`) is generated as a
  class-scoped override (`.brand-b`, `.brand-b.dark`) containing only the tokens
  that differ from the default, so consumers switch brand by toggling a class.
  The `./js` export now ships `brands`, `defaultBrand`, and per-brand `tokens`
  (the existing `light` / `dark` exports remain, pointing at the default brand).

  Note: `brand-b` currently differs from `acronis` only in AI gradient tokens,
  which the color-only build skips, so it produces no overrides yet — the
  mechanism is ready for when the brand data diverges.

## 0.2.0

### Minor Changes

- [#80](https://github.com/acronis/uikit/pull/80) [`1687cc9`](https://github.com/acronis/uikit/commit/1687cc9336de74d53521d8e6ef9097763a0a9bb0) Thanks [@leonid](https://github.com/leonid)! - Introduce two new published packages:
  - `@acronis-platform/design-theme` — generates consumable CSS / SCSS / JS theme
    artifacts from `@acronis-platform/design-tokens` via Style Dictionary, resolving
    the per-scheme (light/dark) and per-brand token matrix into `--av-*` CSS
    custom properties.
  - `@acronis-platform/ui-react` — the next-generation Acronis React
    component library built on Base UI (`@base-ui/react`) and themed by
    `@acronis-platform/design-theme`. Ships `Button` and `Switch` with tests and
    Storybook stories as the reference pattern.
