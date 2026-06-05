---
'@acronis-platform/tokens-pd': minor
---

Add shadow-DOM support to the token CSS and modernize the Tailwind preset naming.

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
