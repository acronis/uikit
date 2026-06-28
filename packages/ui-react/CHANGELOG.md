# @acronis-platform/ui-react

## 0.5.0

### Minor Changes

- [#210](https://github.com/acronis/uikit/pull/210) [`6d188d2`](https://github.com/acronis/uikit/commit/6d188d21e719a5af7ad7589f3f5227b32cfb4f53) Thanks [@leonid](https://github.com/leonid)! - Align Button with the Figma design and add a dedicated ButtonIcon component.

  **Button** now wires every style and interaction state directly to the
  dedicated `--ui-button-*` component tokens (from `@acronis-platform/tokens-pd`)
  instead of borrowing shared semantic tokens:
  - Disabled states use the design's explicit per-variant disabled colors instead
    of a blanket `opacity-50`.
  - The focus ring uses the `--ui-focus-*` tokens.
  - Secondary now uses its dedicated border/background/label tokens (previously a
    generic `border-border` + surface-hover), and Ghost is a plain colored-text
    button (the underline-on-hover was removed to match the design).

  **ButtonIcon** is a new icon-only button (32×32, 16px glyph) mirroring the Figma
  `ButtonIcon` component, wired to the `--ui-button-icon-*` tokens.

  **Breaking changes:**
  - Removed the non-design Button variants `outline`, `link`, and `translucent`.
    The supported variants are now `default` (Primary), `secondary`, `ghost`,
    `destructive`, `ai`, and `inverted`.
  - Removed the Button `size="icon"` option — use the new `ButtonIcon` component
    for icon-only buttons.

## 0.4.2

### Patch Changes

- Updated dependencies [[`8a72145`](https://github.com/acronis/uikit/commit/8a721459e35a405bdf9ef11489e86f68b61a821c), [`beae4ff`](https://github.com/acronis/uikit/commit/beae4ffd3dd4cd8742300c8906e7e18cef8693ee)]:
  - @acronis-platform/tokens-pd@0.7.1

## 0.4.1

### Patch Changes

- Updated dependencies [[`bd63c2a`](https://github.com/acronis/uikit/commit/bd63c2ae80bcab09acb1bc558d01951e2c38af83)]:
  - @acronis-platform/tokens-pd@0.7.0

## 0.4.0

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

### Patch Changes

- Updated dependencies [[`8cbe6cf`](https://github.com/acronis/uikit/commit/8cbe6cfb891cf59a2fe3c006a0ef8a08d06806ee)]:
  - @acronis-platform/tokens-pd@0.6.0

## 0.3.1

### Patch Changes

- Updated dependencies []:
  - @acronis-platform/design-theme@0.5.1

## 0.3.0

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
  - @acronis-platform/design-theme@0.5.0

## 0.2.3

### Patch Changes

- Updated dependencies [[`61fe683`](https://github.com/acronis/uikit/commit/61fe68389b42f482fe9f7a07ab0f14ebad6c12d1)]:
  - @acronis-platform/design-theme@0.4.0

## 0.2.2

### Patch Changes

- Updated dependencies [[`61fe683`](https://github.com/acronis/uikit/commit/61fe68389b42f482fe9f7a07ab0f14ebad6c12d1)]:
  - @acronis-platform/design-theme@0.3.0

## 0.2.1

### Patch Changes

- [#84](https://github.com/acronis/uikit/pull/84) [`3b3fe78`](https://github.com/acronis/uikit/commit/3b3fe7852bbff8c50009648fe49fccbda9526bf2) Thanks [@leonid](https://github.com/leonid)! - Add `@acronis-platform/icons-react` — React icon components generated from
  `@acronis-platform/design-assets`. Ships all four packs via subpath exports
  (`./stroke-mono`, `./solid-mono`, `./stroke-multi`, `./solid-multi`) as
  tree-shakeable per-icon named exports plus an `icons` registry + `IconName`
  type per pack.
  - **mono** packs collapse to `currentColor` (inherit text color); **multi**
    packs keep their authored colors (gradient/clip ids are namespaced per icon
    to avoid collisions).
  - The design-assets scale + stroke rules are baked into a `size` prop, so a
    single 24px master renders at any size with the designed stroke weight
    (1.6px @16, 2px @24, 2.5px @32).

  `@acronis-platform/ui-react` now depends on it so components and stories can
  compose icons (e.g. `<Button><PlusIcon /> Add</Button>`).

- Updated dependencies [[`3b3fe78`](https://github.com/acronis/uikit/commit/3b3fe7852bbff8c50009648fe49fccbda9526bf2)]:
  - @acronis-platform/icons-react@0.2.0

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

### Patch Changes

- Updated dependencies [[`1687cc9`](https://github.com/acronis/uikit/commit/1687cc9336de74d53521d8e6ef9097763a0a9bb0)]:
  - @acronis-platform/design-theme@0.2.0
