# @acronis-platform/tokens-pd

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
